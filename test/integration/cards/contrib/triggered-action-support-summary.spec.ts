import { ProductOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { integrationHelpers } from '@balena/jellyfish-test-harness';
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

test('should close a thread with a #summary whisper', async () => {
	const supportThread = await ctx.createSupportThread(
		user.id,
		userSession,
		ctx.generateRandomWords(3),
		{
			status: 'open',
		},
	);
	await ctx.createWhisper(
		user.id,
		userSession,
		supportThread,
		`#summary ${ctx.generateRandomWords(5)}`,
	);

	await ctx.waitForMatch({
		type: 'object',
		required: ['id', 'data'],
		properties: {
			id: {
				const: supportThread.id,
			},
			data: {
				type: 'object',
				required: ['status'],
				properties: {
					status: {
						const: 'closed',
					},
				},
			},
		},
	});
});
