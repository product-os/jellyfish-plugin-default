import { cardMixins } from '@balena/jellyfish-core';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const slug = 'milestone';
const type = 'type@1.0.0';
const statusOptions = ['open', 'in-progress', 'denied-or-failed', 'completed'];
const statusNames = ['Open', 'In progress', 'Denied or Failed', 'Completed'];

export const milestone: ContractDefinition = cardMixins.mixin(
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
	name: 'Milestone',
	type,
	markers: [],
	data: {
		schema: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
					fullTextSearch: true,
				},
			},
			required: ['name'],
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
