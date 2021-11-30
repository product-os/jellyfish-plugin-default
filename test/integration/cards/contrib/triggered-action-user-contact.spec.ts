import ActionLibrary from '@balena/jellyfish-action-library';
import { ProductOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { integrationHelpers } from '@balena/jellyfish-test-harness';
import { DefaultPlugin } from '../../../../lib';
import Bluebird from 'bluebird';
import { strict as assert } from 'assert';

let ctx: integrationHelpers.IntegrationTestContext;

beforeAll(async () => {
	ctx = await integrationHelpers.before([
		ActionLibrary,
		ProductOsPlugin,
		DefaultPlugin,
	]);
});

afterAll(() => {
	return integrationHelpers.after(ctx);
});

test('The contact is updated when the user is updated', async () => {
	await Bluebird.delay(5000);

	const username = ctx.generateRandomID();

	const inserted = await ctx.worker.insertCard(
		ctx.context,
		ctx.session,
		ctx.worker.typeContracts['user@1.0.0'],
		{
			attachEvents: true,
			actor: ctx.actor.id,
		},
		{
			name: username,
			slug: ctx.generateRandomSlug({
				prefix: 'user',
			}),
			version: '1.0.0',
			markers: [],
			data: {
				email: `${username}@example.com`,
				hash: 'foobar',
				roles: ['user-community'],
			},
		},
	);
	assert(inserted);
	await ctx.flushAll(ctx.session);
	const user = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		inserted.id,
	);

	assert(user);

	const name = 'Johnny';

	await ctx.flushAll(ctx.session);

	const contact: any = await ctx.waitForMatch({
		$$links: {
			'is attached to user': {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						const: user.id,
					},
				},
			},
		},
		type: 'object',
		properties: {
			type: {
				type: 'string',
				const: 'contact@1.0.0',
			},
		},
	});

	await ctx.worker.patchCard(
		ctx.context,
		ctx.session,
		ctx.worker.typeContracts['user@1.0.0'],
		{
			attachEvents: true,
			actor: ctx.actor.id,
		},
		user,
		[
			{
				op: 'add',
				path: '/data/profile',
				value: {
					name: {
						first: name,
					},
				},
			},
		],
	);

	await ctx.flushAll(ctx.session);

	const updated: any = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		contact.id,
	);

	expect(updated.data.profile.name.first).toBe(name);
});
