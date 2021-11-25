import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const statusOptions = [
	'implementation',
	'all-milestones-complete',
	'finalising-and-testing',
	'merged',
	'released',
	'denied-or-failed',
];

const statusNames = [
	'Implementation',
	'All milestones completed',
	'Finalising and testing',
	'Merged',
	'Released',
	'Denied or Failed',
];

export function project({
	mixin,
	withEvents,
	asPipelineItem,
}: Mixins): ContractDefinition {
	return mixin(
		withEvents,
		asPipelineItem(statusOptions, statusOptions[0], statusNames),
	)({
		slug: 'project',
		name: 'Project',
		type: 'type@1.0.0',
		data: {
			schema: {
				type: 'object',
				required: ['name'],
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
							},
						},
					},
				},
			},
		},
	});
}