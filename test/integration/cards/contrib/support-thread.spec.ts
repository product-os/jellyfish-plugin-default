import { ProductOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { integrationHelpers } from '@balena/jellyfish-test-harness';
import { strict as assert } from 'assert';
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

const waitForThreadWithLastMessage = async (thread: any, event: any) => {
	return ctx.waitForMatch({
		type: 'object',
		required: ['id', 'data'],
		properties: {
			id: {
				const: thread.id,
			},
			data: {
				type: 'object',
				required: ['lastMessage'],
				properties: {
					lastMessage: {
						type: 'object',
						required: ['type', 'data'],
						properties: {
							type: {
								const: event.type,
							},
							data: {
								type: 'object',
								required: ['payload'],
								properties: {
									payload: {
										type: 'object',
										required: ['message'],
										properties: {
											message: {
												const: event.data.payload.message,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	});
};

test('should evaluate the last message in a support thread', async () => {
	const supportThreadSummary = await ctx.createSupportThread(
		user.id,
		userSession,
		ctx.generateRandomWords(3),
		{
			status: 'open',
		},
	);

	// Initially the lastMessage field will be undefined as there aren't any messages attached to the thread
	let supportThread = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		supportThreadSummary.id,
	);
	assert(supportThread);
	expect(supportThread.data.lastMessage).toBeFalsy();

	// Now we add a message to the thread's timeline
	const message0Text = ctx.generateRandomWords(5);
	const message0Summary = await ctx.createMessage(
		user.id,
		userSession,
		supportThread,
		message0Text,
	);
	const message0 = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		message0Summary.id,
	);
	assert(message0);

	// Now we wait for the lastMessage field to be updated to the whisper we just added to the thread
	supportThread = await waitForThreadWithLastMessage(supportThread, message0);
	expect(supportThread.data.lastMessage).toEqual(message0);

	// Now let's add another message to the thread's timeline
	const message1Text = ctx.generateRandomWords(5);
	const message1Summary = await ctx.createMessage(
		user.id,
		userSession,
		supportThread,
		message1Text,
	);
	const message1 = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		message1Summary.id,
	);
	assert(message1);

	// If we add an update to the thread, this does not affect the evaluated lastMessage field
	await ctx.worker.patchCard(
		ctx.context,
		userSession,
		ctx.worker.typeContracts[supportThread.type],
		{
			attachEvents: true,
			actor: user.id,
		},
		supportThread,
		[
			{
				op: 'replace',
				path: '/name',
				value: `Thread ${ctx.generateRandomID()}`,
			},
		],
	);
	await ctx.flushAll(userSession);

	// And wait for the lastMessage field to be updated to this new message
	supportThread = await waitForThreadWithLastMessage(supportThread, message1);
	expect(supportThread.data.lastMessage).toEqual(message1);
});
