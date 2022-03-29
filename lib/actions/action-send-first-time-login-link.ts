import * as assert from '@balena/jellyfish-assert';
import { getLogger } from '@balena/jellyfish-logger';
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
import { get, includes, intersectionBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { actionSendEmail } from './action-send-email';
import { buildSendEmailOptions } from './mail-utils';
import { addLinkContract } from './utils';

const logger = getLogger(__filename);
const sendEmailHandler = actionSendEmail.handler;

/**
 * @summary Get organization contracts for a given user
 * @function
 *
 * @param context - execution context
 * @param userId - user ID
 * @returns set of organization contracts
 */
export async function queryUserOrgs(
	context: WorkerContext,
	userId: string,
): Promise<Contract[]> {
	return context.query(context.privilegedSession, {
		$$links: {
			'has member': {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						const: userId,
					},
					type: {
						type: 'string',
						const: 'user@1.0.0',
					},
				},
			},
		},
		type: 'object',
		properties: {
			type: {
				type: 'string',
				const: 'org@1.0.0',
			},
			links: {
				type: 'object',
			},
		},
	});
}

/**
 * @summary Get a user's roles from the backend
 * @function
 *
 * @param context - execution context
 * @param userId - user ID
 * @param request - action request
 * @returns list of roles
 */
export async function getUserRoles(
	context: WorkerContext,
	userId: string,
	request: ActionHandlerRequest,
): Promise<string[]> {
	const [user] = await context.query(context.privilegedSession, {
		type: 'object',
		properties: {
			id: {
				const: userId,
			},
			data: {
				type: 'object',
				properties: {
					roles: {
						type: 'array',
						items: {
							type: 'string',
						},
					},
				},
			},
		},
	});
	const roles = get(user, ['data', 'roles']) as string[];
	assert.USER(
		request.logContext,
		roles,
		workerErrors.WorkerNoElement,
		"Something went wrong while trying to query for the user's roles",
	);
	return roles;
}

/**
 * @summary Invalidate previous first time login contracts
 * @function
 *
 * @param context - execution context
 * @param request - action request
 * @param userId - user ID
 * @param typeContract - type contract
 */
export async function invalidatePreviousFirstTimeLogins(
	context: WorkerContext,
	request: ActionHandlerRequest,
	userId: string,
	typeContract: TypeContract,
): Promise<void> {
	const previousFirstTimeLogins = await context.query(
		context.privilegedSession,
		{
			type: 'object',
			required: ['type', 'id'],
			additionalProperties: true,
			properties: {
				id: {
					type: 'string',
				},
				type: {
					type: 'string',
					const: 'first-time-login@1.0.0',
				},
			},
			$$links: {
				'is attached to': {
					type: 'object',
					properties: {
						id: {
							type: 'string',
							const: userId,
						},
					},
				},
			},
		},
	);

	if (previousFirstTimeLogins.length > 0) {
		await Promise.all(
			previousFirstTimeLogins.map((firstTimeLogin: Contract) => {
				return context.patchCard(
					context.privilegedSession,
					typeContract,
					{
						timestamp: request.timestamp,
						actor: request.actor,
						originator: request.originator,
						attachEvents: true,
					},
					firstTimeLogin,
					[
						{
							op: 'replace',
							path: '/active',
							value: false,
						},
					],
				);
			}),
		);
	}
}

/**
 * @summary Add first-time login contract
 * @function
 *
 * @param context - execution context
 * @param request - action request
 * @param typeContract - type contract
 * @returns created first-time login contract
 */
export async function addFirstTimeLogin(
	context: WorkerContext,
	request: ActionHandlerRequest,
	typeContract: TypeContract,
): Promise<Contract> {
	const firstTimeLoginToken = uuidv4();
	const requestedAt = new Date();

	// The first time login token is valid for 7 days
	const sevenDaysinFuture = requestedAt.setHours(
		requestedAt.getHours() + 24 * 7,
	);
	const expiresAt = new Date(sevenDaysinFuture);
	return (await context.insertCard(
		context.privilegedSession,
		typeContract,
		{
			timestamp: request.timestamp,
			actor: request.actor,
			originator: request.originator,
			attachEvents: true,
		},
		{
			version: '1.0.0',
			slug: await context.getEventSlug('first-time-login'),
			data: {
				expiresAt: expiresAt.toISOString(),
				requestedAt: requestedAt.toISOString(),
				firstTimeLoginToken,
			},
		},
	))!;
}

/**
 * @summary Send first-time login token to user
 * @function
 *
 * @param context - execution context
 * @param userContract - user contract
 * @param firstTimeLoginToken - first-time login token
 * @returns send email request response
 */
export async function sendEmail(
	context: WorkerContext,
	userContract: Contract,
	firstTimeLoginToken: string,
): Promise<any> {
	const username = userContract.slug.replace(/^user-/g, '');
	const url = `https://jel.ly.fish/first_time_login/${firstTimeLoginToken}/${username}`;
	const html = `<p>Hello,</p><p>Here is a link to login to your new Jellyfish account ${username}.</p><p>Please use the link below to set your password and login:</p><a href="${url}">${url}</a><p>Cheers</p><p>Jellyfish Team</p><a href="https://jel.ly.fish">https://jel.ly.fish</a>`;

	return sendEmailHandler(context.privilegedSession, context, userContract, {
		arguments: buildSendEmailOptions(
			userContract,
			'Jellyfish First Time Login',
			html,
		),
	} as any);
}

/**
 * @summary Check that a user belongs to specific organizations
 * @function
 *
 * @param context - execution context
 * @param request - action request
 * @param userContract - user contract
 */
export async function checkOrgs(
	context: WorkerContext,
	request: ActionHandlerRequest,
	userContract: Contract,
): Promise<void> {
	const requesterOrgs = await queryUserOrgs(context, request.actor);
	assert.USER(
		request.logContext,
		requesterOrgs.length > 0,
		workerErrors.WorkerNoElement,
		'You do not belong to an organisation and thus cannot send a first-time login link to any users',
	);

	const userOrgs = await queryUserOrgs(context, userContract.id);
	assert.USER(
		request.logContext,
		userOrgs.length > 0,
		workerErrors.WorkerNoElement,
		`User with slug ${userContract.slug} is not a member of any organisations`,
	);

	const sharedOrgs = intersectionBy(userOrgs, requesterOrgs, 'id');
	assert.USER(
		request.logContext,
		sharedOrgs.length > 0,
		workerErrors.WorkerAuthenticationError,
		`User with slug ${userContract.slug} is not a member of any of your organisations`,
	);
}

/**
 * @summary Set "user-community" role to specified user
 * @function
 *
 * @param context - execution context
 * @param session - user session
 * @param userContract - user contract
 * @param request - action request
 */
async function setCommunityRole(
	context: WorkerContext,
	session: string,
	userContract: Contract,
	request: ActionHandlerRequest,
): Promise<void> {
	const typeContract = (await context.getCardBySlug(
		session,
		'user@latest',
	))! as TypeContract;
	await context.patchCard(
		context.privilegedSession,
		typeContract,
		{
			timestamp: request.timestamp,
			actor: request.actor,
			originator: request.originator,
			attachEvents: true,
		},
		userContract,
		[
			{
				op: 'replace',
				path: '/data/roles',
				value: ['user-community'],
			},
		],
	);
	logger.info(
		request.logContext,
		`Added community role to user with slug ${userContract.slug}`,
	);
}

const handler: ActionDefinition['handler'] = async (
	session,
	context,
	userContract,
	request,
) => {
	const typeContract = (await context.getCardBySlug(
		session,
		'first-time-login@latest',
	))! as TypeContract;
	const userEmails = userContract.data.email as string[];

	assert.USER(
		request.logContext,
		typeContract,
		workerErrors.WorkerNoElement,
		'No such type: first-time-login',
	);

	assert.USER(
		request.logContext,
		userContract.active,
		workerErrors.WorkerNoElement,
		`User with slug ${userContract.slug} is not active`,
	);

	assert.USER(
		request.logContext,
		userContract.data.email && userEmails.length,
		workerErrors.WorkerNoElement,
		`User with slug ${userContract.slug} does not have an email address`,
	);

	await checkOrgs(context, request, userContract);
	const userRoles = await getUserRoles(context, userContract.id, request);
	if (!includes(userRoles, 'user-community')) {
		logger.info(
			request.logContext,
			`User with slug ${userContract.slug} does not have community role. Setting role now`,
		);
		await setCommunityRole(context, session, userContract, request);
	}

	await invalidatePreviousFirstTimeLogins(
		context,
		request,
		userContract.id,
		typeContract,
	);
	const firstTimeLoginContract = await addFirstTimeLogin(
		context,
		request,
		typeContract,
	);
	await addLinkContract(context, request, firstTimeLoginContract, userContract);
	await sendEmail(
		context,
		userContract,
		firstTimeLoginContract.data.firstTimeLoginToken as string,
	);
	return {
		id: userContract.id,
		type: userContract.type,
		version: userContract.version,
		slug: userContract.slug,
	};
};

export const actionSendFirstTimeLoginLink: ActionDefinition = {
	handler,
	contract: {
		slug: 'action-send-first-time-login-link',
		version: '1.0.0',
		type: 'action@1.0.0',
		name: 'Send a first-time login link to a user',
		data: {
			filter: {
				type: 'object',
				properties: {
					type: {
						type: 'string',
						const: 'user@1.0.0',
					},
				},
			},
			arguments: {},
		},
	},
};
