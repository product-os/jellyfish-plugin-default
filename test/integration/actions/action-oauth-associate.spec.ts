import { testUtils as coreTestUtils } from '@balena/jellyfish-core';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { WorkerContext } from '@balena/jellyfish-worker';
import { isArray, isNull } from 'lodash';
import { defaultPlugin, testUtils } from '../../../lib';
import { actionOAuthAssociate } from '../../../lib/actions/action-oauth-associate';
import { foobarPlugin } from './plugin';

const handler = actionOAuthAssociate.handler;
let ctx: testUtils.TestContext;
let actionContext: WorkerContext;

beforeAll(async () => {
	ctx = await testUtils.newContext({
		plugins: [productOsPlugin(), defaultPlugin(), foobarPlugin()],
	});
	actionContext = ctx.worker.getActionContext({
		id: `test-${coreTestUtils.generateRandomId()}`,
	});
});

afterAll(async () => {
	return testUtils.destroyContext(ctx);
});

describe('action-oauth-associate', () => {
	test('should return single user card', async () => {
		const user = await ctx.createContract(
			ctx.adminUserId,
			ctx.session,
			'user@1.0.0',
			coreTestUtils.generateRandomSlug(),
			{
				hash: coreTestUtils.generateRandomId(),
				roles: [],
			},
		);

		const result: any = await handler(ctx.session, actionContext, user, {
			logContext: {
				id: `TEST-${coreTestUtils.generateRandomId()}`,
			},
			timestamp: new Date().toISOString(),
			actor: ctx.adminUserId,
			originator: coreTestUtils.generateRandomId(),
			arguments: {
				provider: 'foobar',
			},
		} as any);
		expect(isNull(result)).toBe(false);
		expect(isArray(result)).toBe(false);
		expect(result.type).toEqual('user@1.0.0');
	});
});
