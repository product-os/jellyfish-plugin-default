import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export function message({ uiSchemaDef }: Mixins): ContractDefinition {
	return {
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
						actor: uiSchemaDef('idOrSlugLink'),
						target: uiSchemaDef('idOrSlugLink'),
						mirrors: uiSchemaDef('mirrors'),
						timestamp: uiSchemaDef('dateTime'),
						edited_at: uiSchemaDef('dateTime'),
						readBy: uiSchemaDef('usernameList'),
						payload: {
							'ui:title': null,
							mentionsUser: uiSchemaDef('usernameList'),
							alertsUser: uiSchemaDef('usernameList'),
							mentionsGroup: uiSchemaDef('groupList'),
							alertsGroup: uiSchemaDef('groupList'),
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
}
