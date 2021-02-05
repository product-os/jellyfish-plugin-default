/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */
const SLUG = 'pipeline'

module.exports = ({
	mixin, withRelationships
}) => {
	return mixin(withRelationships(SLUG))({
		slug: SLUG,
		name: 'Pipeline',
		type: 'type@1.0.0',
		markers: [],
		data: {
			schema: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						pattern: '^.*\\S.*$'
					},
					tags: {
						type: 'array',
						items: {
							type: 'string'
						},
						$$formula: 'AGGREGATE($events, \'tags\')'
					},
					data: {
						type: 'object',
						properties: {
							linkToTrelloBoard: {
								type: 'string',
								format: 'markdown'
							}
						}
					}
				}
			},
			uiSchema: {
				fields: {
					data: {
						linkToTrelloBoard: {
							'ui:widget': 'Link'
						}
					}
				}
			}
		}
	})
}
