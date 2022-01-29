import { cardMixins } from '@balena/jellyfish-core';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const getFormUiSchema = () => ({
	data: {
		unnecessary_attendees: {
			items: {
				'ui:widget': 'AutoCompleteWidget',
				'ui:options': {
					resource: 'user',
					keyPath: 'slug',
				},
			},
		},
		extra_attendees_needed: {
			items: {
				user: {
					'ui:widget': 'AutoCompleteWidget',
					'ui:options': {
						resource: 'user',
						keyPath: 'slug',
					},
				},
			},
		},
	},
});

export const checkin: ContractDefinition = {
	slug: 'checkin',
	name: 'Checkin',
	type: 'type@1.0.0',
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
				tags: {
					type: 'array',
					items: {
						type: 'string',
					},
					$$formula: "AGGREGATE($events, 'tags')",
				},
				data: {
					type: 'object',
					properties: {
						datetime: {
							title: 'Check-in date/time',
							type: 'string',
							format: 'date-time',
						},
						is_review: {
							title: 'Review?',
							type: 'boolean',
						},
						interval_to_next: {
							title: 'Time until next checkin',
							type: 'number',
							oneOf: [
								{
									title: '1 day',
									const: 86400,
								},
								{
									title: '0.5 week',
									const: 345600,
								},
								{
									title: '1 week',
									const: 604800,
								},
								{
									title: '2 weeks',
									const: 1209600,
								},
								{
									title: '1 month',
									const: 2419200,
								},
								{
									title: '3 months',
									const: 7257600,
								},
							],
						},
						length_of_next: {
							title: 'Length of next checkin',
							type: 'number',
							oneOf: [
								{
									title: '10 minutes',
									const: 600,
								},
								{
									title: '30 minutes',
									const: 1800,
								},
								{
									title: '50 minutes',
									const: 3000,
								},
							],
						},
						minutes: {
							type: 'string',
							format: 'markdown',
						},
						extra_attendees_needed: {
							title: 'Extra attendees needed',
							type: 'array',
							items: {
								type: 'object',
								properties: {
									user: {
										type: 'string',
									},
									role: {
										type: 'string',
										enum: [
											'owner',
											'guide',
											'dedicated',
											'contributor',
											'observer',
										],
									},
								},
							},
						},
						unnecessary_attendees: {
							title: 'Unnecessary attendees',
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
				},
			},
			required: ['data'],
		},
		uiSchema: {
			fields: {
				data: {
					'ui:order': ['minutes', 'datetime', '*'],
					datetime: cardMixins.uiSchemaDef('dateTime'),
					unnecessary_attendees: {
						items: {
							'ui:widget': 'Link',
							'ui:options': {
								href: 'https://jel.ly.fish/user-${source}',
							},
						},
					},
					extra_attendees_needed: {
						items: {
							'ui:options': {
								flexDirection: 'row',
								alignItems: 'center',
							},
							'ui:order': ['role', 'user'],
							role: {
								'ui:title': null,
								'ui:widget': 'Badge',
								'ui:options': {
									mr: 2,
								},
							},
							user: {
								'ui:title': null,
								'ui:widget': 'Link',
								'ui:options': {
									href: 'https://jel.ly.fish/user-${source}',
								},
							},
						},
					},
				},
			},
			edit: getFormUiSchema(),
			create: getFormUiSchema(),
		},
	},
};
