/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

module.exports = ({
	mixin, withEvents
}) => {
	return mixin(
		withEvents
	)({
		slug: 'brainstorm-call',
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
						type: 'object'
					}
				}
			},
			required: [ 'name', 'data' ],
			meta: {
				relationships: [
					{
						title: 'Topics',
						link: 'has attached',
						type: 'brainstorm-topic'
					}
				]
			}
		}
	})
}
