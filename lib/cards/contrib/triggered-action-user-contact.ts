import type { TriggeredActionContractDefinition } from '@balena/jellyfish-types/build/worker';

export const triggeredActionUserContact: TriggeredActionContractDefinition = {
	slug: 'triggered-action-user-contact',
	type: 'triggered-action@1.0.0',
	name: 'Triggered action for maintaining user contact information',
	markers: [],
	data: {
		schedule: 'sync',
		filter: {
			type: 'object',
			required: ['type'],
			properties: {
				type: {
					type: 'string',
					const: 'user@1.0.0',
				},
			},
		},
		action: 'action-maintain-contact@1.0.0',
		target: {
			$eval: 'source.id',
		},
		arguments: {},
	},
};