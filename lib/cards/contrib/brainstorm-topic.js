/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const SLUG = 'brainstorm-topic'

const statusOptions = [
	'open',
	'ongoing',
	'closed',
	'archived'
]

module.exports = ({
	mixin, withEvents, withRelationships, asPipelineItem
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
						properties: {
							category: {
								type: 'string',
								fullTextSearch: true
							},
							description: {
								type: 'string',
								format: 'markdown',
								fullTextSearch: true
							}
						}
					}
				}
			},
			uiSchema: {
				snippet: {
					data: {
						'ui:order': [
							'status',
							'category'
						],
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
						category: {
							'ui:widget': 'HighlightedName'
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
							}
						}
					}
				}
			}
		}
	})
}
