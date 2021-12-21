import { ProductOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { integrationHelpers } from '@balena/jellyfish-test-harness';
import { strict as assert } from 'assert';
import { DefaultPlugin } from '../../../lib';

let ctx: integrationHelpers.IntegrationTestContext;

beforeAll(async () => {
	ctx = await integrationHelpers.before([ProductOsPlugin, DefaultPlugin]);
});

afterAll(() => {
	return integrationHelpers.after(ctx);
});

// Runs the action-maintain-contact action and returns the resulting contact contract
const maintainContact = async (userContract) => {
	const request = await ctx.queue.producer.enqueue(
		ctx.worker.getId(),
		ctx.session,
		{
			action: 'action-maintain-contact@1.0.0',
			context: ctx.context,
			card: userContract.id,
			type: userContract.type,
			arguments: {},
		},
	);

	await ctx.flush(ctx.session);

	const result: any = await ctx.queue.producer.waitResults(
		ctx.context,
		request,
	);

	expect(result.error).toBe(false);

	assert(result.data);

	const contactContract = await ctx.jellyfish.getCardBySlug(
		ctx.context,
		ctx.session,
		`${result.data.slug}@1.0.0`,
	);

	return contactContract;
};

describe('action-maintain-contact', () => {
	it('should elevate external event source', async () => {
		const origin = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'card@1.0.0',
			data: {
				source: 'my-fake-service',
			},
		});

		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				hash: 'PASSWORDLESS',
				roles: ['user-community'],
				origin: origin.id,
				profile: {
					name: {
						first: 'John',
						last: 'Doe',
					},
				},
			},
		});

		const contactCard = await maintainContact(userCard);

		assert(contactCard !== null);

		expect(contactCard.data).toEqual({
			origin: origin.id,
			source: 'my-fake-service',
			profile: {
				email: 'johndoe@example.com',
				name: {
					first: 'John',
					last: 'Doe',
				},
			},
		});
	});

	it('should prettify name when creating user contact', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				roles: ['user-community'],
				hash: 'PASSWORDLESS',
				profile: {
					name: {
						first: 'john   ',
						last: '  dOE ',
					},
				},
			},
		});

		const contactCard = await maintainContact(userCard);

		assert(contactCard !== null);

		expect((contactCard.data.profile as any).name).toEqual({
			first: 'John',
			last: 'Doe',
		});
	});

	it('should link the contact to the user', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				roles: ['user-community'],
				hash: 'PASSWORDLESS',
			},
		});

		const contact = await maintainContact(userCard);

		assert(contact !== null);

		const [result] = await ctx.jellyfish.query(ctx.context, ctx.session, {
			$$links: {
				'has contact': {
					type: 'object',
				},
			},
			type: 'object',
			required: ['id', 'type', 'links'],
			properties: {
				id: {
					type: 'string',
					const: userCard.id,
				},
			},
		});

		assert(result !== undefined);
		expect(result.links!['has contact'][0].id).toBe(contact.id);
	});

	it('should be able to sync updates to user first names', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				roles: ['user-community'],
				hash: 'PASSWORDLESS',
				profile: {
					title: 'Frontend Engineer',
					name: {
						first: 'John',
					},
				},
			},
		});

		await maintainContact(userCard);

		await ctx.jellyfish.patchCardBySlug(
			ctx.context,
			ctx.session,
			`${userCard.slug}@${userCard.version}`,
			[
				{
					op: 'replace',
					value: 'Johnny',
					path: '/data/profile/name/first',
				},
			],
		);

		const contactCard = await maintainContact(userCard);

		assert(contactCard !== null);

		expect(contactCard.data.profile).toEqual({
			email: 'johndoe@example.com',
			title: 'Frontend Engineer',
			name: {
				first: 'Johnny',
			},
		});
	});

	it('should apply a user patch to a contact that diverged', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				roles: ['user-community'],
				hash: 'PASSWORDLESS',
				profile: {
					title: 'Frontend Engineer',
				},
			},
		});

		const result1 = await maintainContact(userCard);

		assert(result1 !== null);

		await ctx.jellyfish.patchCardBySlug(
			ctx.context,
			ctx.session,
			`${result1.slug}@${result1.version}`,
			[
				{
					op: 'remove',
					path: '/data/profile/title',
				},
			],
		);

		await ctx.jellyfish.patchCardBySlug(
			ctx.context,
			ctx.session,
			`${userCard.slug}@${userCard.version}`,
			[
				{
					op: 'replace',
					path: '/data/profile/title',
					value: 'Senior Frontend Engineer',
				},
			],
		);

		const result = await maintainContact(userCard);

		assert(result !== null);

		expect((result.data.profile as any).title).toBe('Senior Frontend Engineer');
	});

	it('should update the name of existing contact', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				roles: ['user-community'],
				hash: 'PASSWORDLESS',
				profile: {
					title: 'Frontend Engineer',
				},
			},
		});

		await maintainContact(userCard);

		await ctx.jellyfish.patchCardBySlug(
			ctx.context,
			ctx.session,
			`${userCard.slug}@${userCard.version}`,
			[
				{
					op: 'replace',
					path: '/name',
					value: 'John Doe',
				},
			],
		);

		const result = await maintainContact(userCard);

		assert(result !== null);

		expect(result.name).toBe('John Doe');
	});

	it('should delete an existing contact if the user is deleted', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				roles: ['user-community'],
				hash: 'PASSWORDLESS',
				profile: {
					title: 'Frontend Engineer',
				},
			},
		});

		await maintainContact(userCard);

		await ctx.jellyfish.patchCardBySlug(
			ctx.context,
			ctx.session,
			`${userCard.slug}@${userCard.version}`,
			[
				{
					op: 'replace',
					value: false,
					path: '/active',
				},
			],
		);

		const contactCard = await maintainContact(userCard);

		assert(contactCard !== null);

		expect(contactCard.active).toBe(false);
	});

	it('should not remove a property from an existing linked contact', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				roles: ['user-community'],
				hash: 'PASSWORDLESS',
				profile: {
					title: 'Frontend Engineer',
				},
			},
		});

		await maintainContact(userCard);

		await ctx.jellyfish.patchCardBySlug(
			ctx.context,
			ctx.session,
			`${userCard.slug}@${userCard.version}`,
			[
				{
					op: 'remove',
					path: '/data/profile/title',
				},
			],
		);

		const contactCard = await maintainContact(userCard);

		assert(contactCard !== null);

		expect((contactCard.data.profile as any).title).toBe('Frontend Engineer');
	});

	it('should add a property to an existing linked contact', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				hash: 'PASSWORDLESS',
				roles: ['user-community'],
			},
		});

		await maintainContact(userCard);

		await ctx.jellyfish.patchCardBySlug(
			ctx.context,
			ctx.session,
			`${userCard.slug}@${userCard.version}`,
			[
				{
					op: 'add',
					path: '/data/profile',
					value: {},
				},
				{
					op: 'add',
					path: '/data/profile/company',
					value: 'Balena',
				},
			],
		);

		const contactCard = await maintainContact(userCard);

		assert(contactCard !== null);

		expect(contactCard.data.profile).toEqual({
			email: 'johndoe@example.com',
			company: 'Balena',
			name: {},
		});
	});

	it('should create a contact for a user with little profile info', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				hash: 'PASSWORDLESS',
				roles: ['user-community'],
			},
		});

		const contactCard = await maintainContact(userCard);

		assert(contactCard !== null);

		expect(contactCard.data).toEqual({
			profile: {
				email: 'johndoe@example.com',
				name: {},
			},
		});
	});

	it('should use the user name when creating a contact', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			name: 'John Doe',
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				hash: 'PASSWORDLESS',
				roles: ['user-community'],
			},
		});

		const contactCard = await maintainContact(userCard);

		assert(contactCard !== null);

		expect(contactCard.name).toBe('John Doe');
	});

	it('should create an inactive contact given an inactive user', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			active: false,
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				hash: 'PASSWORDLESS',
				roles: ['user-community'],
			},
		});

		const contactCard = await maintainContact(userCard);

		assert(contactCard !== null);

		expect(contactCard.active).toBe(false);
	});

	it('should create a contact for a user with plenty of info', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: 'johndoe@example.com',
				hash: 'PASSWORDLESS',
				roles: ['user-community'],
				profile: {
					company: 'Balena.io',
					title: 'Senior Directory of the Jellyfish Task Force',
					type: 'professional',
					country: 'Republic of Balena',
					city: 'Contractshire',
					name: {
						first: 'John',
						last: 'Doe',
					},
				},
			},
		});

		const contactCard = await maintainContact(userCard);

		assert(contactCard !== null);

		expect(contactCard.data.profile).toEqual({
			email: 'johndoe@example.com',
			company: 'Balena.io',
			title: 'Senior Directory of the Jellyfish Task Force',
			country: 'Republic of Balena',
			city: 'Contractshire',
			type: 'professional',
			name: {
				first: 'John',
				last: 'Doe',
			},
		});
	});

	it('should create a contact for a user with multiple emails', async () => {
		const userCard = await ctx.jellyfish.insertCard(ctx.context, ctx.session, {
			type: 'user@1.0.0',
			data: {
				email: ['johndoe@example.com', 'johndoe@gmail.com'],
				hash: 'PASSWORDLESS',
				roles: ['user-community'],
				profile: {
					name: {
						first: 'John',
						last: 'Doe',
					},
				},
			},
		});

		const contactCard = await maintainContact(userCard);

		assert(contactCard !== null);

		expect((contactCard.data.profile as any).email).toEqual([
			'johndoe@example.com',
			'johndoe@gmail.com',
		]);
	});
});
