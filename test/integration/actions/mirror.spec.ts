import { testUtils as coreTestUtils } from '@balena/jellyfish-core';
import { defaultEnvironment } from '@balena/jellyfish-environment';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { WorkerContext } from '@balena/jellyfish-worker';
import { isArray, isEmpty } from 'lodash';
import sinon from 'sinon';
import { defaultPlugin, testUtils } from '../../../lib';
import { mirror } from '../../../lib/actions/mirror';
import { makeHandlerRequest } from './helpers';
import { foobarPlugin } from './plugin';
import { actionSetUpdate } from '../../../lib/actions/action-set-update';

const source = 'foobar';
let supportThread: any;

let ctx: testUtils.TestContext;
let actionContext: WorkerContext;

beforeAll(async () => {
	ctx = await testUtils.newContext({
		plugins: [productOsPlugin(), defaultPlugin(), foobarPlugin()],
	});
	actionContext = ctx.worker.getActionContext({
		id: `test-${coreTestUtils.generateRandomId()}`,
	});

	supportThread = await ctx.createSupportThread(
		ctx.adminUserId,
		ctx.session,
		coreTestUtils.generateRandomSlug(),
		{
			status: 'open',
		},
	);
});

afterAll(async () => {
	return testUtils.destroyContext(ctx);
});

beforeEach(() => {
	sinon.restore();
});

describe('mirror()', () => {
	test('should not sync back changes that came from external event', async () => {
		const externalEvent = await ctx.createContract(
			ctx.adminUserId,
			ctx.session,
			'external-event@1.0.0',
			coreTestUtils.generateRandomSlug(),
			{
				source,
				headers: {
					foo: coreTestUtils.generateRandomId(),
				},
				payload: {
					bar: coreTestUtils.generateRandomId(),
				},
				data: {
					baz: coreTestUtils.generateRandomId(),
				},
			},
		);

		const request = makeHandlerRequest(ctx, actionSetUpdate.contract);
		request.originator = externalEvent.id;

		const result = await mirror(
			source,
			ctx.session,
			actionContext,
			supportThread,
			request,
		);
		expect(isArray(result)).toBe(true);
		expect(isEmpty(result)).toBe(true);
	});

	test('should return a list of cards', async () => {
		sinon.stub(defaultEnvironment, 'getIntegration').callsFake(() => {
			return {};
		});

		const result = await mirror(
			source,
			ctx.session,
			actionContext,
			supportThread,
			makeHandlerRequest(ctx, actionSetUpdate.contract),
		);
		expect(isArray(result)).toBe(true);
		if (isArray(result)) {
			expect(Object.keys(result[0])).toEqual(['id', 'type', 'version', 'slug']);
		}
	});
});