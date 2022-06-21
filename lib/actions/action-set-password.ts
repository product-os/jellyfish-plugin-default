import * as assert from '@balena/jellyfish-assert';
import type { TypeContract } from '@balena/jellyfish-types/build/core';
import {
	ActionDefinition,
	actions,
	errors as workerErrors,
} from '@balena/jellyfish-worker';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS, PASSWORDLESS_USER_HASH } from './constants';
import { setPasswordContractForUser } from './utils';

const actionCreateSession = actions.filter((action) => {
	return action.contract.slug === 'action-create-session';
})[0];

const pre: ActionDefinition['pre'] = async (session, context, request) => {
	const card = await context.getCardById(
		context.privilegedSession,
		request.card,
	);
	const isFirstTimePassword =
		card &&
		card.data &&
		card.data.hash === PASSWORDLESS_USER_HASH &&
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
	card,
	request,
) => {
	const typeCard = (await context.getCardBySlug(
		session,
		card.type,
	))! as TypeContract;

	assert.INTERNAL(
		request.logContext,
		typeCard,
		workerErrors.WorkerNoElement,
		`No such type: ${card.type}`,
	);

	return setPasswordContractForUser(
		context,
		session,
		request,
		card.id,
		request.arguments.newPassword,
	);
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
