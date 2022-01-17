import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export function whisper({ uiSchemaDef }: Mixins): ContractDefinition {
	return {
		slug: 'whisper',
		type: 'type@1.0.0',
		name: 'Whisper message',
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
							target: {
								type: 'string',
								format: 'uuid',
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
						required: ['timestamp', 'target', 'actor', 'payload'],
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
