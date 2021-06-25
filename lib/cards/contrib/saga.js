/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

module.exports = ({
	mixin, withEvents, asPipelineItem
}) => {
	return mixin(
		withEvents,
		asPipelineItem()
	)({
		slug: 'saga',
		name: 'Saga',
		type: 'type@1.0.0',
		data: {
			schema: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						pattern: '^.*\\S.*$',
						fullTextSearch: true
					},
					data: {
						type: 'object',
						properties: {
							description: {
								type: 'string',
								format: 'markdown'
							}
						},
						required: [
							'description'
						]
					}
				},
				required: [
					'name',
					'data'
				]
			},
			uiSchema: {
				fields: {
					data: {
						'ui:order': [ 'status', 'description' ]
					}
				}
			}
		}
	})
}
