import type { ContractDefinition } from 'autumndb';

export const passwordReset: ContractDefinition = {
	slug: 'password-reset',
	name: 'Password Reset',
	type: 'type@1.0.0',
	markers: [],
	data: {
		schema: {
			type: 'object',
			properties: {
				data: {
					type: 'object',
					properties: {
						requestedAt: {
							type: 'string',
							format: 'date-time',
						},
						expiresAt: {
							type: 'string',
							format: 'date-time',
						},
						resetToken: {
							type: 'string',
							pattern: '^[0-9a-fA-F]{64}$',
						},
					},
				},
			},
		},
	},
};
