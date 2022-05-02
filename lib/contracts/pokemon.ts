import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const pokemon: ContractDefinition = {
	// The slug is the machine name of this type and will appear in the "type"
	// field of all Pokémon cards derived from this type definition
	slug: 'pokemon',
	// Since this is a type definition, it is of the type 'type'. The type is also
	// versioned, to indicate which version of the 'type' type it will validate
	// against
	type: 'type@1.0.0',
	// The name field is the friendly name used when interacting with the type
	// definition in UI (e.g. CRUD operations, forms)
	name: 'Pokémon',
	// Markers are used for defining permissions and will be explained elsewhere
	// in the documentation
	markers: [],
	// The tag field is used to contain tag data, this is an array of strings
	tags: [],
	// In Jellyfish, cards are "soft deleted" and the active field is used to
	// indicate whether or not the card is in this state or not. An active value of
	// "false" would indicate that the card has been deleted
	active: true,
	// The data field contains the type definition JSON schema and additional meta
	// data
	data: {
		// The schema field is a JSON schema defining the shape of a type card. Type
		// cards are also contracts (just like this one) and are merged against the
		// default contract definition for purposes of validation, so you don't need
		// to duplicate anything that already exists at the top level.
		// This schema is used for validating new Pokémon cards, and for creating
		// the form used to create them.
		schema: {
			type: 'object',
			required: ['data'],
			properties: {
				data: {
					type: 'object',
					required: ['firstSeen'],
					properties: {
						height: {
							type: 'number',
						},
						weight: {
							type: 'number',
						},
						description: {
							type: 'string',
						},
						abilities: {
							type: 'string',
						},
						pokedexNumber: {
							title: 'National Pokèdex Number',
							type: 'number',
						},
						caught: {
							type: 'boolean',
						},
						firstSeen: {
							title: 'First seen',
							description: 'The first time you saw this pokèmon',
							type: 'string',
							format: 'date-time',
						},
					},
				},
			},
		},
	},
};
