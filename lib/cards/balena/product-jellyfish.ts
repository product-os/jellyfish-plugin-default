import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const productJellyfish: ContractDefinition = {
	slug: 'product-jellyfish',
	type: 'product@1.0.0',
	name: 'Jellyfish Product',
	data: {
		url: 'https://github.com/product-os/jellyfish',
	},
};
