/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import ActionLibrary from '@balena/jellyfish-action-library';
import { integrationHelpers } from '@balena/jellyfish-test-harness';
import { Contract, ContractData } from '@balena/jellyfish-types/build/core';
import { DefaultPlugin } from '../../../../lib';
import { triggeredActionScheduleAction } from '../../../../lib/cards/contrib/triggered-action-schedule-action';

let ctx: integrationHelpers.IntegrationTestContext;

beforeAll(async () => {
	ctx = await integrationHelpers.before(
		[DefaultPlugin, ActionLibrary],
		[triggeredActionScheduleAction],
	);
});

afterAll(async () => {
	return integrationHelpers.after(ctx);
});

/**
 * Create and return a scheduled action contract
 */
async function createScheduledAction(): Promise<Contract<ContractData>> {
	const scheduledAction = await ctx.jellyfish.insertCard(
		ctx.context,
		ctx.session,
		{
			type: 'scheduled-action@1.0.0',
			slug: ctx.generateRandomSlug({
				prefix: 'scheduled-action',
			}),
			data: {
				options: {
					context: ctx.context,
					action: 'action-create-card@1.0.0',
					type: 'type',
					arguments: {},
				},
				schedule: {
					once: {
						date: new Date(
							new Date().setDate(new Date().getDate() + 1),
						).toISOString(),
					},
				},
			},
		},
	);
	return scheduledAction;
}

describe('triggered-action-schedule-action', () => {
	test('creating a scheduled-action should trigger action-schedule-action', async () => {
		const typeCard = await ctx.backend.getElementBySlug(
			ctx.context,
			'scheduled-action@1.0.0',
		);
		const createRequest = await ctx.queue.producer.enqueue(
			ctx.worker.getId(),
			ctx.session,
			{
				action: 'action-create-card@1.0.0',
				context: ctx.context,
				card: typeCard.id,
				type: typeCard.type,
				arguments: {
					reason: null,
					properties: {
						slug: ctx.generateRandomSlug({
							prefix: 'scheduled-action',
						}),
						data: {
							options: {
								context: ctx.context,
								action: 'action-create-card@1.0.0',
								type: 'type',
								arguments: {},
							},
							schedule: {
								once: {
									date: new Date(
										new Date().setDate(new Date().getDate() + 1),
									).toISOString(),
								},
							},
						},
					},
				},
			},
		);
		const executed = await ctx.worker.execute(ctx.session, createRequest);

		const expected = await ctx.waitForMatch({
			type: 'object',
			required: ['type', 'data'],
			properties: {
				type: {
					const: 'action-request@1.0.0',
				},
				data: {
					type: 'object',
					required: ['action', 'input'],
					properties: {
						action: {
							const: 'action-schedule-action@1.0.0',
						},
						input: {
							type: 'object',
							required: ['id'],
							properties: {
								id: {
									const: executed.data.id,
								},
							},
						},
					},
				},
			},
		});
		expect(expected).not.toBeNull();
	});

	test('updating a scheduled-action should trigger action-schedule-action', async () => {
		const scheduledAction = await createScheduledAction();
		const updateRequest = await ctx.queue.producer.enqueue(
			ctx.worker.getId(),
			ctx.session,
			{
				action: 'action-update-card@1.0.0',
				context: ctx.context,
				card: scheduledAction.id,
				type: scheduledAction.type,
				arguments: {
					reason: null,
					patch: [
						{
							op: 'replace',
							path: '/data/schedule/once/date',
							value: new Date(
								new Date().setDate(new Date().getDate() + 1),
							).toISOString(),
						},
					],
				},
			},
		);
		const executed = await ctx.worker.execute(ctx.session, updateRequest);

		const expected = await ctx.waitForMatch({
			type: 'object',
			required: ['type', 'data'],
			properties: {
				type: {
					const: 'action-request@1.0.0',
				},
				data: {
					type: 'object',
					required: ['action', 'input'],
					properties: {
						action: {
							const: 'action-schedule-action@1.0.0',
						},
						input: {
							type: 'object',
							required: ['id'],
							properties: {
								id: {
									const: executed.data.id,
								},
							},
						},
					},
				},
			},
		});
		expect(expected).not.toBeNull();
	});

	test('deleting a scheduled-action should trigger action-schedule-action', async () => {
		const scheduledAction = await createScheduledAction();
		const updateRequest = await ctx.queue.producer.enqueue(
			ctx.worker.getId(),
			ctx.session,
			{
				action: 'action-update-card@1.0.0',
				context: ctx.context,
				card: scheduledAction.id,
				type: scheduledAction.type,
				arguments: {
					reason: null,
					patch: [
						{
							op: 'replace',
							path: '/active',
							value: false,
						},
					],
				},
			},
		);
		const executed = await ctx.worker.execute(ctx.session, updateRequest);

		const expected = await ctx.waitForMatch({
			type: 'object',
			required: ['type', 'data'],
			properties: {
				type: {
					const: 'action-request@1.0.0',
				},
				data: {
					type: 'object',
					required: ['action', 'input'],
					properties: {
						action: {
							const: 'action-schedule-action@1.0.0',
						},
						input: {
							type: 'object',
							required: ['id'],
							properties: {
								id: {
									const: executed.data.id,
								},
							},
						},
					},
				},
			},
		});
		expect(expected).not.toBeNull();
	});
});
