import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_CONTENT = fs.readFileSync(
	path.join(__dirname, 'improvement-default.md'),
	'utf-8',
);

const statusOptions = [
	'proposed',
	'researching',
	'awaiting-approval',
	'ready-to-implement',
	'implementation',
	'denied-or-failed',
	'completed',
];

const statusNames = [
	'Proposed',
	'Researching (Drafting Spec)',
	'Awaiting approval',
	'Ready to implement',
	'Implementation',
	'Denied or Failed',
	'Completed',
];

export function improvement({
	mixin,
	withEvents,
	asPipelineItem,
}: Mixins): ContractDefinition {
	return mixin(
		withEvents,
		asPipelineItem(statusOptions, statusOptions[0], statusNames),
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
						fullTextSearch: true,
					},
					data: {
						type: 'object',
						properties: {
							description: {
								type: 'string',
								format: 'markdown',
								title: 'TLDR',
							},
							specification: {
								type: 'string',
								format: 'markdown',
								default: DEFAULT_CONTENT,
							},
							milestonesPercentComplete: {
								title: 'Milestones progress',
								default: 0,
								type: 'number',
								readOnly: true,
								// eslint-disable-next-line max-len
								$$formula:
									'contract.links["has attached"] && contract.links["has attached"].length ? (FILTER(contract.links["has attached"], { type: "milestone@1.0.0", data: { status: "completed" } }).length / REJECT(FILTER(contract.links["has attached"], { type: "milestone@1.0.0" }), { data: { status: "denied-or-failed" } }).length) * 100 : 0',
							},
						},
					},
				},
				required: ['name', 'data'],
			},
			uiSchema: {
				fields: {
					data: {
						'ui:order': [
							'status',
							'milestonesPercentComplete',
							'description',
							'specification',
						],
						milestonesPercentComplete: {
							'ui:widget': 'ProgressBar',
							'ui:options': {
								success: true,
								alignSelf: 'stretch',
								alignItems: 'stretch',
							},
						},
					},
				},
				snippet: {
					data: {
						status: {
							'ui:title': null,
							'ui:widget': 'Badge',
						},
					},
				},
			},
		},
	});
}
