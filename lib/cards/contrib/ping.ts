/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const ping: ContractDefinition = {
	slug: 'ping',
	type: 'type@1.0.0',
	name: 'The ping card',
	markers: [],
	data: {
		schema: {
			type: 'object',
			required: ['data'],
			properties: {
				data: {
					type: 'object',
					required: ['timestamp'],
					properties: {
						timestamp: {
							type: 'string',
							format: 'date-time',
						},
					},
				},
			},
		},
	},
};
