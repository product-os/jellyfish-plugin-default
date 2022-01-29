import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export function saga({
	mixin,
	withEvents,
	asPipelineItem,
}: Mixins): ContractDefinition {
	return mixin(
		withEvents,
		asPipelineItem(),
	)({
		slug: 'saga',
		name: 'Saga',
		type: 'type@1.0.0',
		data: {
			schema: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						pattern: '^.*\\S.*$',
						fullTextSearch: true,
					},
					loop: {
						type: 'string',
					},
					data: {
						type: 'object',
						properties: {
							description: {
								type: 'string',
								format: 'markdown',
							},
						},
						required: ['description'],
					},
				},
				required: ['name', 'loop', 'data'],
			},
			uiSchema: {
				fields: {
					data: {
						'ui:order': ['status', 'description'],
					},
				},
			},
		},
	});
}
