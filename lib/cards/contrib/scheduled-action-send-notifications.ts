/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const subscription: ContractDefinition = {
	slug: 'scheduled-action-send-notifications',
	type: 'scheduled-action@1.0.0',
	name: 'Scheduled action to send notifications',
	markers: [],
	data: {
		options: {
			action: 'action-send-notifications@1.0.0',
			card: 'scheduled-action@1.0.0',
			type: 'type',
			arguments: {
				reason: null,
				properties: {},
			},
		},
		schedule: {
			recurring: {
				start: '2021-08-15T00:00:00.000Z',
				interval: '30 * * * *',
			},
		},
	},
};
