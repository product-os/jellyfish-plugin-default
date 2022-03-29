import type { TypeContract } from '@balena/jellyfish-types/build/core';
import type { ActionDefinition } from '@balena/jellyfish-worker';
import { get, isString } from 'lodash';

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

	const path = isString(request.arguments.property)
		? `/${request.arguments.property.replace(/\./g, '/')}`
		: `/${request.arguments.property.join('/')}`;

	const current = get(contract, request.arguments.property);

	const result = await context.patchCard(
		session,
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
				op: current ? 'replace' : 'add',
				path,
				value: request.arguments.value,
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

export const actionSetUpdate: ActionDefinition = {
	handler,
	contract: {
		slug: 'action-set-update',
		version: '1.0.0',
		type: 'action@1.0.0',
		name: 'Update a field on a contract',
		data: {
			filter: {
				type: 'object',
			},
			arguments: {
				property: {
					type: 'string',
				},
				value: {
					type: ['string', 'number', 'array'],
				},
			},
		},
	},
};
