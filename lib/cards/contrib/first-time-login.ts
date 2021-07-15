/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const firstTimeLogin: ContractDefinition = {
	slug: 'first-time-login',
	name: 'first-time login',
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
						firstTimeLoginToken: {
							type: 'string',
							format: 'uuid',
						},
					},
				},
			},
		},
	},
};
