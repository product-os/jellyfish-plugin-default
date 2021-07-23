/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const statusOptions = [
	'open',
	'brainstorming',
	'improvement-in-progress',
	'partially-resolved',
	'resolved-pending-review',

	// A pattern is resolved when the problem it describes has been verified as fixed
	'closed-resolved',

	// A pattern may be closed without resolution if it is no longer deemed relevant
	// or, for whatever reason, cannot or will not be resolved.
	'closed-unresolved',
];

const statusNames = [
	'Open',
	'Brainstorming',
	'Improvement in progress',
	'Partially resolved',
	'Resolved (pending review)',
	'Closed (resolved)',
	'Closed (unresolved)',
];

export function pattern({
	mixin,
	withEvents,
	asPipelineItem,
}: Mixins): ContractDefinition {
	return mixin(
		withEvents,
		asPipelineItem(statusOptions, statusOptions[0], statusNames),
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
						fullTextSearch: true,
					},
					data: {
						type: 'object',
						properties: {
							description: {
								type: 'string',
								format: 'markdown',
								fullTextSearch: true,
							},
							improvementsPercentComplete: {
								title: 'Improvements progress',
								default: 0,
								type: 'number',
								readOnly: true,
								// eslint-disable-next-line max-len
								$$formula:
									'this.links["has attached"] && this.links["has attached"].length ? (FILTER(this.links["has attached"], { type: "improvement@1.0.0", data: { status: "completed" } }).length / REJECT(FILTER(this.links["has attached"], { type: "improvement@1.0.0" }), { data: { status: "denied-or-failed" } }).length) * 100 : 0',
							},
						},
					},
				},
				required: ['name'],
			},
			uiSchema: {
				fields: {
					data: {
						improvementsPercentComplete: {
							'ui:widget': 'ProgressBar',
							'ui:options': {
								success: true,
								alignSelf: 'stretch',
								alignItems: 'stretch',
							},
						},
					},
				},
			},
		},
	});
}
