import { testUtils as coreTestUtils } from '@balena/jellyfish-core';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { WorkerContext } from '@balena/jellyfish-worker';
import { strict as assert } from 'assert';
import { defaultPlugin, testUtils } from '../../../lib';
import { actionDeleteCard } from '../../../lib/actions/action-delete-card';
import { makeHandlerRequest } from './helpers';

const handler = actionDeleteCard.handler;
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

describe('action-delete-card', () => {
	test('should return card if already not active', async () => {
		const card = await ctx.worker.insertCard(
			ctx.logContext,
			ctx.session,
			ctx.worker.typeContracts['card@1.0.0'],
			{
				attachEvents: true,
				actor: ctx.adminUserId,
			},
			{
				name: coreTestUtils.generateRandomSlug(),
				slug: coreTestUtils.generateRandomSlug({
					prefix: 'card',
				}),
				active: false,
				version: '1.0.0',
				data: {
					status: 'open',
				},
			},
		);
		assert(card);

		const result = await handler(
			ctx.session,
			actionContext,
			card,
			makeHandlerRequest(ctx, actionDeleteCard.contract),
		);
		expect(result).toEqual({
			id: card.id,
			type: card.type,
			version: card.version,
			slug: card.slug,
		});
	});

	test('should throw an error on invalid type', async () => {
		const card = await ctx.createContract(
			ctx.adminUserId,
			ctx.session,
			'card@1.0.0',
			null,
			{},
		);
		card.type = 'foobar@1.0.0';

		await expect(
			handler(
				ctx.session,
				actionContext,
				card,
				makeHandlerRequest(ctx, actionDeleteCard.contract),
			),
		).rejects.toThrow(`No such type: ${card.type}`);
	});

	test('should delete a card', async () => {
		const card = await ctx.createContract(
			ctx.adminUserId,
			ctx.session,
			'card@1.0.0',
			null,
			{},
		);

		const request = await ctx.queue.producer.enqueue(
			ctx.worker.getId(),
			ctx.session,
			{
				action: 'action-delete-card@1.0.0',
				logContext: ctx.logContext,
				card: card.id,
				type: card.type,
				arguments: {},
			},
		);
		await ctx.flushAll(ctx.session);
		const result = await ctx.queue.producer.waitResults(
			ctx.logContext,
			request,
		);
		expect(result.error).toBe(false);

		const resultCard = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			card.id,
		);
		assert(resultCard);
		expect(resultCard.active).toBe(false);
	});
});