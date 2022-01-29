import { testUtils as coreTestUtils } from '@balena/jellyfish-core';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { WorkerContext } from '@balena/jellyfish-worker';
import { strict as assert } from 'assert';
import * as _ from 'lodash';
import { defaultPlugin, testUtils } from '../../../lib';
import { actionIncrement } from '../../../lib/actions/action-increment';

const handler = actionIncrement.handler;
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

describe('action-increment', () => {
	test('should throw an error on invalid type', async () => {
		const contract = await ctx.createContract(
			ctx.adminUserId,
			ctx.session,
			'card@1.0.0',
			coreTestUtils.generateRandomSlug(),
			{},
		);
		contract.type = 'foobar@1.0.0';

		expect.assertions(1);
		try {
			await handler(ctx.session, actionContext, contract, {
				context: {
					id: `TEST-${coreTestUtils.generateRandomId()}`,
				},
				timestamp: new Date().toISOString(),
				actor: ctx.adminUserId,
				originator: coreTestUtils.generateRandomId(),
				arguments: {},
			} as any);
		} catch (error: any) {
			expect(error.message).toEqual(`No such type: ${contract.type}`);
		}
	});

	test('should increment specified path if number', async () => {
		const contract = await ctx.createContract(
			ctx.adminUserId,
			ctx.session,
			'card@1.0.0',
			coreTestUtils.generateRandomSlug(),
			{
				count: 0,
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
				path: ['data', 'count'],
			},
		};

		expect.assertions(3);
		const result = await handler(ctx.session, actionContext, contract, request);
		if (!_.isNull(result) && !_.isArray(result)) {
			expect(result.id).toEqual(contract.id);
		}

		let updated = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			contract.id,
		);
		assert(updated);
		expect(updated.data.count).toEqual(1);

		await handler(ctx.session, actionContext, updated, request);
		updated = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			contract.id,
		);
		assert(updated);
		expect(updated.data.count).toEqual(2);
	});

	test('should increment specified path if string', async () => {
		const contract = await ctx.createContract(
			ctx.adminUserId,
			ctx.session,
			'card@1.0.0',
			coreTestUtils.generateRandomSlug(),
			{
				count: 'foobar',
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
				path: ['data', 'count'],
			},
		};

		expect.assertions(3);
		const result = await handler(ctx.session, actionContext, contract, request);
		if (!_.isNull(result) && !_.isArray(result)) {
			expect(result.id).toEqual(contract.id);
		}

		let updated = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			contract.id,
		);
		assert(updated);
		expect(updated.data.count).toEqual(1);

		await handler(ctx.session, actionContext, updated, request);
		updated = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			contract.id,
		);
		assert(updated);
		expect(updated.data.count).toEqual(2);
	});
});
