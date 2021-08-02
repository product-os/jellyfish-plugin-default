/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const statusOptions = ['open', 'in-progress', 'denied-or-failed', 'completed'];

const statusNames = ['Open', 'In progress', 'Denied or Failed', 'Completed'];

export function milestone({
	mixin,
	withEvents,
	asPipelineItem,
}: Mixins): ContractDefinition {
	return mixin(
		withEvents,
		asPipelineItem(statusOptions, statusOptions[0], statusNames),
	)({
		slug: 'milestone',
		name: 'Milestone',
		type: 'type@1.0.0',
		markers: [],
		data: {
			schema: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
						fullTextSearch: true,
					},
					loop: {
						type: 'string',
					},
				},
				required: ['name', 'loop'],
			},
			uiSchema: {
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
