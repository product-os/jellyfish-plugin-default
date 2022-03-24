import { defaultEnvironment } from '@balena/jellyfish-environment';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import type { WorkerContext } from '@balena/jellyfish-worker';
import { strict as assert } from 'assert';
import { testUtils as autumndbTestUtils } from 'autumndb';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { isArray, isNull } from 'lodash';
import nock from 'nock';
import { defaultPlugin, testUtils } from '../../../lib';
import { actionCompletePasswordReset } from '../../../lib/actions/action-complete-password-reset';
import { makePreRequest } from './helpers';

const ACTIONS = defaultEnvironment.actions;
const MAIL_OPTIONS = defaultEnvironment.mail.options;
let balenaOrg: any;
const hash = 'foobar';
const resetToken = crypto
	.createHmac('sha256', ACTIONS.resetPasswordSecretToken)
	.update(hash)
	.digest('hex');

const pre = actionCompletePasswordReset.pre;
let ctx: testUtils.TestContext;
let actionContext: WorkerContext;

beforeAll(async () => {
	ctx = await testUtils.newContext({
		plugins: [productOsPlugin(), defaultPlugin()],
	});
	actionContext = ctx.worker.getActionContext({
		id: `test-${autumndbTestUtils.generateRandomId()}`,
	});

	// Get org and add test user as member
	balenaOrg = await ctx.kernel.getContractBySlug(
		ctx.logContext,
		ctx.session,
		'org-balena@1.0.0',
	);
	assert(balenaOrg);
	await ctx.createLinkThroughWorker(
		ctx.adminUserId,
		ctx.session,
		(await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			ctx.adminUserId,
		))!,
		balenaOrg,
		'is member of',
		'has member',
	);
});

afterAll(async () => {
	return testUtils.destroyContext(ctx);
});

beforeEach(async () => {
	nock(`${MAIL_OPTIONS!.baseUrl}/${MAIL_OPTIONS!.domain}`)
		.persist()
		.post('/messages')
		.basicAuth({
			user: 'api',
			pass: MAIL_OPTIONS!.token,
		})
		.reply(200);
});

afterEach(() => {
	nock.cleanAll();
});

describe('action-complete-password-reset', () => {
	test('should hash new password', async () => {
		const plaintext = autumndbTestUtils.generateRandomId();
		const request = makePreRequest(ctx, actionCompletePasswordReset.contract, {
			requestArguments: { newPassword: plaintext },
		});

		expect.hasAssertions();
		if (pre) {
			const result = await pre(ctx.session, actionContext, request);
			if (!isNull(result) && !isArray(result)) {
				const match = await bcrypt.compare(plaintext, result.newPassword);
				expect(match).toBe(true);
			}
		}
	});

	test('should replace the user password when the requestToken is valid', async () => {
		const username = autumndbTestUtils.generateRandomSlug();
		const user = await ctx.createUser(username, hash);
		const session = await ctx.createSession(user);

		const passwordReset = await ctx.processAction(ctx.session, {
			action: 'action-request-password-reset@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {
				username,
			},
		});
		expect(passwordReset.error).toBe(false);

		const completePasswordReset = (await ctx.worker.pre(ctx.session, {
			action: 'action-complete-password-reset@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {
				resetToken,
				newPassword: autumndbTestUtils.generateRandomId(),
			},
		})) as any;

		// TODO: Remove this workaround
		completePasswordReset.context = completePasswordReset.logContext;
		const completePasswordResetResult = await ctx.processAction(
			session.id,
			completePasswordReset,
		);
		expect(completePasswordResetResult.error).toBe(false);

		const updated = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			user.id,
		);
		assert(updated);
		expect(updated.data.hash).not.toEqual(hash);
		await ctx.flushAll(ctx.session);
	});

	test('should fail when the reset token does not match a valid card', async () => {
		const user = await ctx.createUser(autumndbTestUtils.generateRandomSlug());

		const completePasswordReset = (await ctx.worker.pre(ctx.session, {
			action: 'action-complete-password-reset@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {
				resetToken: 'fake-reset-token',
				newPassword: autumndbTestUtils.generateRandomId(),
			},
		})) as any;
		completePasswordReset.logContext = completePasswordReset.context;

		await expect(
			ctx.processAction(ctx.session, completePasswordReset),
		).rejects.toThrowError();
	});

	test('should fail when the reset token has expired', async () => {
		const username = autumndbTestUtils.generateRandomSlug();
		const user = await ctx.createUser(username, hash);

		await ctx.processAction(ctx.session, {
			action: 'action-request-password-reset@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {
				username,
			},
		});

		const match = await ctx.waitForMatch({
			type: 'object',
			required: ['id', 'type'],
			additionalProperties: true,
			$$links: {
				'is attached to': {
					type: 'object',
					required: ['id'],
					properties: {
						id: {
							type: 'string',
							const: user.id,
						},
					},
				},
			},
			properties: {
				id: {
					type: 'string',
				},
				type: {
					type: 'string',
					const: 'password-reset@1.0.0',
				},
				data: {
					type: 'object',
					additionalProperties: true,
					properties: {
						resetToken: {
							type: 'string',
							const: resetToken,
						},
					},
				},
			},
		});

		const now = new Date();
		const hourInPast = now.setHours(now.getHours() - 1);
		await ctx.worker.patchCard(
			ctx.logContext,
			ctx.session,
			ctx.worker.typeContracts[match.type],
			{
				attachEvents: true,
				actor: ctx.adminUserId,
			},
			match,
			[
				{
					op: 'replace',
					path: '/data/expiresAt',
					value: new Date(hourInPast).toISOString(),
				},
			],
		);
		await ctx.flushAll(ctx.session);

		const completePasswordReset = (await ctx.worker.pre(ctx.session, {
			action: 'action-complete-password-reset@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {
				resetToken,
				newPassword: autumndbTestUtils.generateRandomId(),
			},
		})) as any;

		// TODO: Remove this workaround
		completePasswordReset.context = completePasswordReset.logContext;

		await expect(
			ctx.processAction(ctx.session, completePasswordReset),
		).rejects.toThrowError();
	});

	test('should fail when the reset token is not active', async () => {
		const username = autumndbTestUtils.generateRandomSlug();
		const user = await ctx.createUser(username, hash);
		await ctx.processAction(ctx.session, {
			action: 'action-request-password-reset@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {
				username,
			},
		});

		const match = await ctx.waitForMatch({
			type: 'object',
			required: ['id', 'type'],
			additionalProperties: true,
			$$links: {
				'is attached to': {
					type: 'object',
					required: ['id'],
					properties: {
						id: {
							type: 'string',
							const: user.id,
						},
					},
				},
			},
			properties: {
				id: {
					type: 'string',
				},
				type: {
					type: 'string',
					const: 'password-reset@1.0.0',
				},
				data: {
					type: 'object',
					additionalProperties: true,
					properties: {
						resetToken: {
							type: 'string',
							const: resetToken,
						},
					},
				},
			},
		});

		const requestDelete = await ctx.processAction(ctx.session, {
			action: 'action-delete-card@1.0.0',
			logContext: ctx.logContext,
			card: match.id,
			type: match.type,
			arguments: {},
		});
		expect(requestDelete.error).toBe(false);

		const completePasswordReset = (await ctx.worker.pre(ctx.session, {
			action: 'action-complete-password-reset@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {
				resetToken,
				newPassword: autumndbTestUtils.generateRandomId(),
			},
		})) as any;

		// TODO: Remove this workaround
		completePasswordReset.context = completePasswordReset.logContext;

		await expect(
			ctx.processAction(ctx.session, completePasswordReset),
		).rejects.toThrowError();
	});

	test('should fail if the user becomes inactive between requesting and completing the password reset', async () => {
		const username = autumndbTestUtils.generateRandomSlug();
		const user = await ctx.createUser(username, hash);
		const session = await ctx.createSession(user);

		const passwordReset = await ctx.processAction(ctx.session, {
			action: 'action-request-password-reset@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {
				username,
			},
		});
		expect(passwordReset.error).toBe(false);

		const requestDelete = await ctx.processAction(ctx.session, {
			action: 'action-delete-card@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {},
		});
		expect(requestDelete.error).toBe(false);

		const completePasswordReset = (await ctx.worker.pre(ctx.session, {
			action: 'action-complete-password-reset@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {
				resetToken,
				newPassword: autumndbTestUtils.generateRandomId(),
			},
		})) as any;

		// TODO: Remove this workaround
		completePasswordReset.context = completePasswordReset.logContext;

		await expect(
			ctx.processAction(session.id, completePasswordReset),
		).rejects.toThrowError();
		await ctx.flushAll(ctx.session);
	});

	test('should soft delete password reset card', async () => {
		const username = autumndbTestUtils.generateRandomSlug();
		const user = await ctx.createUser(username, hash);

		const requestPasswordReset = await ctx.processAction(ctx.session, {
			action: 'action-request-password-reset@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {
				username,
			},
		});
		expect(requestPasswordReset.error).toBe(false);

		const completePasswordReset = (await ctx.worker.pre(ctx.session, {
			action: 'action-complete-password-reset@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: {
				resetToken,
				newPassword: autumndbTestUtils.generateRandomId(),
			},
		})) as any;

		// TODO: Remove this workaround
		completePasswordReset.context = completePasswordReset.logContext;

		await ctx.processAction(ctx.session, completePasswordReset);
		await ctx.waitForMatch({
			type: 'object',
			required: ['type', 'active', 'data'],
			additionalProperties: true,
			$$links: {
				'is attached to': {
					type: 'object',
					required: ['id'],
					properties: {
						id: {
							type: 'string',
							const: user.id,
						},
					},
				},
			},
			properties: {
				type: {
					type: 'string',
					const: 'password-reset@1.0.0',
				},
				active: {
					type: 'boolean',
					const: false,
				},
				data: {
					type: 'object',
					properties: {
						resetToken: {
							type: 'string',
							const: resetToken,
						},
					},
					required: ['resetToken'],
				},
			},
		});
	});
});
