import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewAllCustomers: ViewContractDefinition = {
	slug: 'view-all-customers',
	name: 'All accounts',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	data: {
		namespace: 'Sales',
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
							const: 'account@1.0.0',
						},
					},
					required: ['active', 'type'],
					additionalProperties: true,
				},
			},
		],
	},
};
