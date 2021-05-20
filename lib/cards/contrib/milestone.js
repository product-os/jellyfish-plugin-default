/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const SLUG = 'milestone'

module.exports = ({
	mixin, withEvents, withRelationships, asPipelineItem
}) => {
	return mixin(withEvents, withRelationships(SLUG), asPipelineItem())({
		slug: SLUG,
		name: 'Milestone',
		type: 'type@1.0.0',
		markers: [],
		data: {
			schema: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						fullTextSearch: true
					}
				},
				required: [ 'name' ]
			},
			uiSchema: {
				snippet: {
					data: {
						status: {
							'ui:title': null,
							'ui:widget': 'Badge'
						}
					}
				}
			}
		}
	})
}
