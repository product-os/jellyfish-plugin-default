import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewActive: ViewContractDefinition = {
	slug: 'view-active',
	name: 'Active contracts',
	type: 'view@1.0.0',
	markers: [],
	data: {
		allOf: [
			{
				name: 'Active contracts',
				schema: {
					type: 'object',
					properties: {
						active: {
							type: 'boolean',
							const: true,
						},
						type: {
							not: {
								const: 'session@1.0.0',
							},
						},
					},
					required: ['active'],
					additionalProperties: true,
				},
			},
		],
	},
};
