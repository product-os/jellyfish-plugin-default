import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewAllBrainstormTopics: ViewContractDefinition = {
	slug: 'view-all-brainstorm-topics',
	name: 'Topics',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	data: {
		namespace: 'Brainstorms',
		allOf: [
			{
				name: 'Active contracts',
				schema: {
					type: 'object',
					properties: {
						active: {
							const: true,
							type: 'boolean',
						},
						type: {
							type: 'string',
							const: 'brainstorm-topic@1.0.0',
						},
					},
					required: ['active', 'type'],
					additionalProperties: true,
				},
			},
		],
	},
};
