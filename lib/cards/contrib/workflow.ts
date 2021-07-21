/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const workflow: ContractDefinition = {
	slug: 'workflow',
	type: 'type@1.0.0',
	name: 'Workflow',
	markers: [],
	data: {
		schema: {
			type: 'object',
			properties: {
				name: {
					type: ['string', 'null'],
					fullTextSearch: true,
				},
				tags: {
					type: 'array',
					items: {
						type: 'string',
					},
					$$formula: "AGGREGATE($events, 'tags')",
				},
				data: {
					type: 'object',
					properties: {
						status: {
							title: 'Status',
							type: 'string',
							default: 'draft',
							enum: ['draft', 'candidate', 'complete'],
						},
						loop: {
							type: 'string',
						},
						lifecycle: {
							type: 'string',
						},
						description: {
							type: 'string',
							format: 'markdown',
						},
						diagram: {
							type: 'string',
							format: 'mermaid',
						},
					},
				},
			},
		},
		uiSchema: {
			fields: {
				'ui:options': {
					alignSelf: 'stretch',
				},
				data: {
					'ui:options': {
						alignSelf: 'stretch',
					},
					status: {
						'ui:widget': 'Badge',
					},
					diagram: {
						'ui:options': {
							alignSelf: 'stretch',
						},
					},
				},
			},
			edit: {
				$ref: '#/data/uiSchema/definitions/form',
			},
			create: {
				$ref: '#/data/uiSchema/edit',
			},
			definitions: {
				form: {
					data: {
						loop: {
							'ui:widget': 'AutoCompleteWidget',
							'ui:options': {
								resource: 'workflow',
								keyPath: 'data.loop',
							},
						},
						lifecycle: {
							'ui:widget': 'AutoCompleteWidget',
							'ui:options': {
								resource: 'workflow',
								keyPath: 'data.lifecycle',
							},
						},
					},
				},
			},
		},
		slices: ['properties.data.properties.status'],
	},
};