/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export function brainstormCall({
	mixin,
	uiSchemaDef,
	withEvents,
}: Mixins): ContractDefinition {
	return mixin(withEvents)({
		slug: 'brainstorm-call',
		name: 'Brainstorm Call',
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
							datetime: {
								title: 'Meeting date/time',
								type: 'string',
								format: 'date-time',
							},
							schedule: {
								title: 'Meeting schedule',
								type: 'object',
								properties: {
									start: {
										title: 'Start date/time',
										type: 'string',
										format: 'date-time',
									},
									end: {
										title: 'End date/time',
										type: 'string',
										format: 'date-time',
									},
									interval: {
										title: 'Interval',
										type: 'string',
									},
								},
							},
						},
						required: ['datetime'],
					},
				},
			},
			uiSchema: {
				snippet: {
					data: {
						datetime: {
							$ref: uiSchemaDef('dateTime'),
							'ui:title': null,
						},
					},
				},
				fields: {
					data: {
						datetime: {
							$ref: uiSchemaDef('dateTime'),
						},
					},
				},
			},
			required: ['name', 'data'],
		},
	});
}
