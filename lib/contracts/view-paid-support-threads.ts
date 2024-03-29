import type { ViewContractDefinition } from 'autumndb';

export const viewPaidSupportThreads: ViewContractDefinition = {
	slug: 'view-paid-support-threads',
	name: 'Paid support',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	loop: 'loop-balena-io@1.0.0',
	data: {
		namespace: 'Support',
		allOf: [
			{
				name: 'Paid support threads',
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
										'create@1.0.0',
										'whisper@1.0.0',
										'update@1.0.0',
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
								mirrors: {
									type: 'array',
									items: {
										type: 'string',
										not: {
											pattern: 'forums.balena.io',
										},
									},
								},
								category: {
									description:
										'This field is not required and should match cases where the field is not present OR is not in the enum',
									not: {
										enum: ['customer-success', 'security'],
									},
								},
								product: {
									const: 'balenaCloud',
								},
							},
						},
					},
					required: ['active', 'type', 'data'],
					additionalProperties: true,
				},
			},
		],
	},
};
