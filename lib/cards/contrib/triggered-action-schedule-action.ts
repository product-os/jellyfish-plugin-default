/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { TriggeredActionContractDefinition } from '@balena/jellyfish-types/build/worker';

export const triggeredActionScheduleAction: TriggeredActionContractDefinition =
	{
		slug: 'triggered-action-schedule-action',
		type: 'triggered-action@1.0.0',
		name: 'Triggered action for scheduling actions',
		markers: [],
		data: {
			schedule: 'sync',
			filter: {
				$$links: {
					'is attached to': {
						type: 'object',
						required: ['active', 'type'],
						properties: {
							type: {
								type: 'string',
								const: 'scheduled-action@1.0.0',
							},
						},
					},
				},
				type: 'object',
				required: ['active', 'type'],
				properties: {
					active: {
						type: 'boolean',
						const: true,
					},
					type: {
						type: 'string',
						enum: ['create@1.0.0', 'update@1.0.0'],
					},
				},
			},
			action: 'action-schedule-action@1.0.0',
			target: {
				$eval: "source.links['is attached to'][0].id",
			},
			arguments: {},
		},
	};
