/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const webPushSubscription: ContractDefinition = {
	slug: 'web-push-subscription',
	type: 'type@1.0.0',
	name: 'Web Push subscription',
	markers: [],
	data: {
		schema: {
			type: 'object',
			required: ['data'],
			properties: {
				data: {
					type: 'object',
					required: ['endpoint', 'token', 'auth'],
					properties: {
						endpoint: {
							type: 'string',
						},
						token: {
							type: 'string',
						},
						auth: {
							type: 'string',
						},
					},
				},
			},
		},
		indexed_fields: [['data.endpoint']],
	},
};
