import type { UserContractDefinition } from '@balena/jellyfish-types/build/core';

export const userGuest: UserContractDefinition = {
	slug: 'user-guest',
	type: 'user@1.0.0',
	name: 'The guest user',
	markers: [],
	data: {
		email: 'accounts+jellyfish@resin.io',
		hash: 'PASSWORDLESS',
		roles: [],
	},
};
