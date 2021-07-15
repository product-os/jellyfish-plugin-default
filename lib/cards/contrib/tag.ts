/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const tag: ContractDefinition = {
	slug: 'tag',
	type: 'type@1.0.0',
	name: 'Tag',
	markers: [],
	data: {
		schema: {
			type: 'object',
			properties: {
				name: {
					type: 'string',
				},
				data: {
					type: 'object',
					properties: {
						count: {
							type: 'number',
						},
						color: {
							type: 'string',
						},
						description: {
							type: 'string',
						},
					},
				},
			},
		},
	},
};
