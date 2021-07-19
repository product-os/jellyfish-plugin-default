/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { TriggeredActionContractDefinition } from '@balena/jellyfish-types/build/worker';

export const triggeredActionImprovementAllMilestonesCompleted: TriggeredActionContractDefinition =
	{
		slug: 'triggered-action-improvement-all-milestones-completed',
		type: 'triggered-action@1.0.0',
		name: 'Triggered action for updating improvement status when all milestones are completed',
		markers: [],
		data: {
			schedule: 'sync',
			filter: {
				type: 'object',
				required: ['active', 'type', 'data'],
				properties: {
					active: {
						type: 'boolean',
						const: true,
					},
					type: {
						type: 'string',
						const: 'improvement@1.0.0',
					},
					data: {
						type: 'object',
						required: ['status', 'milestonesPercentComplete'],
						properties: {
							status: {
								type: 'string',
								not: {
									enum: ['denied-or-failed', 'completed'],
								},
							},
							milestonesPercentComplete: {
								type: 'number',
								const: 100,
							},
						},
					},
				},
			},
			action: 'action-update-card@1.0.0',
			target: {
				$eval: 'source.id',
			},
			arguments: {
				reason:
					"Improvement status set to 'Completed' because all linked milestones are completed",
				patch: [
					{
						op: 'replace',
						path: '/data/status',
						value: 'completed',
					},
				],
			},
		},
	};
