/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */
const SLUG = 'chart-configuration'

module.exports = ({
	mixin, withRelationships
}) => {
	return mixin(withRelationships(SLUG))({
		slug: SLUG,
		name: 'Chart configuration',
		type: 'type@1.0.0',
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
							description: {
								type: 'string'
							},
							chartingLibrary: {
								title: 'Charting library',
								type: 'string',
								enum: [ 'plotly' ],
								default: 'plotly'
							},
							settings: {
								type: 'string'
							}
						},
						required: [
							'chartingLibrary',
							'settings'
						]
					}
				},
				required: [
					'name',
					'data'
				]
			}
		}
	})
}
