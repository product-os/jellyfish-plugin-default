/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import ActionLibrary from '@balena/jellyfish-action-library';
import { ProductOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { integrationHelpers } from '@balena/jellyfish-test-harness';
import { strict as assert } from 'assert';
import isBefore from 'date-fns/isBefore';
import isValid from 'date-fns/isValid';
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

test('editing a message triggers an update to the edited_at field', async () => {
	const supportThread = await ctx.createSupportThread(
		user.id,
		userSession,
		ctx.generateRandomID(),
		{
			status: 'open',
		},
	);
	const update1 = ctx.generateRandomID();
	const update2 = ctx.generateRandomID();

	// Verify that initial the edited_at field is undefined
	const message = await ctx.createMessage(
		user.id,
		userSession,
		supportThread,
		ctx.generateRandomID(),
	);
	expect(typeof message.data.edited_at).toEqual('undefined');

	// Now update the message text
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
				op: 'replace',
				path: '/data/payload/message',
				value: update1,
			},
		],
	);
	await ctx.flushAll(userSession);
	let updatedMessage = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		message.id,
	);
	assert(updatedMessage);

	// And check that the edited_at field now has a valid date-time value
	const firstEditedAt = new Date(updatedMessage.data.edited_at as string);
	expect(isValid(firstEditedAt)).toBe(true);
	expect((updatedMessage.data as any).payload.message).toEqual(update1);

	// Now modify the message text again
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
				op: 'replace',
				path: '/data/payload/message',
				value: update2,
			},
		],
	);
	await ctx.flushAll(userSession);
	updatedMessage = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		message.id,
	);
	assert(updatedMessage);

	// And check that the edited_at field has been updated again
	const secondEditedAt = new Date(updatedMessage.data.edited_at as string);
	expect(isValid(secondEditedAt)).toBe(true);
	expect((updatedMessage.data as any).payload.message).toEqual(update2);

	expect(isBefore(firstEditedAt, secondEditedAt)).toBe(true);
});

test('updating a meta field in the message payload triggers an update to the edited_at field', async () => {
	const supportThread = await ctx.createSupportThread(
		user.id,
		userSession,
		ctx.generateRandomID(),
		{
			status: 'open',
		},
	);
	const mentionedUserSlug = ctx.generateRandomSlug({
		prefix: 'user',
	});

	// Verify that initial the edited_at field is undefined
	const message = await ctx.createMessage(
		user.id,
		userSession,
		supportThread,
		'test',
	);
	expect(typeof message.data.edited_at).toEqual('undefined');

	// Now add a mentionsUser item
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
				path: '/data/payload/mentionsUser',
				value: [mentionedUserSlug],
			},
		],
	);
	await ctx.flushAll(userSession);
	let updatedMessage = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		message.id,
	);
	assert(updatedMessage);

	// And check that the edited_at field now has a valid date-time value
	const firstEditedAt = new Date(updatedMessage.data.edited_at as string);
	expect(isValid(firstEditedAt)).toBe(true);
	expect((updatedMessage.data as any).payload.mentionsUser).toEqual([
		mentionedUserSlug,
	]);

	// Now remove the mentioned user
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
				op: 'remove',
				path: '/data/payload/mentionsUser/0',
			},
		],
	);
	await ctx.flushAll(ctx.session);
	updatedMessage = await ctx.jellyfish.getCardById(
		ctx.context,
		ctx.session,
		message.id,
	);
	assert(updatedMessage);

	// And check that the edited_at field has been updated again
	const secondEditedAt = new Date(updatedMessage.data.edited_at as string);
	expect(isValid(secondEditedAt)).toBe(true);
	expect((updatedMessage.data as any).payload.mentionsUser).toEqual([]);

	expect(isBefore(firstEditedAt, secondEditedAt)).toBe(true);
});
