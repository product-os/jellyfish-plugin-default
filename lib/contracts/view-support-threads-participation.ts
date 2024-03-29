import type { ViewContractDefinition } from 'autumndb';

export const viewSupportThreadsParticipation: ViewContractDefinition = {
	slug: 'view-support-threads-participation',
	name: 'My participation',
	type: 'view@1.0.0',
	markers: ['org-balena'],
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
										'message',
										'create',
										'whisper',
										'update',
										'message@1.0.0',
										'create@1.0.0',
										'whisper@1.0.0',
										'update@1.0.0',
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
							enum: ['support-thread', 'support-thread@1.0.0'],
						},
						data: {
							type: 'object',
							required: ['participants'],
							properties: {
								participants: {
									type: 'array',
									contains: {
										const: {
											$eval: 'user.id',
										},
									},
								},
							},
						},
					},
					required: ['active', 'type', 'data'],
					description: "View all support threads I've participated in",
					additionalProperties: true,
				},
			},
		],
	},
};
