/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const group: ContractDefinition = {
	slug: 'group',
	type: 'type@1.0.0',
	name: 'Group',
	markers: [],
	data: {
		schema: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					pattern: '^[A-Za-z0-9-_]+$',
					fullTextSearch: true,
				},
				data: {
					type: 'object',
					properties: {
						description: {
							type: 'string',
						},
						namespace: {
							type: 'string',
						},
					},
				},
			},
			required: ['name'],
		},
		uiSchema: {
			snippet: {
				data: {
					'ui:order': ['namespace', 'description'],
					namespace: {
						'ui:title': null,
						'ui:widget': 'Badge',
					},
					description: {
						'ui:title': null,
					},
				},
			},
			fields: {
				data: {
					'ui:order': ['namespace', 'description'],
					namespace: {
						'ui:title': null,
						'ui:widget': 'Badge',
					},
					description: {
						'ui:title': null,
					},
				},
			},
		},
		indexed_fields: [['name']],
	},
};
