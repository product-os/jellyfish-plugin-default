/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const statusOptions = [
	'open',
	'brainstorming',
	'improvement-in-progress',
	'partially-resolved',
	'resolved-pending-review',
	'closed-resolved',
	'closed-unresolved',

	// TODO: remove after migrating to closed-resolved/closed-unresolved
	'closed',

	// TODO: remove after migrating to closed-resolved/closed-unresolved
	'archived'
]

const statusNames = [
	'Open',
	'Brainstorming',
	'Improvement in progress',
	'Partially resolved',
	'Resolved - pending review',
	'Closed - resolved',
	'Closed - unresolved',

	// TODO: remove these names when their corresponding statuses are removed
	'Closed (deprecated)',
	'Archived (deprecated)'
]

module.exports = ({
	mixin, withEvents, asPipelineItem
}) => {
	return mixin(
		withEvents,
		asPipelineItem(statusOptions, statusOptions[0], statusNames)
	)({
		slug: 'pattern',
		name: 'Pattern',
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
								type: 'string',
								format: 'markdown',
								fullTextSearch: true
							}
						}
					}
				},
				required: [
					'name'
				]
			}
		}
	})
}
