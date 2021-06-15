/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const fs = require('fs')
const path = require('path')
const DEFAULT_CONTENT = fs.readFileSync(path.join(__dirname, 'improvement-default.md'), 'utf-8')

const statusOptions = [
	'proposed',
	'waiting',
	'researching',
	'candidate-spec',
	'assigned-resources',
	'implementation',
	'all-milestones-completed',
	'finalising-and-testing',
	'merged',
	'released',
	'denied-or-failed'
]

const statusNames = [
	'Proposed',
	'Waiting',
	'Researching (Drafting Spec)',
	'Candidate spec',
	'Assigned resources',
	'Implementation',
	'All milestones completed',
	'Finalising and testing',
	'Merged',
	'Released',
	'Denied or Failed'
]

module.exports = ({
	mixin, withEvents, asPipelineItem
}) => {
	return mixin(
		withEvents,
		asPipelineItem(statusOptions, statusOptions[0], statusNames)
	)({
		slug: 'improvement',
		name: 'Improvement',
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
							},
							specification: {
								type: 'string',
								format: 'markdown',
								default: DEFAULT_CONTENT
							}
						}
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
						'ui:order': [ 'status', 'specification', 'description' ]
					}
				}
			}
		}
	})
}
