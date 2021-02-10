/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const SLUG = 'brainstorm-call'

module.exports = ({
	mixin, uiSchemaDef, withEvents, withRelationships
}) => {
	return mixin(withEvents, withRelationships(SLUG))({
		slug: SLUG,
		name: 'Brainstorm Call',
		type: 'type@1.0.0',
		markers: [],
		data: {
			schema: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						fullTextSearch: true
					},
					data: {
						type: 'object',
						properties: {
							datetime: {
								title: 'Meeting date/time',
								type: 'string',
								format: 'date-time'
							}
						},
						required: [ 'datetime' ]
					}
				}
			},
			uiSchema: {
				snippet: {
					data: {
						datetime: {
							$ref: uiSchemaDef('dateTime'),
							'ui:title': null
						}
					}
				},
				fields: {
					data: {
						datetime: {
							$ref: uiSchemaDef('dateTime')
						}
					}
				}
			},
			required: [ 'name', 'data' ]
		}
	})
}
