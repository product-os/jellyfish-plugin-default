import { cardMixins } from '@balena/jellyfish-core';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const getFormUiSchema = () => ({
	data: {
		payload: {
			score: {
				'ui:widget': 'Rating',
			},
		},
	},
});

export const rating: ContractDefinition = {
	slug: 'rating',
	type: 'type@1.0.0',
	name: 'Rating',
	markers: [],
	data: {
		schema: {
			type: 'object',
			required: ['version', 'data'],
			properties: {
				version: {
					title: 'Version',
					type: 'string',
					const: '1.0.0',
				},
				data: {
					type: 'object',
					properties: {
						timestamp: {
							title: 'Timestamp',
							type: 'string',
							format: 'date-time',
							fullTextSearch: true,
						},
						actor: {
							title: 'Actor',
							type: 'string',
							format: 'uuid',
						},
						payload: {
							type: 'object',
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
								message: {
									title: 'Message',
									type: 'string',
									$$formula:
										// eslint-disable-next-line max-len
										'(contract.data.payload.score ? "Review score: " + contract.data.payload.score + "/5" : "") +' +
										// eslint-disable-next-line max-len
										'(contract.data.payload.comment ? "\\n\\nReview comment:\\n" + contract.data.payload.comment : "")',
									readOnly: true,
								},
								comment: {
									title: 'Comment',
									type: 'string',
									format: 'markdown',
									fullTextSearch: true,
								},
								score: {
									title: 'Score',
									type: 'number',
								},
							},
						},
						edited_at: {
							title: 'Edited at',
							type: 'string',
							format: 'date-time',
						},
						readBy: {
							title: 'Users that have seen this rating',
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
						comment: {
							'ui:widget': 'textarea',
							'ui:options': {
								rows: 2,
							},
						},
					},
				},
			},
			edit: getFormUiSchema(),
			create: getFormUiSchema(),
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
