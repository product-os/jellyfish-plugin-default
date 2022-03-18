import type { ContractDefinition } from '@balena/jellyfish-types/build/core';
import { contractMixins } from 'autumndb';

const slug = 'sales-thread';
const type = 'type@1.0.0';

export const salesThread: ContractDefinition = contractMixins.mixin(
	contractMixins.asPipelineItem(slug, type),
)({
	slug,
	name: 'Sales Thread',
	type,
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
					fullTextSearch: true,
				},
				data: {
					type: 'object',
					properties: {
						tags: {
							type: 'array',
							items: {
								type: 'string',
							},
							fullTextSearch: true,
						},
						mirrors: {
							type: 'array',
							items: {
								type: 'string',
							},
							fullTextSearch: true,
						},
						inbox: {
							type: 'string',
							fullTextSearch: true,
						},
						statusDescription: {
							title: 'Current Status',
							type: 'string',
							fullTextSearch: true,
						},
					},
				},
			},
			required: ['data'],
		},
		uiSchema: {
			fields: {
				data: {
					'ui:order': [
						'tags',
						'mirrors',
						'inbox',
						'statusDescription',
						'status',
					],
					inbox: {
						'ui:widget': 'HighlightedName',
					},
					tags: contractMixins.uiSchemaDef('badgeList'),
					mirrors: contractMixins.uiSchemaDef('mirrors'),
					status: {
						'ui:widget': 'Badge',
					},
					environment: {
						'ui:widget': 'Badge',
					},
				},
			},
		},
		indexed_fields: [['data.mirrors']],
	},
});
