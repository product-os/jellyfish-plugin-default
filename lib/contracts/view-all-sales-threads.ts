import type { ViewContractDefinition } from 'autumndb';

export const viewAllSalesThreads: ViewContractDefinition = {
	slug: 'view-all-sales-threads',
	name: 'All sales threads',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	data: {
		namespace: 'Sales',
		allOf: [
			{
				name: 'Active cards',
				schema: {
					anyOf: [
						{
							$$links: {
								'is owned by': {
									type: 'object',
									required: ['type'],
									properties: {
										type: {
											const: 'user@1.0.0',
										},
									},
								},
							},
						},
						true,
					],
					$$links: {
						'has attached element': {
							type: 'object',
							properties: {
								type: {
									enum: [
										'message@1.0.0',
										'update@1.0.0',
										'create@1.0.0',
										'whisper@1.0.0',
									],
								},
							},
							additionalProperties: true,
						},
					},
					type: 'object',
					properties: {
						active: {
							const: true,
							type: 'boolean',
						},
						type: {
							type: 'string',
							const: 'sales-thread@1.0.0',
						},
					},
					required: ['active', 'type'],
					additionalProperties: true,
				},
			},
		],
	},
};
