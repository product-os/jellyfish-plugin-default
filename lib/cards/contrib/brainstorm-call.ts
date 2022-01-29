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
				required: ['name', 'loop', 'data'],
				properties: {
					name: {
						type: 'string',
						fullTextSearch: true,
					},
					loop: {
						type: 'string',
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
							...uiSchemaDef('dateTime'),
							'ui:title': null,
						},
					},
				},
				fields: {
					data: {
						datetime: uiSchemaDef('dateTime'),
					},
				},
			},
			required: ['name', 'data'],
		},
	});
}
