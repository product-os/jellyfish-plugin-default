import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import type { WorkerContext } from '@balena/jellyfish-worker';
import { strict as assert } from 'assert';
import { testUtils as autumndbTestUtils } from 'autumndb';
import { pick } from 'lodash';
import { defaultPlugin, testUtils } from '../../../lib';
import { actionIncrementTag } from '../../../lib/actions/action-increment-tag';

const handler = actionIncrementTag.handler;
let ctx: testUtils.TestContext;
let actionContext: WorkerContext;

beforeAll(async () => {
	ctx = await testUtils.newContext({
		plugins: [productOsPlugin(), defaultPlugin()],
	});
	actionContext = ctx.worker.getActionContext({
		id: `test-${autumndbTestUtils.generateRandomId()}`,
	});
});

afterAll(async () => {
	return testUtils.destroyContext(ctx);
});

describe('action-increment-tag', () => {
	test('should increment a tag', async () => {
		const tag = await ctx.createContract(
			ctx.adminUserId,
			ctx.session,
			'tag@1.0.0',
			autumndbTestUtils.generateRandomSlug(),
			{
				count: 0,
			},
		);

		const request: any = {
			context: {
				id: `TEST-${autumndbTestUtils.generateRandomId()}`,
			},
			timestamp: new Date().toISOString(),
			actor: ctx.adminUserId,
			originator: autumndbTestUtils.generateRandomId(),
			arguments: {
				name: tag.slug.replace(/^tag-/, ''),
			},
		};

		const result = await handler(ctx.session, actionContext, tag, request);
		expect(result).toEqual([pick(tag, ['id', 'type', 'version', 'slug'])]);

		let updated = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			tag.id,
		);
		assert(updated);
		expect(updated.data.count).toEqual(1);

		await handler(ctx.session, actionContext, tag, request);
		updated = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			tag.id,
		);
		assert(updated);
		expect(updated.data.count).toEqual(2);
	});

	test('should create a new tag if one does not exist', async () => {
		const name = `tag-${autumndbTestUtils.generateRandomId()}`;
		const id = await ctx.worker.producer.enqueue(
			ctx.worker.getId(),
			ctx.session,
			{
				logContext: ctx.logContext,
				action: 'action-increment-tag@1.0.0',
				card: 'tag@1.0.0',
				type: 'type',
				arguments: {
					reason: null,
					name,
				},
			},
		);
		await ctx.flushAll(ctx.session);
		const result = await ctx.worker.producer.waitResults(ctx.logContext, id);
		expect(result.error).toBe(false);

		const tagContract = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			(result as any).data[0].id,
		);
		assert(tagContract);
		expect(tagContract.type).toBe('tag@1.0.0');
		expect(tagContract.name).toBe(name);
		expect(tagContract.data.count).toBe(1);
	});
});
