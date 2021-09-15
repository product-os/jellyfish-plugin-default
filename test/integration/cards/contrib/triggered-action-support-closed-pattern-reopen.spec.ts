/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import ActionLibrary from '@balena/jellyfish-action-library';
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

test('should re-open a closed support thread if an attached pattern is closed', async () => {
	const pattern = await ctx.createContract(
		user.id,
		userSession,
		'pattern@1.0.0',
		'My pattern',
		{
			status: 'open',
		},
	);
	const supportThread = await ctx.createSupportThread(
		user.id,
		userSession,
		ctx.generateRandomWords(3),
		{
			status: 'closed',
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

	// Close the pattern, and then wait for the support thread to be re-opened
	await ctx.worker.patchCard(
		ctx.context,
		userSession,
		ctx.worker.typeContracts[pattern.type],
		{
			attachEvents: true,
			actor: user.id,
		},
		pattern,
		[
			{
				op: 'replace',
				path: '/data/status',
				value: 'closed-resolved',
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
