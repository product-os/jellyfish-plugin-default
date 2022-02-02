import { strict as assert } from 'assert';
import { testUtils as coreTestUtils } from '@balena/jellyfish-core';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import type { WorkerContext } from '@balena/jellyfish-worker';
import { isArray, isNull } from 'lodash';
import { defaultPlugin, testUtils } from '../../../lib';
import { actionSetUpdate } from '../../../lib/actions/action-set-update';

const handler = actionSetUpdate.handler;
let ctx: testUtils.TestContext;
let actionContext: WorkerContext;

beforeAll(async () => {
	ctx = await testUtils.newContext({
		plugins: [productOsPlugin(), defaultPlugin()],
	});
	actionContext = ctx.worker.getActionContext({
		id: `test-${coreTestUtils.generateRandomId()}`,
	});
});

afterAll(async () => {
	return testUtils.destroyContext(ctx);
});

describe('action-set-update', () => {
	test('should update array when property path is an array', async () => {
		const supportThread = await ctx.createSupportThread(
			ctx.adminUserId,
			ctx.session,
			coreTestUtils.generateRandomSlug(),
			{
				status: 'open',
				tags: ['foo'],
			},
		);

		const request: any = {
			context: {
				id: `TEST-${coreTestUtils.generateRandomId()}`,
			},
			timestamp: new Date().toISOString(),
			actor: ctx.adminUserId,
			originator: coreTestUtils.generateRandomId(),
			arguments: {
				property: ['data', 'tags'],
				value: ['bar'],
			},
		};

		expect.assertions(2);
		const result = await handler(
			ctx.session,
			actionContext,
			supportThread,
			request,
		);
		if (!isNull(result) && !isArray(result)) {
			expect(result.id).toEqual(supportThread.id);
		}

		const updated = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			supportThread.id,
		);
		assert(updated);
		expect(updated.data.tags).toEqual(request.arguments.value);
	});

	test('should update array when property path is a string', async () => {
		const supportThread = await ctx.createSupportThread(
			ctx.adminUserId,
			ctx.session,
			coreTestUtils.generateRandomSlug(),
			{
				status: 'open',
				tags: ['foo'],
			},
		);

		const request: any = {
			context: {
				id: `TEST-${coreTestUtils.generateRandomId()}`,
			},
			timestamp: new Date().toISOString(),
			actor: ctx.adminUserId,
			originator: coreTestUtils.generateRandomId(),
			arguments: {
				property: 'data.tags',
				value: ['bar'],
			},
		};

		expect.assertions(2);
		const result = await handler(
			ctx.session,
			actionContext,
			supportThread,
			request,
		);
		if (!isNull(result) && !isArray(result)) {
			expect(result.id).toEqual(supportThread.id);
		}

		const updated = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			supportThread.id,
		);
		assert(updated);
		expect(updated.data.tags).toEqual(request.arguments.value);
	});
});
