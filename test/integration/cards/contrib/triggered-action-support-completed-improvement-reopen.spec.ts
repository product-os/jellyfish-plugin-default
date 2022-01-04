import { ActionLibrary } from '@balena/jellyfish-action-library';
import { ProductOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { integrationHelpers } from '@balena/jellyfish-test-harness';
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

test('should re-open a closed support thread if an improvement attached to an attached pattern is completed', async () => {
	const supportThread = await ctx.createSupportThread(
		user.id,
		userSession,
		ctx.generateRandomWords(3),
		{
			status: 'closed',
		},
	);
	const pattern = await ctx.createContract(
		user.id,
		userSession,
		'pattern@1.0.0',
		'My pattern',
		{
			status: 'open',
		},
	);
	await ctx.createLink(
		user.id,
		userSession,
		supportThread,
		pattern,
		'has attached',
		'is attached to',
	);
	const improvement = await ctx.createContract(
		user.id,
		userSession,
		'improvement@1.0.0',
		'My improvement',
		{
			status: 'proposed',
		},
	);
	await ctx.createLink(
		user.id,
		userSession,
		pattern,
		improvement,
		'has attached',
		'is attached to',
	);

	// Complete the improvement, and then wait for the support thread to be re-opened
	await ctx.worker.patchCard(
		ctx.context,
		userSession,
		ctx.worker.typeContracts[improvement.type],
		{
			attachEvents: true,
			actor: user.id,
		},
		improvement,
		[
			{
				op: 'replace',
				path: '/data/status',
				value: 'completed',
			},
		],
	);
	await ctx.flushAll(userSession);

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
