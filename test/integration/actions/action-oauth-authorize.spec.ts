import { defaultEnvironment } from '@balena/jellyfish-environment';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import type { WorkerContext } from '@balena/jellyfish-worker';
import { strict as assert } from 'assert';
import { testUtils as autumndbTestUtils } from 'autumndb';
import { isEmpty, isString } from 'lodash';
import nock from 'nock';
import sinon from 'sinon';
import { defaultPlugin, testUtils } from '../../../lib';
import { actionOAuthAuthorize } from '../../../lib/actions/action-oauth-authorize';
import { foobarIntegrationDefinition } from './integrations/foobar';
import { foobarPlugin } from './plugin';

const handler = actionOAuthAuthorize.handler;
let ctx: testUtils.TestContext;
let actionContext: WorkerContext;

beforeAll(async () => {
	ctx = await testUtils.newContext({
		plugins: [productOsPlugin(), defaultPlugin(), foobarPlugin()],
	});
	actionContext = ctx.worker.getActionContext({
		id: `test-${autumndbTestUtils.generateRandomId()}`,
	});
});

afterAll(async () => {
	return testUtils.destroyContext(ctx);
});

beforeEach(() => {
	sinon.restore();
});

afterEach(() => {
	nock.cleanAll();
});

describe('action-oauth-authorize', () => {
	test('should return token string', async () => {
		assert(foobarIntegrationDefinition.OAUTH_BASE_URL);
		nock(foobarIntegrationDefinition.OAUTH_BASE_URL)
			.post('/oauth/token')
			.reply(200, autumndbTestUtils.generateRandomId());

		sinon.stub(defaultEnvironment, 'getIntegration').callsFake(() => {
			return {
				appId: 'foo',
				appSecret: 'bar',
			};
		});

		const user = await ctx.createContract(
			ctx.adminUserId,
			ctx.session,
			'user@1.0.0',
			autumndbTestUtils.generateRandomSlug(),
			{
				hash: autumndbTestUtils.generateRandomId(),
				roles: [],
			},
		);

		const result = await handler(ctx.session, actionContext, user, {
			context: {
				id: `TEST-${autumndbTestUtils.generateRandomId()}`,
			},
			timestamp: new Date().toISOString(),
			actor: ctx.adminUserId,
			originator: autumndbTestUtils.generateRandomId(),
			arguments: {
				provider: 'foobar',
				code: autumndbTestUtils.generateRandomId(),
				origin: 'http://localhost',
			},
		} as any);
		expect(isString(result)).toBe(true);
		expect(isEmpty(result)).toBe(false);
	});
});
