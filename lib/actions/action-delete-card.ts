import * as assert from '@balena/jellyfish-assert';
import type { TypeContract } from '@balena/jellyfish-types/build/core';
import {
	ActionDefinition,
	errors as workerErrors,
} from '@balena/jellyfish-worker';

const handler: ActionDefinition['handler'] = async (
	session,
	context,
	contract,
	request,
) => {
	if (!contract.active) {
		return {
			id: contract.id,
			type: contract.type,
			version: contract.version,
			slug: contract.slug,
		};
	}

	const typeContract = (await context.getCardBySlug(
		session,
		contract.type,
	))! as TypeContract;
	assert.USER(
		request.logContext,
		typeContract,
		workerErrors.WorkerNoElement,
		`No such type: ${contract.type}`,
	);

	const result = await context.patchCard(
		context.privilegedSession,
		typeContract,
		{
			timestamp: request.timestamp,
			actor: request.actor,
			originator: request.originator,
			attachEvents: true,
		},
		contract,
		[
			{
				op: 'replace',
				path: '/active',
				value: false,
			},
		],
	);

	if (!result) {
		return null;
	}

	return {
		id: result.id,
		type: result.type,
		version: result.version,
		slug: result.slug,
	};
};

export const actionDeleteCard: ActionDefinition = {
	handler,
	contract: {
		slug: 'action-delete-card',
		version: '1.0.0',
		type: 'action@1.0.0',
		name: 'Delete a contract',
		data: {
			extends: 'action-update-card',
			arguments: {},
		},
	},
};
