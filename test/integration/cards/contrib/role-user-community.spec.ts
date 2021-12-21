import { ProductOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { integrationHelpers } from '@balena/jellyfish-test-harness';
import _ from 'lodash';
import { DefaultPlugin } from '../../../../lib';

let ctx: integrationHelpers.IntegrationTestContext;
let user: any = {};
let userSession: string = '';

beforeAll(async () => {
	ctx = await integrationHelpers.before([ProductOsPlugin, DefaultPlugin]);

	const createdUser = await ctx.createUser(ctx.generateRandomID());
	user = createdUser.contract;
	userSession = createdUser.session;
});

afterAll(() => {
	return integrationHelpers.after(ctx);
});

describe('role-user-community', () => {
	it('users should be able to query views', async () => {
		expect(user.data.roles).toEqual(['user-community']);

		const results = await ctx.jellyfish.query(ctx.context, userSession, {
			type: 'object',
			required: ['type'],
			properties: {
				type: {
					type: 'string',
					const: 'view@1.0.0',
				},
			},
		});
		expect(_.includes(_.map(results, 'slug'), 'view-all-views')).toBe(true);
	});

	test('users should not be able to view messages on threads they cannot view', async () => {
		const otherUser = await ctx.createUser(ctx.generateRandomID());
		expect(otherUser.contract.data.roles).toEqual(['user-community']);

		const supportThread = await ctx.createSupportThread(
			user.id,
			userSession,
			ctx.generateRandomWords(1),
			{
				status: 'open',
			},
		);
		await ctx.worker.patchCard(
			ctx.context,
			userSession,
			ctx.worker.typeContracts[supportThread.type],
			{
				attachEvents: true,
				actor: user.id,
			},
			supportThread,
			[
				{
					op: 'replace',
					path: '/markers',
					value: [user.slug],
				},
			],
		);
		const message = await ctx.createMessage(
			user.id,
			userSession,
			supportThread,
			ctx.generateRandomWords(3),
		);

		const result = await ctx.jellyfish.getCardById(
			ctx.context,
			otherUser.session,
			message.id,
		);
		expect(result).toBeNull();
	});
});
