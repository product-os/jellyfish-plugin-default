import * as assert from '@balena/jellyfish-assert';
import { getLogger } from '@balena/jellyfish-logger';
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
import { errors as autumndbErrors } from 'autumndb';
import { isNil } from 'lodash';
import { actionCompletePasswordReset } from './action-complete-password-reset';
import { getPasswordContractForUser } from './utils';

const logger = getLogger(__filename);
const pre = actionCompletePasswordReset.pre;

/**
 * @summary Get first-time login card from database
 * @function
 *
 * @param context - execution context
 * @param request - action request
 * @returns
 */
export async function getFirstTimeLoginCard(
	context: WorkerContext,
	request: ActionHandlerRequest,
): Promise<Contract | null> {
	const [firstTimeLogin] = await context.query(
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
			required: ['type', 'links', 'active', 'data'],
			additionalProperties: true,
			properties: {
				type: {
					type: 'string',
					const: 'first-time-login@1.0.0',
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
						firstTimeLoginToken: {
							type: 'string',
							const: request.arguments.firstTimeLoginToken,
						},
					},
					required: ['firstTimeLoginToken'],
				},
			},
		},
		{
			limit: 1,
		},
	);
	return firstTimeLogin;
}

/**
 * @summary Invalidate a first-time login card
 * @function
 *
 * @param context - execution context
 * @param session - user session
 * @param request - action request
 * @param card - first-time login card to invalidate
 * @returns invalidated first-time login card
 */
export async function invalidateFirstTimeLogin(
	context: WorkerContext,
	request: ActionHandlerRequest,
	card: Contract,
): Promise<Contract> {
	const typeCard = (await context.getCardBySlug(
		context.privilegedSession,
		'first-time-login@latest',
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
		card,
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
	const firstTimeLogin = await getFirstTimeLoginCard(context, request);
	if (isNil(firstTimeLogin)) {
		const error = new workerErrors.WorkerAuthenticationError(
			'First-time login token invalid',
		);
		logger.warn(
			request.logContext,
			`Could not find firstTimeLogin card with token ${request.arguments.firstTimeLoginToken}`,
		);
		throw error;
	}

	await invalidateFirstTimeLogin(context, request, firstTimeLogin);

	const user = firstTimeLogin?.links?.['is attached to'][0] as UserContract;

	if (isNil(user)) {
		const error = new workerErrors.WorkerAuthenticationError(
			'First-time login token invalid',
		);
		logger.warn(
			request.logContext,
			`FirstTimeLogin card with token
			${request.arguments.firstTimeLoginToken} has no user attached`,
		);
		throw error;
	}

	assert.USER(
		request.logContext,
		user,
		workerErrors.WorkerAuthenticationError,
		'First-time login token invalid',
	);

	const hasExpired =
		new Date(firstTimeLogin.data.expiresAt as string) < new Date();
	if (hasExpired) {
		const newError = new workerErrors.WorkerAuthenticationError(
			'First-time login token has expired',
		);
		throw newError;
	}

	const passwordContract = await getPasswordContractForUser(context, user);

	assert.USER(
		request.logContext,
		passwordContract,
		workerErrors.WorkerAuthenticationError,
		'User already has a password set',
	);

	const passwordTypeCard = (await context.getCardBySlug(
		session,
		'authentication-password@latest',
	))! as TypeContract;

	return context
		.insertCard(
			context.privilegedSession,
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
					hash: request.arguments.newPassword,
					actor: user.id,
				},
			},
		)
		.catch((error: unknown) => {
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
		});
};

export const actionCompleteFirstTimeLogin: ActionDefinition = {
	pre,
	handler,
	contract: {
		slug: 'action-complete-first-time-login',
		version: '1.0.0',
		type: 'action@1.0.0',
		name: 'Complete the first time login of a user',
		data: {
			arguments: {
				newPassword: {
					type: 'string',
				},
				firstTimeLoginToken: {
					type: 'string',
					format: 'uuid',
				},
			},
		},
	},
};
