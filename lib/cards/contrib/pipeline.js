/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

module.exports = {
	slug: 'pipeline',
	name: 'Pipeline',
	type: 'type@1.0.0',
	markers: [],
	data: {
		schema: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					pattern: '^.*\\S.*$',
					fullTextSearch: true
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
}
