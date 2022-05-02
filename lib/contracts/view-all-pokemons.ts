import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewAllPokemons: ViewContractDefinition = {
	slug: 'view-all-pokemons',
	name: 'Pokemons',
	type: 'view@1.0.0',
	// markers: ['org-balena'],
	data: {
		allOf: [
			{
				name: 'All Pokemons',
				schema: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							const: 'pokemon@1.0.0',
						},
					},
					additionalProperties: true,
					required: ['type'],
				},
			},
		],
	},
};
