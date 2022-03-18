import type { ContractDefinition } from '@balena/jellyfish-types/build/core';
import { contractMixins as workerContractMixins } from '@balena/jellyfish-worker';
import { contractMixins as autumndbContractMixins } from 'autumndb';

const slug = 'sales-thread';
const type = 'type@1.0.0';

export const salesThread: ContractDefinition = workerContractMixins.mixin(
	workerContractMixins.asPipelineItem(slug, type),
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
					tags: autumndbContractMixins.uiSchemaDef('badgeList'),
					mirrors: autumndbContractMixins.uiSchemaDef('mirrors'),
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
