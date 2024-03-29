import type { ViewContractDefinition } from 'autumndb';

export const viewCustomerSuccessSupportThreads: ViewContractDefinition = {
	slug: 'view-customer-success-support-threads',
	name: 'Customer success',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	loop: 'loop-balena-io@1.0.0',
	data: {
		namespace: 'Support',
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
										'rating@1.0.0',
										'summary@1.0.0',
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
							const: 'support-thread@1.0.0',
						},
						data: {
							type: 'object',
							properties: {
								category: {
									const: 'customer-success',
								},
							},
							required: ['category'],
						},
					},
					required: ['active', 'type'],
					additionalProperties: true,
				},
			},
		],
	},
};
