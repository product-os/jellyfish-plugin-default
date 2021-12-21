import { ProductOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { integrationHelpers } from '@balena/jellyfish-test-harness';
import { strict as assert } from 'assert';
import _ from 'lodash';
import { DefaultPlugin } from '../../../../lib';

let ctx: integrationHelpers.IntegrationTestContext;
let balenaOrg: any;
let testOrg: any;

async function createUser(roles: string[], org: any): Promise<any> {
	// Create user
	const user = await ctx.createUser(
		ctx.generateRandomID(),
		ctx.generateRandomID(),
		roles,
	);

	// Link user to org
	await ctx.createLink(
		ctx.actor.id,
		ctx.session,
		user.contract,
		org,
		'is member of',
		'has member',
	);

	return user;
}

beforeAll(async () => {
	ctx = await integrationHelpers.before([ProductOsPlugin, DefaultPlugin]);

	// Set balena org
	balenaOrg = await ctx.jellyfish.getCardBySlug(
		ctx.context,
		ctx.session,
		'org-balena@1.0.0',
	);
	assert(balenaOrg);

	// Set test org
	testOrg = await ctx.createContract(
		ctx.actor.id,
		ctx.session,
		'org@1.0.0',
		ctx.generateRandomWords(1),
		{},
	);
	assert(testOrg);
});

afterAll(() => {
	return integrationHelpers.after(ctx);
});

describe('role-user-community', () => {
	it('users should not be able to create threads with product values other than balenaCloud', async () => {
		const user = await createUser(['user-external-support'], balenaOrg);

		await expect(
			ctx.createSupportThread(
				user.contract.id,
				user.session,
				ctx.generateRandomWords(1),
				{
					product: 'test-product',
					inbox: 'S/Paid_Support',
					status: 'open',
				},
			),
		).rejects.toThrow(ctx.jellyfish.errors.JellyfishPermissionsError);
	});

	it('the message sent by external support user should be only visible for balena organisation users', async () => {
		const supportUser1 = await createUser(['user-external-support'], testOrg);
		const supportUser2 = await createUser(['user-external-support'], testOrg);
		const communityUser = await createUser(['user-community'], balenaOrg);

		const thread = await ctx.createSupportThread(
			supportUser1.contract.id,
			supportUser1.session,
			ctx.generateRandomWords(3),
			{
				product: 'balenaCloud',
				inbox: 'S/Paid_Support',
				status: 'open',
			},
			[`${supportUser1.contract.slug}+org-balena`],
		);
		const message = await ctx.createMessage(
			supportUser1.contract.id,
			supportUser1.session,
			thread,
			ctx.generateRandomWords(3),
		);

		// Try getting thread and message using supportUser2
		expect(
			await ctx.jellyfish.getCardById(
				ctx.context,
				supportUser2.session,
				thread.id,
			),
		).toBeNull();
		expect(
			await ctx.jellyfish.getCardById(
				ctx.context,
				supportUser2.session,
				message.id,
			),
		).toBeNull();

		// Try getting thread and message using communityUser
		const thread2 = await ctx.jellyfish.getCardById(
			ctx.context,
			communityUser.session,
			thread.id,
		);
		assert(thread2);
		expect(thread2.id).toEqual(thread.id);
		const message2 = await ctx.jellyfish.getCardById(
			ctx.context,
			communityUser.session,
			message.id,
		);
		assert(message2);
		expect(message2.id).toEqual(message.id);
	});

	it('external support user should not be able to create a thread with markers other than <user.slug>+org-balena', async () => {
		const user = await createUser(['user-external-support'], testOrg);

		await expect(
			ctx.createSupportThread(
				user.contract.id,
				user.session,
				ctx.generateRandomWords(3),
				{
					product: 'balenaCloud',
					inbox: 'S/Paid_Support',
					status: 'open',
				},
				[`${user.contract.slug}+org-other`],
			),
		).rejects.toThrow(ctx.jellyfish.errors.JellyfishPermissionsError);

		await expect(
			ctx.createSupportThread(
				user.contract.id,
				user.session,
				ctx.generateRandomWords(3),
				{
					product: 'balenaCloud',
					inbox: 'S/Paid_Support',
					status: 'open',
				},
				[],
			),
		).rejects.toThrow(ctx.jellyfish.errors.JellyfishPermissionsError);
	});

	it('external support user should not be able to view other card types', async () => {
		const user = await createUser(['user-external-support'], testOrg);

		const types = (
			await ctx.jellyfish.query(ctx.context, user.session, {
				type: 'object',
				additionalProperties: true,
				required: ['type'],
				properties: {
					type: {
						type: 'string',
						const: 'type@1.0.0',
					},
				},
			})
		)
			.map((typeCard) => {
				return typeCard.slug;
			})
			.sort();

		expect(types).toEqual([
			'card',
			'create',
			'link',
			'message',
			'notification',
			'subscription',
			'support-thread',
			'update',
		]);
	});
});
