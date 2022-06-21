import type {
	Contract,
	TypeContract,
} from '@balena/jellyfish-types/build/core';
import { errors as autumndbErrors } from 'autumndb';
import {
	ActionHandlerRequest,
	errors as workerErrors,
	WorkerContext,
} from '@balena/jellyfish-worker';
import { strict as assert } from 'assert';

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
			slug: context.getEventSlug('link'),
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
	session: string,
	userId: string,
): Promise<Contract | null> {
	const results = await context.query(
		session,
		{
			properties: {
				type: {
					const: 'authentication-password@1.0.0',
				},
			},
			$$links: {
				authenticates: {
					additionalProperties: false,
					properties: {
						type: {
							const: 'user@1.0.0',
						},
						id: {
							const: userId,
						},
					},
				},
			},
		},
		{ limit: 1 },
	);

	if (results.length === 0) {
		return null;
	} else {
		return results[0];
	}
}

export async function setPasswordContractForUser(
	context: WorkerContext,
	session: string,
	request: ActionHandlerRequest,
	userId: string,
	hash: string = '',
): Promise<Contract | null> {
	const currentAuthenticationContract = await getPasswordContractForUser(
		context,
		session,
		userId,
	);
	const passwordTypeCard = context.cards[
		'authentication-password@1.0.0'
	] as TypeContract;
	try {
		if (hash.charAt(0) === '$') {
			// Valid hashes start with a dollar sign. Every other hash is invalid on purpose

			if (currentAuthenticationContract === null) {
				// Create a new password contract and link it with the user contract
				const authenticationContract = await context.insertCard(
					session,
					passwordTypeCard,
					{
						timestamp: request.timestamp,
						actor: request.actor,
						originator: request.originator,
						attachEvents: false,
					},
					{
						type: 'authentication-password@1.0.0',
						data: {
							hash,
							actorId: userId,
						},
					},
				);
				assert(authenticationContract);
				await context.insertCard(
					session,
					context.cards['link@1.0.0'] as TypeContract,
					{
						timestamp: request.timestamp,
						actor: request.actor,
						originator: request.originator,
						attachEvents: false,
					},
					{
						type: 'link@1.0.0',
						name: 'is authenticated with',
						data: {
							from: {
								id: userId,
								type: 'user@1.0.0',
							},
							to: {
								id: authenticationContract.id,
								type: 'authentication-password@1.0.0',
							},
							inverseName: 'authenticates',
						},
					},
				);

				return authenticationContract;
			} else {
				// Update the existing password contract
				return context.patchCard(
					session,
					passwordTypeCard,
					{
						timestamp: request.timestamp,
						actor: request.actor,
						originator: request.originator,
						attachEvents: false,
					},
					currentAuthenticationContract,
					[
						{
							op: 'replace',
							path: '/active',
							value: true,
						},
						{
							op: 'replace',
							path: '/data/hash',
							value: hash,
						},
					],
				);
			}
		} else {
			// We received an invalid hash. Remove the `authentication-password` contract

			if (currentAuthenticationContract === null) {
				// Nothing to do
				return null;
			} else {
				// Deactivate the existing password contract and erase its hash
				await context.patchCard(
					session,
					passwordTypeCard,
					{
						timestamp: request.timestamp,
						actor: request.actor,
						originator: request.originator,
						attachEvents: false,
					},
					currentAuthenticationContract,
					[
						{
							op: 'replace',
							path: '/active',
							value: false,
						},
						{
							op: 'replace',
							path: '/data/hash',
							value: '',
						},
					],
				);

				return null;
			}
		}
	} catch (error: unknown) {
		console.dir(error, {
			depth: null,
		});

		// A schema mismatch here means that the patch could
		// not be applied to the card due to permissions.
		if (error instanceof autumndbErrors.JellyfishSchemaMismatch) {
			// TS-TODO: Ensure this error is what is expected with Context type
			const newError = new workerErrors.WorkerAuthenticationError(
				'Password change not allowed',
			);
			throw newError;
		}

		throw error;
	}
}
