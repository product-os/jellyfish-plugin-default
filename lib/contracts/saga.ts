import { cardMixins } from 'autumndb';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const slug = 'saga';
const type = 'type@1.0.0';

export const saga: ContractDefinition = cardMixins.mixin(
	cardMixins.withEvents(slug, type),
	cardMixins.asPipelineItem(slug, type),
)({
	slug,
	name: 'Saga',
	type,
	data: {
		schema: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					pattern: '^.*\\S.*$',
					fullTextSearch: true,
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
			required: ['name', 'data'],
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
