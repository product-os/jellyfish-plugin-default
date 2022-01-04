import { ActionLibrary } from '@balena/jellyfish-action-library';
import { ProductOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { integrationHelpers } from '@balena/jellyfish-test-harness';
import { strict as assert } from 'assert';
import { DefaultPlugin } from '../../../../lib';

let ctx: integrationHelpers.IntegrationTestContext;
let user: any = {};
let userSession: string = '';

beforeAll(async () => {
	ctx = await integrationHelpers.before([
		ActionLibrary,
		ProductOsPlugin,
		DefaultPlugin,
	]);

	const createdUser = await ctx.createUser(ctx.generateRandomID());
	user = createdUser.contract;
	userSession = createdUser.session;
});

afterAll(() => {
	return integrationHelpers.after(ctx);
});

test('should re-open a closed support thread if a new message is added', async () => {
	const supportThread = await ctx.createSupportThread(
		user.id,
		userSession,
		ctx.generateRandomWords(3),
		{
			status: 'closed',
		},
	);

	// Add a new message to the thread, and then wait for the support thread to be re-opened
	await ctx.createMessage(
		user.id,
		userSession,
		supportThread,
		ctx.generateRandomWords(5),
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
						const: 'open',
					},
				},
			},
		},
	});
});

test('should not re-open a closed thread by marking a message as read', async () => {
	const supportThread = await ctx.createSupportThread(
		user.id,
		userSession,
		ctx.generateRandomWords(3),
		{
			status: 'open',
		},
	);

	// Add a new message to the thread
	const message = await ctx.createMessage(
		user.id,
		userSession,
		supportThread,
		ctx.generateRandomWords(5),
	);

	// Close the thread
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
				path: '/data/status',
				value: 'closed',
			},
		],
	);
	await ctx.flushAll(userSession);

	// Mark the message as read
	await ctx.worker.patchCard(
		ctx.context,
		userSession,
		ctx.worker.typeContracts[message.type],
		{
			attachEvents: true,
			actor: user.id,
		},
		message,
		[
			{
				op: 'add',
				path: '/data/readBy',
				value: ['johndoe'],
			},
		],
	);
	await ctx.flushAll(userSession);

	// Wait a while to verify no triggered actions run
	await new Promise((resolve) => {
		setTimeout(resolve, 5000);
	});

	// Check that the thread is still closed
	const thread = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		supportThread.id,
	);
	assert(thread);
	expect(thread.active).toEqual(true);
	expect(thread.data.status).toEqual('closed');
});

test('should not re-open a closed thread with a whisper', async () => {
	const supportThread = await ctx.createSupportThread(
		user.id,
		userSession,
		ctx.generateRandomWords(3),
		{
			status: 'closed',
		},
	);
	await ctx.createWhisper(
		user.id,
		userSession,
		supportThread,
		ctx.generateRandomWords(5),
	);

	// Wait a while to verify no triggered actions run
	await new Promise((resolve) => {
		setTimeout(resolve, 5000);
	});

	// Check that the thread is still closed
	const thread = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		supportThread.id,
	);
	assert(thread);
	expect(thread.active).toEqual(true);
	expect(thread.data.status).toEqual('closed');
});

test('should re-open an archived thread with a message', async () => {
	const supportThread = await ctx.createSupportThread(
		user.id,
		userSession,
		ctx.generateRandomWords(3),
		{
			status: 'archived',
		},
	);
	await ctx.createMessage(
		user.id,
		userSession,
		supportThread,
		ctx.generateRandomWords(5),
	);

	const thread = await ctx.waitForMatch({
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
						const: 'open',
					},
				},
			},
		},
	});
	expect(thread.active).toEqual(true);
	expect(thread.data.status).toEqual('open');
});

test('should not re-open an archived thread with a whisper', async () => {
	const supportThread = await ctx.createSupportThread(
		user.id,
		userSession,
		ctx.generateRandomWords(3),
		{
			status: 'archived',
		},
	);
	await ctx.createWhisper(
		user.id,
		userSession,
		supportThread,
		ctx.generateRandomWords(5),
	);

	// Wait a while to verify no triggered actions run
	await new Promise((resolve) => {
		setTimeout(resolve, 5000);
	});

	// Check that the thread is still archived
	const thread = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		supportThread.id,
	);
	assert(thread);
	expect(thread.active).toEqual(true);
	expect(thread.data.status).toEqual('archived');
});
