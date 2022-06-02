import type {
	Contract,
	TypeContract,
	UserContract,
} from '@balena/jellyfish-types/build/core';
import type {
	ActionHandlerRequest,
	WorkerContext,
} from '@balena/jellyfish-worker';

/**
 * @summary Add link between user card and another card
 * @function
 *
 * @param context - execution context
 * @param request - action request
 * @param fromCard - card to link from
 * @param userCard - user card to link to
 */
export async function addLinkCard(
	context: WorkerContext,
	request: ActionHandlerRequest,
	fromCard: Contract,
	userCard: Contract,
): Promise<void> {
	const linkTypeCard = (await context.getCardBySlug(
		context.privilegedSession,
		'link@1.0.0',
	))! as TypeContract;
	await context.insertCard(
		context.privilegedSession,
		linkTypeCard,
		{
			timestamp: request.timestamp,
			actor: request.actor,
			originator: request.originator,
			attachEvents: false,
		},
		{
			slug: await context.getEventSlug('link'),
			type: 'link@1.0.0',
			name: 'is attached to',
			data: {
				inverseName: 'has requested',
				from: {
					id: fromCard.id,
					type: fromCard.type,
				},
				to: {
					id: userCard.id,
					type: userCard.type,
				},
			},
		},
	);
}

export async function getPasswordContractForUser(
	context: WorkerContext,
	userContract: UserContract,
): Promise<Contract> {
	const results = await context.query(
		context.privilegedSession,
		{
			type: 'object',
			required: ['type'],
			properties: {
				type: {
					const: 'authentication-password@1.0.0',
				},
			},
			$$links: {
				authenticates: {
					type: 'object',
					required: ['type', 'id'],
					properties: {
						type: {
							type: 'string',
							const: 'user@1.0.0',
						},
						id: {
							type: 'string',
							const: userContract.id,
						},
					},
				},
			},
		},
		{ limit: 1 },
	);

	return results[0];
}
