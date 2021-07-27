/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const statusOptions = [
	'Created',
	'Discovery',
	'Evaluation',
	'Committed ',
	'Closed Won',
	'Closed Lost',
];

export function opportunity({
	mixin,
	uiSchemaDef,
	withEvents,
	asPipelineItem,
}: Mixins): ContractDefinition {
	return mixin(
		withEvents,
		asPipelineItem(statusOptions, statusOptions[0]),
	)({
		slug: 'opportunity',
		name: 'Opportunity',
		type: 'type@1.0.0',
		markers: [],
		data: {
			schema: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						fullTextSearch: true,
					},
					data: {
						type: 'object',
						properties: {
							status: {
								title: 'Status',
								type: 'string',
								default: 'Created',
								enum: [
									'Created',
									'Discovery',
									'Evaluation',
									'Committed ',
									'Closed Won',
									'Closed Lost',
								],
							},
							dueDate: {
								title: 'Expected close date',
								type: 'string',
								format: 'date',
							},
							recurringValue: {
								title: 'Estimated recurring value',
								type: 'number',
								format: 'currency',
								minimum: 0,
							},
							nonRecurringValue: {
								title: 'Estimated non-recurring value',
								type: 'number',
								format: 'currency',
								minimum: 0,
							},
							totalValue: {
								title: 'Total value',
								type: 'number',
								format: 'currency',
								$$formula:
									'SUM([contract.data.recurringValue, contract.data.nonRecurringValue])',
								minimum: 0,
							},
							device: {
								title: 'Device Type',
								type: 'string',
							},
							usecase: {
								title: 'Use case(s)',
								type: 'string',
								format: 'markdown',
							},
							stack: {
								title: 'Tech stack',
								type: 'string',
								format: 'markdown',
							},
						},
						required: ['status'],
					},
				},
			},
			uiSchema: {
				fields: {
					data: {
						status: {
							'ui:Widget': 'Badge',
						},
						dueDate: {
							$ref: uiSchemaDef('date'),
						},
					},
				},
			},
			slices: ['properties.data.properties.status'],
		},
	});
}
