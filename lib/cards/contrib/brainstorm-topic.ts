import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const statusOptions = ['open', 'ongoing', 'closed', 'archived'];

export function brainstormTopic({
	mixin,
	uiSchemaDef,
	withEvents,
	asPipelineItem,
}: Mixins): ContractDefinition {
	return mixin(
		withEvents,
		asPipelineItem(statusOptions),
	)({
		slug: 'brainstorm-topic',
		name: 'Brainstorm Topic',
		type: 'type@1.0.0',
		markers: [],
		data: {
			schema: {
				type: 'object',
				required: ['name', 'data'],
				properties: {
					name: {
						type: 'string',
						fullTextSearch: true,
					},
					data: {
						type: 'object',
						required: ['category', 'description'],
						properties: {
							reporter: {
								type: 'string',
								pattern: '^[a-z0-9-]+$',
								fullTextSearch: true,
							},
							category: {
								type: 'string',
								fullTextSearch: true,
							},
							description: {
								type: 'string',
								format: 'markdown',
								fullTextSearch: true,
							},
							flowdockThreadUrl: {
								type: 'string',
								format: 'uri',
								title: 'Flowdock Thread URL',
							},
						},
					},
				},
			},
			uiSchema: {
				snippet: {
					data: {
						'ui:order': ['reporter', 'mentionsUser', 'status', 'category'],
						reporter: {
							$ref: uiSchemaDef('username'),
							'ui:options': {
								flexDirection: 'row',
							},
						},
						mentionsUser: {
							$ref: uiSchemaDef('usernameList'),
							'ui:options': {
								flexDirection: 'row',
							},
						},
						status: {
							'ui:title': null,
							'ui:widget': 'Badge',
						},
						category: {
							'ui:title': null,
							'ui:widget': 'HighlightedName',
						},
					},
				},
				fields: {
					data: {
						'ui:order': [
							'reporter',
							'mentionsUser',
							'status',
							'category',
							'description',
							'flowdockThreadUrl',
						],
						category: {
							'ui:widget': 'HighlightedName',
						},
						reporter: {
							$ref: uiSchemaDef('username'),
						},
						flowdockThreadUrl: {
							'ui:options': {
								blank: true,
							},
						},
					},
				},
				edit: {
					$ref: '#/data/uiSchema/definitions/form',
				},
				create: {
					$ref: '#/data/uiSchema/edit',
				},
				definitions: {
					form: {
						data: {
							category: {
								'ui:widget': 'AutoCompleteWidget',
								'ui:options': {
									resource: 'brainstorm-topic',
									keyPath: 'data.category',
								},
							},
							reporter: {
								'ui:widget': 'AutoCompleteWidget',
								'ui:options': {
									resource: 'user',
									keyPath: 'slug',
								},
							},
						},
					},
				},
			},
		},
	});
}
