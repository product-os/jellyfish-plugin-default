import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export function salesThread({
	mixin,
	uiSchemaDef,
	asPipelineItem,
}: Mixins): ContractDefinition {
	return mixin(asPipelineItem())({
		slug: 'sales-thread',
		name: 'Sales Thread',
		type: 'type@1.0.0',
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
						tags: uiSchemaDef('badgeList'),
						mirrors: uiSchemaDef('mirrors'),
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
}
