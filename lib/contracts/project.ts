import { cardMixins } from 'autumndb';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const slug = 'project';
const type = 'type@1.0.0';

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

export const project: ContractDefinition = cardMixins.mixin(
	cardMixins.withEvents(slug, type),
	cardMixins.asPipelineItem(
		slug,
		type,
		statusOptions,
		statusOptions[0],
		statusNames,
	),
)({
	slug,
	name: 'Project',
	type,
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
