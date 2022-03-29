import * as assert from '@balena/jellyfish-assert';
import type {
	Contract,
	TypeContract,
} from '@balena/jellyfish-types/build/core';
import {
	ActionDefinition,
	ActionHandlerRequest,
	errors as workerErrors,
	WorkerContext,
} from '@balena/jellyfish-worker';
import { errors as autumndbErrors } from 'autumndb';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from './constants';

const pre: ActionDefinition['pre'] = async (_session, _context, request) => {
	// Convert the plaintext password into a hash so that we don't have a plain password stored in the DB
	request.arguments.newPassword = await bcrypt.hash(
		request.arguments.newPassword,
		BCRYPT_SALT_ROUNDS,
	);
	return request.arguments;
};

/**
 * @summary Get a password reset contract from the backend
 * @function
 *
 * @param context - execution context
 * @param request - action request
 * @returns password reset contract
 */
export async function getPasswordResetContract(
	context: WorkerContext,
	request: ActionHandlerRequest,
): Promise<Contract> {
	const [passwordResetContract] = await context.query(
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
	return passwordResetContract;
}

/**
 * @summary Invalidate a password reset contract
 * @function
 *
 * @param context - execution context
 * @param request - action request
 * @param passwordResetContract - password reset contract
 * @returns invalidated password reset contract
 */
export async function invalidatePasswordReset(
	context: WorkerContext,
	request: ActionHandlerRequest,
	passwordResetContract: Contract,
): Promise<Contract> {
	const typeContract = (await context.getCardBySlug(
		context.privilegedSession,
		'password-reset@1.0.0',
	))! as TypeContract;
	return (await context.patchCard(
		context.privilegedSession,
		typeContract,
		{
			timestamp: request.timestamp,
			actor: request.actor,
			originator: request.originator,
			attachEvents: true,
		},
		passwordResetContract,
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
	_contract,
	request,
) => {
	const passwordReset = await getPasswordResetContract(context, request);
	assert.USER(
		request.logContext,
		passwordReset,
		workerErrors.WorkerAuthenticationError,
		'Reset token invalid',
	);

	await invalidatePasswordReset(context, request, passwordReset);

	const [user] =
		passwordReset.links && passwordReset.links['is attached to']
			? passwordReset.links['is attached to']
			: [null];

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

	const userTypeContract = (await context.getCardBySlug(
		session,
		'user@latest',
	))! as TypeContract;

	return context
		.patchCard(
			context.privilegedSession,
			userTypeContract,
			{
				timestamp: request.timestamp,
				actor: request.actor,
				originator: request.originator,
				attachEvents: false,
			},
			user!,
			[
				{
					op: 'replace',
					path: '/data/hash',
					value: request.arguments.newPassword,
				},
			],
		)
		.catch((error: unknown) => {
			// A schema mismatch here means that the patch could
			// not be applied to the contract due to permissions.
			if (error instanceof autumndbErrors.JellyfishSchemaMismatch) {
				// TS-TODO: Ensure this error is what is expected with Context type
				const newError = new workerErrors.WorkerAuthenticationError(
					'Password change not allowed',
				);
				throw newError;
			}

			throw error;
		});
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
