import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

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
									properties: {
										type: {
											const: 'user@1.0.0',
										},
									},
								},
							},
						},
						{
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
								},
							},
						},
						true,
					],
					type: 'object',
					properties: {
						type: {
							type: 'string',
							const: 'support-thread@1.0.0',
						},
						data: {
							type: 'object',
							required: ['inbox'],
							properties: {
								inbox: {
									type: 'string',
									enum: ['paid', 'S/Paid_Support'],
								},
							},
						},
					},
				},
			},
		],
	},
};
