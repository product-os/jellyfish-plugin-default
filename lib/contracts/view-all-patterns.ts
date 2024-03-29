import type { ViewContractDefinition } from 'autumndb';

export const viewAllPatterns: ViewContractDefinition = {
	slug: 'view-all-patterns',
	name: 'Patterns',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	data: {
		allOf: [
			{
				name: 'All patterns',
				schema: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							const: 'pattern@1.0.0',
						},
					},
					additionalProperties: true,
					required: ['type'],
				},
			},
		],
	},
};
