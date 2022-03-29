import * as assert from '@balena/jellyfish-assert';
import type { TypeContract } from '@balena/jellyfish-types/build/core';
import {
	ActionDefinition,
	actions,
	errors as workerErrors,
} from '@balena/jellyfish-worker';
import { errors as autumndbErrors } from 'autumndb';
import bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';
import { BCRYPT_SALT_ROUNDS, PASSWORDLESS_USER_HASH } from './constants';

const actionCreateSession = actions['action-create-session'];

const pre: ActionDefinition['pre'] = async (session, context, request) => {
	const contract = await context.getCardById(
		context.privilegedSession,
		request.card,
	);
	const isFirstTimePassword =
		contract &&
		contract.data &&
		contract.data.hash === PASSWORDLESS_USER_HASH &&
		!request.arguments.currentPassword;

	// TS-TODO: This is broken
	const loginResult = {
		password: '',
	};
	if (!isFirstTimePassword && actionCreateSession.pre) {
		// This call will throw if the current password is incorrect.
		await actionCreateSession.pre(session, context, {
			action: 'TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO',
			type: 'TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO',
			card: request.card,
			logContext: request.logContext,
			arguments: {
				password: String(request.arguments.currentPassword),
			},
		});
		loginResult.password = 'CHECKED IN PRE HOOK';
	}

	// Don't store passwords in plain text
	request.arguments.currentPassword = loginResult.password;
	request.arguments.newPassword = await bcrypt.hash(
		request.arguments.newPassword,
		BCRYPT_SALT_ROUNDS,
	);

	return request.arguments;
};

const handler: ActionDefinition['handler'] = async (
	session,
	context,
	contract,
	request,
) => {
	const typeContract = (await context.getCardBySlug(
		session,
		contract.type,
	))! as TypeContract;

	assert.INTERNAL(
		request.logContext,
		typeContract,
		workerErrors.WorkerNoElement,
		`No such type: ${contract.type}`,
	);

	return context
		.patchCard(
			session,
			typeContract,
			{
				timestamp: request.timestamp,
				actor: request.actor,
				originator: request.originator,
				attachEvents: false,
			},
			contract,
			[
				{
					op: isEmpty(request.arguments.currentPassword) ? 'add' : 'replace',
					path: '/data/hash',
					value: request.arguments.newPassword,
				},
			],
		)
		.catch((error: unknown) => {
			// A schema mismatch here means that the patch could
			// not be applied to the contract due to permissions.
			if (error instanceof autumndbErrors.JellyfishSchemaMismatch) {
				const newError = new workerErrors.WorkerAuthenticationError(
					'Password change not allowed',
				);
				throw newError;
			}

			throw error;
		});
};

export const actionSetPassword: ActionDefinition = {
	pre,
	handler,
	contract: {
		slug: 'action-set-password',
		version: '1.0.0',
		type: 'action@1.0.0',
		name: 'Set user password',
		data: {
			filter: {
				type: 'object',
				properties: {
					type: {
						type: 'string',
						const: 'user@1.0.0',
					},
				},
				required: ['type'],
			},
			arguments: {
				currentPassword: {
					type: ['string', 'null'],
				},
				newPassword: {
					type: 'string',
				},
			},
		},
	},
};
