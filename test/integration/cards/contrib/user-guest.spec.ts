/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import ActionLibrary from '@balena/jellyfish-action-library';
import { ProductOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { integrationHelpers } from '@balena/jellyfish-test-harness';
import { strict as assert } from 'assert';
import { DefaultPlugin } from '../../../../lib';

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

describe('user-guest', () => {
	it.only('query: the guest user should only see its own private fields', async () => {
		const guestUser = await ctx.jellyfish.getCardBySlug(
			ctx.context,
			ctx.session,
			'user-guest@1.0.0',
		);
		assert(guestUser);

		const guestUserSession = await ctx.jellyfish.replaceCard(
			ctx.context,
			ctx.session,
			ctx.jellyfish.defaults({
				slug: 'session-guest',
				version: '1.0.0',
				type: 'session@1.0.0',
				data: {
					actor: guestUser.id,
				},
			}),
		);
		assert(guestUserSession);

		const results = await ctx.jellyfish.query(
			ctx.context,
			guestUserSession.id,
			{
				type: 'object',
				required: ['type', 'data'],
				additionalProperties: true,
				properties: {
					type: {
						type: 'string',
						const: 'user@1.0.0',
					},
					data: {
						type: 'object',
						properties: {
							email: {
								type: 'string',
							},
						},
					},
				},
			},
		);

		expect(results.length).toEqual(1);
		expect(results[0].slug).toEqual('user-guest');
	});
});
