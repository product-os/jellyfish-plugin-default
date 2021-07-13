/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { TriggeredActionContractDefinition } from '@balena/jellyfish-types/build/worker';

export const triggeredActionIntegrationImportEvent: TriggeredActionContractDefinition =
	{
		slug: 'triggered-action-integration-import-event',
		type: 'triggered-action@1.0.0',
		name: 'Triggered action for external service import events',
		markers: [],
		data: {
			schedule: 'async',
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
								enum: [
									'balena-api',
									'front',
									'discourse',
									'github',
									'outreach',
									'flowdock',
									'typeform',
								],
							},
						},
					},
				},
			},
			action: 'action-integration-import-event@1.0.0',
			target: {
				$eval: 'source.id',
			},
			arguments: {},
		},
	};
