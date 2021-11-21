import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

const statusOptions = ['draft', 'candidate', 'complete'];

const statusNames = ['Draft', 'Candidate', 'Complete'];

export function workflow({
	mixin,
	withEvents,
	asPipelineItem,
}: Mixins): ContractDefinition {
	return mixin(
		withEvents,
		asPipelineItem(statusOptions, statusOptions[0], statusNames),
	)({
		slug: 'workflow',
		type: 'type@1.0.0',
		name: 'Workflow',
		data: {
			schema: {
				type: 'object',
				properties: {
					name: {
						type: ['string', 'null'],
						fullTextSearch: true,
					},
					data: {
						type: 'object',
						properties: {
							lifecycle: {
								type: 'string',
							},
							description: {
								type: 'string',
								format: 'markdown',
							},
							diagram: {
								type: 'string',
								format: 'mermaid',
							},
						},
					},
				},
			},
			uiSchema: {
				fields: {
					'ui:options': {
						alignSelf: 'stretch',
					},
					data: {
						diagram: {
							'ui:options': {
								alignSelf: 'stretch',
							},
						},
					},
				},
				edit: {
					$ref: '#/data/uiSchema/definitions/form',
				},
				create: {
					$ref: '#/data/uiSchema/edit',
				},
				definitions: {
					form: {
						data: {
							lifecycle: {
								'ui:widget': 'AutoCompleteWidget',
								'ui:options': {
									resource: 'workflow',
									keyPath: 'data.lifecycle',
								},
							},
						},
					},
				},
			},
		},
	});
}
