/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { TriggeredActionContractDefinition } from '@balena/jellyfish-types/build/worker';

export const triggeredActionSupportClosedPatternReopen: TriggeredActionContractDefinition =
	{
		slug: 'triggered-action-support-closed-pattern-reopen',
		type: 'triggered-action@1.0.0',
		name: 'Triggered action for reopening support threads when patterns are closed',
		markers: [],
		data: {
			schedule: 'sync',
			filter: {
				$$links: {
					'is attached to': {
						$$links: {
							'is attached to': {
								type: 'object',
								required: ['type', 'data'],
								properties: {
									type: {
										type: 'string',
										const: 'support-thread@1.0.0',
									},
									data: {
										type: 'object',
										required: ['status'],
										properties: {
											status: {
												type: 'string',
												not: {
													const: 'open',
												},
											},
										},
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
								const: 'pattern@1.0.0',
							},
						},
					},
				},
				type: 'object',
				required: ['active', 'type', 'data'],
				properties: {
					active: {
						type: 'boolean',
						const: true,
					},
					type: {
						type: 'string',
						const: 'update@1.0.0',
					},
					data: {
						type: 'object',
						required: ['payload'],
						properties: {
							payload: {
								type: 'array',
								contains: {
									type: 'object',
									required: ['op', 'path', 'value'],
									properties: {
										op: {
											type: 'string',
											const: 'replace',
										},
										path: {
											type: 'string',
											const: '/data/status',
										},
										value: {
											type: 'string',
											const: 'closed-resolved',
										},
									},
								},
							},
						},
					},
				},
			},
			action: 'action-update-card@1.0.0',
			target: {
				$map: {
					$eval:
						"source.links['is attached to'][0].links['is attached to'][0:]",
				},
				'each(link)': {
					$eval: 'link.id',
				},
			},
			arguments: {
				reason: 'Support Thread re-opened because linked Pattern was closed',
				patch: [
					{
						op: 'replace',
						path: '/data/status',
						value: 'open',
					},
				],
			},
		},
	};