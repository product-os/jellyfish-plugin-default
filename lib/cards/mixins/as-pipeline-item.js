/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const defaultStatusOptions = [
	'open',
	'closed',
	'archived'
]

// Defines fields common to all items used in pipelines
module.exports = (statusOptions = defaultStatusOptions) => {
	return {
		data: {
			schema: {
				properties: {
					data: {
						type: 'object',
						properties: {
							status: {
								title: 'Status',
								type: 'string',
								default: 'open',
								enum: statusOptions
							}
						}
					}
				},
				required: [ 'data' ]
			},
			uiSchema: {
				fields: {
					data: {
						status: {
							'ui:widget': 'Badge'
						}
					}
				}
			},
			slices: [
				'properties.data.properties.status'
			],
			indexed_fields: [
				[ 'data.status' ]
			]
		}
	}
}
