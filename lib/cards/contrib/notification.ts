/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const notification: ContractDefinition = {
	slug: 'notification',
	type: 'type@1.0.0',
	name: 'Notification',
	markers: [],
	data: {
		schema: {
			type: 'object',
			properties: {},
		},
	},
};
