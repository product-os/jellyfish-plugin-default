import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export function supportThread({
	mixin,
	withEvents,
	uiSchemaDef,
	asPipelineItem,
}: Mixins): ContractDefinition {
	return mixin(
		withEvents,
		asPipelineItem(),
	)({
		slug: 'support-thread',
		name: 'Support Thread',
		type: 'type@1.0.0',
		data: {
			schema: {
				type: 'object',
				properties: {
					name: {
						type: ['string', 'null'],
						fullTextSearch: true,
					},
					data: {
						type: 'object',
						properties: {
							category: {
								type: 'string',
								default: 'general',
								enum: [
									'general',
									'customer-success',
									'devices',
									'fleetops',
									'security',
								],
								fullTextSearch: true,
							},
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
							environment: {
								type: 'string',
								enum: ['production'],
								fullTextSearch: true,
							},
							description: {
								type: 'string',
								format: 'markdown',
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
							product: {
								title: 'Product',
								type: 'string',
							},
							lastMessage: {
								type: 'object',
								$$formula: `
									PROPERTY(contract, [ "links", "has attached element", "length" ])
									? LAST(
											ORDER_BY(
												FILTER(
													contract.links["has attached element"],
													function (c) { return c && (c.type === "message@1.0.0"); }
												),
												"data.timestamp"
											)
										)
									: null
								`,
							},
						},
					},
				},
				required: ['data'],
			},
			uiSchema: {
				fields: {
					data: {
						tags: {
							$ref: uiSchemaDef('badgeList'),
						},
						mirrors: {
							$ref: uiSchemaDef('mirrors'),
						},
						statusDescription: null,
						category: null,
						status: null,
						inbox: null,
						origin: null,
						environment: null,
						lastMessage: null,
					},
				},
			},
			indexed_fields: [
				['data.status', 'data.category', 'data.product'],
				['data.lastMessage.data.timestamp'],
				['data.mirrors'],
			],
		},
	});
}
