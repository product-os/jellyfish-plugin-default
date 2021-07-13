/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewActive: ViewContractDefinition = {
	slug: 'view-active',
	name: 'Active cards',
	type: 'view@1.0.0',
	markers: [],
	data: {
		allOf: [
			{
				name: 'Active cards',
				schema: {
					type: 'object',
					properties: {
						active: {
							type: 'boolean',
							const: true,
						},
						type: {
							not: {
								const: 'session@1.0.0',
							},
						},
					},
					required: ['active'],
					additionalProperties: true,
				},
			},
		],
	},
};
