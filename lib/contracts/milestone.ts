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
				data: {
					type: 'object',
					properties: {
						status: {
							title: 'Status',
							type: 'string',
							default: 'open',
							enum: statusOptions,
							enumNames: statusNames,
							readOnly: true,
							$$formula: `
                                contract.data.percentComplete === 100 ? 
                                    "completed" : 
                                    contract.data.percentComplete === 0 ? 
                                        "open" : 
                                        "in-progress"
                            `,
						},
						percentComplete: {
							title: 'Progress',
							default: 0,
							type: 'number',
							readOnly: true,
							// eslint-disable-next-line max-len
							$$formula: `
								contract.links["is attached to"] && contract.links["is attached to"].length ? (
									FILTER(contract.links["is attached to"], { type: "issue@1.0.0", data: { status: "closed" } }).length / 
									FILTER(contract.links["is attached to"], { type: "issue@1.0.0" }).length
								) * 100 : 0
							`,
						},
						description: {
							type: 'string',
							format: 'markdown',
							title: 'Description',
						},
					},
				},
			},
			required: ['name'],
		},
		uiSchema: {
			fields: {
				data: {
					'ui:order': ['status', 'percentComplete', 'description'],
					percentComplete: {
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
					'ui:order': ['status', 'percentComplete'],
					status: {
						'ui:title': null,
						'ui:widget': 'Badge',
					},
					percentComplete: {
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