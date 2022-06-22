import {
	ActionDefinition,
	errors as workerErrors,
} from '@balena/jellyfish-worker';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from './constants';
import {
	getPasswordContractForUser,
	setPasswordContractForUser,
} from './utils';

const pre: ActionDefinition['pre'] = async (session, context, request) => {
	const passwordContract = await getPasswordContractForUser(
		context,
		session,
		request.card,
	);
	const currentPassword = request.arguments.currentPassword;
	let authenticated = false;
	if (currentPassword) {
		if (
			passwordContract !== null &&
			passwordContract.active &&
			(await bcrypt.compare(
				currentPassword,
				passwordContract.data.hash as string,
			))
		) {
			authenticated = true;
		}
	} else {
		if (passwordContract === null || !passwordContract.active) {
			authenticated = true;
		}
	}
	if (!authenticated) {
		throw new workerErrors.WorkerAuthenticationError(
			'Password change not allowed',
		);
	}

	delete request.arguments.currentPassword;
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
