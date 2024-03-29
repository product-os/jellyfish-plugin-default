import type { ContractDefinition } from 'autumndb';

export const ping: ContractDefinition = {
	slug: 'ping',
	type: 'type@1.0.0',
	name: 'The ping card',
	markers: [],
	data: {
		schema: {
			type: 'object',
			required: ['data'],
			properties: {
				data: {
					type: 'object',
					required: ['timestamp'],
					properties: {
						timestamp: {
							type: 'string',
							format: 'date-time',
						},
					},
				},
			},
		},
	},
};
