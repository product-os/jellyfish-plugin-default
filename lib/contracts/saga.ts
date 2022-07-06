import { contractMixins } from '@balena/jellyfish-worker';
import type { ContractDefinition } from 'autumndb';

const slug = 'saga';
const type = 'type@1.0.0';

export const saga: ContractDefinition = contractMixins.mixin(
	contractMixins.withEvents(slug, type),
	contractMixins.asPipelineItem(slug, type),
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
