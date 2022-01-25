import { cardMixins } from '@balena/jellyfish-core';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const message: ContractDefinition = {
	slug: 'message',
	type: 'type@1.0.0',
	name: 'Chat message',
	markers: [],
	data: {
		schema: {
			type: 'object',
			required: ['version', 'data'],
			properties: {
				version: {
					type: 'string',
					const: '1.0.0',
				},
				data: {
					type: 'object',
					properties: {
						timestamp: {
							type: 'string',
							format: 'date-time',
							fullTextSearch: true,
						},
						actor: {
							type: 'string',
							format: 'uuid',
						},
						payload: {
							type: 'object',
							required: ['message'],
							properties: {
								mentionsUser: {
									type: 'array',
									items: {
										type: 'string',
									},
								},
								alertsUser: {
									type: 'array',
									items: {
										type: 'string',
									},
								},
								mentionsGroup: {
									type: 'array',
									items: {
										type: 'string',
									},
								},
								alertsGroup: {
									type: 'array',
									items: {
										type: 'string',
									},
								},
								file: {
									type: 'object',
									properties: {
										name: {
											type: 'string',
											fullTextSearch: true,
										},
										mime: {
											type: 'string',
										},
										bytesize: {
											type: 'number',
										},
										slug: {
											type: 'string',
										},
									},
								},
								attachments: {
									type: 'array',
									items: {
										type: 'object',
										required: ['url', 'name', 'mime', 'bytesize'],
										properties: {
											url: {
												type: 'string',
											},
											name: {
												type: 'string',
											},
											mime: {
												type: 'string',
											},
											bytesize: {
												type: 'number',
											},
										},
									},
								},
								message: {
									type: 'string',
									format: 'markdown',
									fullTextSearch: true,
								},
							},
						},
						edited_at: {
							type: 'string',
							format: 'date-time',
						},
						readBy: {
							description: 'Users that have seen this message',
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
					required: ['timestamp', 'actor', 'payload'],
				},
			},
		},
		uiSchema: {
			fields: {
				data: {
					actor: cardMixins.uiSchemaDef('idOrSlugLink'),
					target: cardMixins.uiSchemaDef('idOrSlugLink'),
					mirrors: cardMixins.uiSchemaDef('mirrors'),
					timestamp: cardMixins.uiSchemaDef('dateTime'),
					edited_at: cardMixins.uiSchemaDef('dateTime'),
					readBy: cardMixins.uiSchemaDef('usernameList'),
					payload: {
						'ui:title': null,
						mentionsUser: cardMixins.uiSchemaDef('usernameList'),
						alertsUser: cardMixins.uiSchemaDef('usernameList'),
						mentionsGroup: cardMixins.uiSchemaDef('groupList'),
						alertsGroup: cardMixins.uiSchemaDef('groupList'),
						attachments: {
							items: {
								url: {
									'ui:widget': 'Link',
								},
							},
						},
					},
				},
			},
		},
		indexed_fields: [
			['data.readBy'],
			['data.payload.mentionsUser'],
			['data.payload.alertsUser'],
			['data.payload.mentionsGroup'],
			['data.payload.alertsGroup'],
			['data.actor'],
		],
	},
};
