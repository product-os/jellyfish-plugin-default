import { testUtils as coreTestUtils } from '@balena/jellyfish-core';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import type { WorkerContext } from '@balena/jellyfish-worker';
import _ from 'lodash';
import { defaultPlugin, testUtils } from '../../../lib';
import { actionSendEmail } from '../../../lib/actions/action-send-email';
import { makeHandlerRequest } from './helpers';

const handler = actionSendEmail.handler;
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

describe('action-send-email', () => {
	test('should send an email', async () => {
		const result = await handler(
			ctx.session,
			actionContext,
			{} as any,
			makeHandlerRequest(ctx, actionSendEmail.contract, {
				toAddress: 'test1@balenateam.m8r.co',
				fromAddress: 'hello@balena.io',
				subject: 'sending real email',
				html: 'with real text in the body',
			}),
		);
		expect(_.get(result, ['data', 'message'])).toEqual('Queued. Thank you.');
	});

	test('should throw an error when the email is invalid', async () => {
		expect.hasAssertions();

		try {
			await handler(
				ctx.session,
				actionContext,
				{} as any,
				makeHandlerRequest(ctx, actionSendEmail.contract, {
					toAddress: 'foobar',
					fromAddress: 'hello@balena.io',
					subject: 'sending real email',
					html: 'with real text in the body',
				}),
			);
		} catch (error) {
			expect(_.get(error, ['response', 'status'])).toEqual(400);
		}
	});
});
