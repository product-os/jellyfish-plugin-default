import { defaultEnvironment } from '@balena/jellyfish-environment';
import { getLogger } from '@balena/jellyfish-logger';
import type { ContractSummary } from '@balena/jellyfish-types/build/core';
import type { ActionDefinition } from '@balena/jellyfish-worker';

const logger = getLogger(__filename);

const handler: ActionDefinition['handler'] = async (
	session,
	context,
	contract,
	request,
) => {
	const contracts = await context.sync
		.translate(
			contract.data.source,
			defaultEnvironment.getIntegration(contract.data.source as string),
			contract,
			context.sync.getActionContext(
				contract.data.source,
				context,
				request.logContext,
				session,
			),
			{
				actor: request.actor,
				defaultUser: defaultEnvironment.integration.default.user,
				origin: `${defaultEnvironment.oauth.redirectBaseUrl}/oauth/${contract.data.source}`,
				timestamp: request.timestamp,
			},
		)
		.catch((error: unknown) => {
			const properError =
				error instanceof Error ? error : new Error(`${error}`);
			logger.exception(request.logContext, 'Translate error', properError);
			throw error;
		});

	return contracts.map((element: ContractSummary) => {
		return {
			id: element.id,
			type: element.type,
			version: element.version,
			slug: element.slug,
		};
	});
};

export const actionIntegrationImportEvent: ActionDefinition = {
	handler,
	contract: {
		slug: 'action-integration-import-event',
		version: '1.0.0',
		type: 'action@1.0.0',
		data: {
			filter: {
				type: 'object',
				required: ['type', 'data'],
				properties: {
					type: {
						type: 'string',
						const: 'external-event@1.0.0',
					},
					data: {
						type: 'object',
						required: ['source'],
						properties: {
							source: {
								type: 'string',
							},
						},
					},
				},
			},
			arguments: {},
		},
	},
};
