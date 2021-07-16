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
	'solution-agreed',
	'partially-resolved',
	'pending-validation',

	// A pattern is resolved when the problem it describes has been verified as fixed
	'closed-resolved',

	// A pattern may be closed without resolution if it is no longer deemed relevant
	// or, for whatever reason, cannot or will not be resolved.
	'closed-unresolved',
];

const statusNames = [
	'Open',
	'Brainstorming',
	'Solution agreed',
	'Partially resolved',
	'Pending validation',
	'Closed - resolved',
	'Closed - unresolved',
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
						},
					},
				},
				required: ['name'],
			},
		},
	});
}
