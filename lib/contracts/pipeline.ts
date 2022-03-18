import type { ContractDefinition } from '@balena/jellyfish-types/build/core';
import { contractMixins } from 'autumndb';

const slug = 'pipeline';
const type = 'type@1.0.0';

export const pipeline: ContractDefinition = contractMixins.mixin(
	contractMixins.withEvents(slug, type),
)({
	slug,
	name: 'Pipeline',
	type,
	markers: [],
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
						linkToTrelloBoard: {
							type: 'string',
							format: 'markdown',
						},
					},
				},
			},
		},
		uiSchema: {
			fields: {
				data: {
					linkToTrelloBoard: {
						'ui:widget': 'Link',
					},
				},
			},
		},
	},
});
