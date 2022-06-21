import * as assert from '@balena/jellyfish-assert';
import type {
	Contract,
	TypeContract,
	UserContract,
} from '@balena/jellyfish-types/build/core';
import {
	ActionDefinition,
	ActionHandlerRequest,
	errors as workerErrors,
	WorkerContext,
} from '@balena/jellyfish-worker';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from './constants';
import { setPasswordContractForUser } from './utils';

const pre: ActionDefinition['pre'] = async (_session, _context, request) => {
	// Convert the plaintext password into a hash so that we don't have a plain password stored in the DB
	request.arguments.newPassword = await bcrypt.hash(
		request.arguments.newPassword,
		BCRYPT_SALT_ROUNDS,
	);
	return request.arguments;
};

/**
 * @summary Get a password reset card from the backend
 * @function
 *
 * @param context - execution context
 * @param request - action request
 * @returns password reset card
 */
export async function getPasswordResetCard(
	context: WorkerContext,
	request: ActionHandlerRequest,
): Promise<Contract> {
	const [passwordResetCard] = await context.query(
		context.privilegedSession,
		{
			$$links: {
				'is attached to': {
					type: 'object',
					properties: {
						active: {
							type: 'boolean',
							const: true,
						},
					},
				},
			},
			type: 'object',
			required: ['type', 'links', 'data'],
			additionalProperties: true,
			properties: {
				type: {
					type: 'string',
					const: 'password-reset@1.0.0',
				},
				active: {
					type: 'boolean',
					const: true,
				},
				links: {
					type: 'object',
					additionalProperties: true,
				},
				data: {
					type: 'object',
					properties: {
						resetToken: {
							type: 'string',
							const: request.arguments.resetToken,
						},
					},
					required: ['resetToken'],
				},
			},
		},
		{
			limit: 1,
		},
	);
	return passwordResetCard;
}

/**
 * @summary Invalidate a password reset card
 * @function
 *
 * @param context - execution context
 * @param session - user session
 * @param request - action request
 * @param passwordResetCard - password reset card
 * @returns invalidated password reset card
 */
export async function invalidatePasswordReset(
	context: WorkerContext,
	request: ActionHandlerRequest,
	passwordResetCard: Contract,
): Promise<Contract> {
	const typeCard = (await context.getCardBySlug(
		context.privilegedSession,
		'password-reset@1.0.0',
	))! as TypeContract;
	return (await context.patchCard(
		context.privilegedSession,
		typeCard,
		{
			timestamp: request.timestamp,
			actor: request.actor,
			originator: request.originator,
			attachEvents: true,
		},
		passwordResetCard,
		[
			{
				op: 'replace',
				path: '/active',
				value: false,
			},
		],
	))!;
}

const handler: ActionDefinition['handler'] = async (
	session,
	context,
	_card,
	request,
) => {
	const passwordReset = await getPasswordResetCard(context, request);
	assert.USER(
		request.logContext,
		passwordReset,
		workerErrors.WorkerAuthenticationError,
		'Reset token invalid',
	);

	await invalidatePasswordReset(context, request, passwordReset);

	const user: UserContract = passwordReset.links?.[
		'is attached to'
	][0] as UserContract;

	assert.USER(
		request.logContext,
		user,
		workerErrors.WorkerAuthenticationError,
		'Reset token invalid',
	);

	const hasExpired =
		new Date(passwordReset.data.expiresAt as string) < new Date();
	if (hasExpired) {
		const newError = new workerErrors.WorkerAuthenticationError(
			'Password reset token has expired',
		);
		throw newError;
	}

	return setPasswordContractForUser(
		context,
		session,
		request,
		user.id,
		request.arguments.newPassword,
	);
};

export const actionCompletePasswordReset: ActionDefinition = {
	pre,
	handler,
	contract: {
		slug: 'action-complete-password-reset',
		version: '1.0.0',
		type: 'action@1.0.0',
		name: 'Complete password reset',
		data: {
			arguments: {
				newPassword: {
					type: 'string',
				},
				resetToken: {
					type: 'string',
					pattern: '^[0-9a-fA-F]{64}$',
				},
			},
		},
	},
};

export { pre };
