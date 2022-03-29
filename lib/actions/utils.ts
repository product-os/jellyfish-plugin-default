import type {
	Contract,
	TypeContract,
} from '@balena/jellyfish-types/build/core';
import type {
	ActionHandlerRequest,
	WorkerContext,
} from '@balena/jellyfish-worker';

/**
 * @summary Add link between user contract and another contract
 * @function
 *
 * @param context - execution context
 * @param request - action request
 * @param fromContract - contract to link from
 * @param userContract - user contract to link to
 */
export async function addLinkContract(
	context: WorkerContext,
	request: ActionHandlerRequest,
	fromContract: Contract,
	userContract: Contract,
): Promise<void> {
	const linkTypeContract = (await context.getCardBySlug(
		context.privilegedSession,
		'link@1.0.0',
	))! as TypeContract;
	await context.insertCard(
		context.privilegedSession,
		linkTypeContract,
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
					id: fromContract.id,
					type: fromContract.type,
				},
				to: {
					id: userContract.id,
					type: userContract.type,
				},
			},
		},
	);
}
