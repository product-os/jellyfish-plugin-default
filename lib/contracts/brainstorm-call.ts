import { cardMixins } from '@balena/jellyfish-core';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const brainstormCall: ContractDefinition = {
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
					},
					required: ['datetime'],
				},
			},
		},
		uiSchema: {
			snippet: {
				data: {
					datetime: {
						...cardMixins.uiSchemaDef('dateTime'),
						'ui:title': null,
					},
				},
			},
			fields: {
				data: {
					datetime: cardMixins.uiSchemaDef('dateTime'),
				},
			},
		},
		required: ['name', 'data'],
	},
};
