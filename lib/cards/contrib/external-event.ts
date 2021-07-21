/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const externalEvent: ContractDefinition = {
	slug: 'external-event',
	type: 'type@1.0.0',
	name: 'External event',
	markers: [],
	data: {
		schema: {
			type: 'object',
			properties: {
				slug: {
					type: 'string',
					pattern: '^external-event-[a-z0-9-]+$',
				},
				data: {
					type: 'object',
					properties: {
						source: {
							type: 'string',
							pattern: '^[a-z0-9-]+$',
						},
						headers: {
							type: 'object',
						},
						payload: {
							type: ['object', 'string'],
						},
					},
					required: ['source', 'headers', 'payload'],
				},
			},
			required: ['slug', 'data'],
		},
	},
};