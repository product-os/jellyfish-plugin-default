/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

module.exports = ({
	mixin, withEvents, asPipelineItem
}) => {
	return mixin(withEvents, asPipelineItem())({
		slug: 'milestone',
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
