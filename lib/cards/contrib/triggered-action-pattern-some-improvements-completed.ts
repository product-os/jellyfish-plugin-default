/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { TriggeredActionContractDefinition } from '@balena/jellyfish-types/build/worker';

export const triggeredActionPatternSomeImprovementsCompleted: TriggeredActionContractDefinition =
	{
		slug: 'triggered-action-pattern-some-improvements-completed',
		type: 'triggered-action@1.0.0',
		name: 'Triggered action for updating pattern status when some - but not all - improvements are completed',
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
						const: 'pattern@1.0.0',
					},
					data: {
						type: 'object',
						required: ['status', 'improvementsPercentComplete'],
						properties: {
							status: {
								type: 'string',
								enum: ['improvement-in-progress', 'resolved-pending-review'],
							},
							improvementsPercentComplete: {
								type: 'number',
								exclusiveMinimum: 0,
								exclusiveMaximum: 100,
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
					"Pattern status set to 'Partially resolved' because some - but not all - linked improvements are completed",
				patch: [
					{
						op: 'replace',
						path: '/data/status',
						value: 'partially-resolved',
					},
				],
			},
		},
	};
