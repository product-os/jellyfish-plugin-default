import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { testUtils as autumndbTestUtils } from 'autumndb';
import _ from 'lodash';
import { defaultPlugin, MessageContract, testUtils } from '../../../lib';

let ctx: testUtils.TestContext;

beforeAll(async () => {
	ctx = await testUtils.newContext({
		plugins: [defaultPlugin(), productOsPlugin()],
	});
});

afterAll(() => {
	return testUtils.destroyContext(ctx);
});

test('Should aggregate reactions', async () => {
	const user = await ctx.createUser(autumndbTestUtils.generateRandomSlug());
	const session = await ctx.createSession(user);
	const message = await ctx.createContract(
		user.id,
		session.id,
		'message@1.0.0',
		'test message',
		{
			actor: user.id,
			timestamp: new Date().toISOString(),
			payload: {
				message: 'lorem ipsum',
			},
		},
	);

	const reaction = await ctx.createContract(
		user.id,
		session.id,
		'reaction@1.0.0',
		null,
		{
			reaction: ':+1:',
		},
	);

	await ctx.createLinkThroughWorker(
		user.id,
		session.id,
		reaction,
		message,
		'is attached to',
		'has attached element',
	);

	await ctx.flushAll(ctx.session);

	const result = await ctx.kernel.getContractById<MessageContract>(
		ctx.logContext,
		ctx.session,
		message.id,
	);

	expect(result).not.toBeNull();

	expect(result!.data.payload.reactions).toEqual({
		[reaction.data.reaction as any]: 1,
	});
});
