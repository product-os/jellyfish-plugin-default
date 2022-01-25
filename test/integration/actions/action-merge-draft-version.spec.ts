import { testUtils as coreTestUtils } from '@balena/jellyfish-core';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { WorkerContext } from '@balena/jellyfish-worker';
import { strict as assert } from 'assert';
import { isArray, isNull } from 'lodash';
import * as semver from 'semver';
import { defaultPlugin, testUtils } from '../../../lib';
import { actionMergeDraftVersion } from '../../../lib/actions/action-merge-draft-version';
import { makeHandlerRequest } from './helpers';

const handler = actionMergeDraftVersion.handler;
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

describe('action-merge-draft-version', () => {
	test('should merge draft version contract without an artifact', async () => {
		const targetContract = await ctx.worker.insertCard(
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
				version: '1.0.2-beta1+rev02',
				data: {
					$transformer: {
						artifactReady: false,
					},
				},
			},
		);
		assert(targetContract);

		const result = await handler(
			ctx.session,
			actionContext,
			targetContract,
			makeHandlerRequest(ctx, actionMergeDraftVersion.contract),
		);
		if (isNull(result) || isArray(result)) {
			expect(isNull(result) || isArray(result)).toBeFalsy();
			return;
		}
		expect(result.slug).toEqual(targetContract.slug);
		expect(result.type).toEqual(targetContract.type);
		expect(semver.prerelease(result.version)).toBeFalsy();

		const updated = await ctx.kernel.getContractById(
			ctx.logContext,
			ctx.session,
			targetContract.id,
		);
		assert(updated);
		expect(updated.data).toEqual(targetContract.data);
	});

	test('should throw an error on invalid type', async () => {
		const targetContract = await ctx.worker.insertCard(
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
				version: '1.0.2-beta1+rev02',
				data: {
					$transformer: {
						artifactReady: false,
					},
				},
			},
		);
		assert(targetContract);
		targetContract.type = 'foobar@1.0.0';

		await expect(
			handler(
				ctx.session,
				actionContext,
				targetContract,
				makeHandlerRequest(ctx, actionMergeDraftVersion.contract),
			),
		).rejects.toThrow(new Error(`No such type: ${targetContract.type}`));
	});
});
