import { cardMixins } from '@balena/jellyfish-core';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const slug = 'support-thread';
const type = 'type@1.0.0';

export const supportThread: ContractDefinition = cardMixins.mixin(
	cardMixins.withEvents(slug, type),
	cardMixins.asPipelineItem(slug, type),
)({
	slug,
	name: 'Support Thread',
	type,
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
					tags: cardMixins.uiSchemaDef('badgeList'),
					mirrors: cardMixins.uiSchemaDef('mirrors'),
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
