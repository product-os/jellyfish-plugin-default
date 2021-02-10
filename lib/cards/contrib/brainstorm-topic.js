/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

/* eslint-disable no-template-curly-in-string */

const SLUG = 'brainstorm-topic'

const statusOptions = [
	'open',
	'ongoing',
	'closed',
	'archived'
]

module.exports = ({
	mixin, uiSchemaDef, withEvents, withRelationships, asPipelineItem
}) => {
	return mixin(withEvents, withRelationships(SLUG), asPipelineItem(statusOptions))({
		slug: SLUG,
		name: 'Brainstorm Topic',
		type: 'type@1.0.0',
		markers: [],
		data: {
			schema: {
				type: 'object',
				required: [
					'name',
					'data'
				],
				properties: {
					name: {
						type: 'string',
						fullTextSearch: true
					},
					data: {
						type: 'object',
						required: [ 'reporter', 'category', 'description' ],
						properties: {
							reporter: {
								type: 'string',
								pattern: '^[a-z0-9-]+$',
								fullTextSearch: true
							},
							category: {
								type: 'string',
								fullTextSearch: true
							},
							description: {
								type: 'string',
								format: 'markdown',
								fullTextSearch: true
							},
							flowdockThreadUrl: {
								type: 'string',
								format: 'uri',
								title: 'Flowdock Thread URL'
							}
						}
					}
				}
			},
			uiSchema: {
				snippet: {
					data: {
						'ui:order': [
							'reporter',
							'mentionsUser',
							'status',
							'category'
						],
						reporter: {
							'ui:widget': 'Link',
							'ui:value': '${source[5:]},',
							'ui:options': {
								href: 'https://jel.ly.fish/${source}',
								flexDirection: 'row'
							}
						},
						mentionsUser: {
							$ref: uiSchemaDef('usernameList'),
							'ui:options': {
								flexDirection: 'row'
							}
						},
						status: {
							'ui:title': null,
							'ui:widget': 'Badge'
						},
						category: {
							'ui:title': null,
							'ui:widget': 'HighlightedName'
						}
					}
				},
				fields: {
					data: {
						'ui:order': [
							'reporter',
							'mentionsUser',
							'status',
							'category',
							'description',
							'flowdockThreadUrl'
						],
						category: {
							'ui:widget': 'HighlightedName'
						},
						reporter: {
							'ui:widget': 'Link',
							'ui:value': '${source[5:]},',
							'ui:options': {
								href: 'https://jel.ly.fish/${source}'
							}
						},
						flowdockThreadUrl: {
							'ui:options': {
								blank: true
							}
						}
					}
				},
				edit: {
					$ref: '#/data/uiSchema/definitions/form'
				},
				create: {
					$ref: '#/data/uiSchema/edit'
				},
				definitions: {
					form: {
						data: {
							category: {
								'ui:widget': 'AutoCompleteWidget',
								'ui:options': {
									resource: 'brainstorm-topic',
									keyPath: 'data.category'
								}
							},
							reporter: {
								'ui:widget': 'AutoCompleteWidget',
								'ui:options': {
									resource: 'user',
									keyPath: 'slug'
								}
							}
						}
					}
				}
			}
		}
	})
}
