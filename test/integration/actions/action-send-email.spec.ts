import { testUtils as coreTestUtils } from '@balena/jellyfish-core';
import { defaultEnvironment } from '@balena/jellyfish-environment';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import type { WorkerContext } from '@balena/jellyfish-worker';
import _ from 'lodash';
import nock from 'nock';
import { defaultPlugin, testUtils } from '../../../lib';
import { actionSendEmail } from '../../../lib/actions/action-send-email';
import { includes, makeHandlerRequest } from './helpers';

const MAIL_OPTIONS = defaultEnvironment.mail.options;
let mailBody: string = '';
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

afterEach(() => {
	nock.cleanAll();
});

afterAll(() => {
	return testUtils.destroyContext(ctx);
});

function nockMail() {
	nock(`${MAIL_OPTIONS!.baseUrl}/${MAIL_OPTIONS!.domain}`)
		.persist()
		.post('/messages')
		.basicAuth({
			user: 'api',
			pass: MAIL_OPTIONS!.token,
		})
		.reply(200, (_uri: string, sendBody: string) => {
			mailBody = sendBody;
		});
}

describe('action-send-email', () => {
	test('should send an email', async () => {
		nockMail();
		const user = await ctx.createUser('foobar');
		const args = {
			toAddress: 'foo@example.com',
			fromAddress: 'bar@example.com',
			subject: coreTestUtils.generateRandomId(),
			html: coreTestUtils.generateRandomId(),
		};
		await ctx.processAction(ctx.session, {
			action: 'action-send-email@1.0.0',
			logContext: ctx.logContext,
			card: user.id,
			type: user.type,
			arguments: args,
		});

		expect(includes('to', args.toAddress, mailBody)).toBe(true);
		expect(includes('from', args.fromAddress, mailBody)).toBe(true);
		expect(includes('subject', args.subject, mailBody)).toBe(true);
		expect(includes('html', args.html, mailBody)).toBe(true);
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
