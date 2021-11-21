import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const productBalenaCloud: ContractDefinition = {
	slug: 'product-balena-cloud',
	type: 'product@1.0.0',
	name: 'Balena Product',
	data: {
		url: 'https://github.com/balena-io/balena/',
	},
};
