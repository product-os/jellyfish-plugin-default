/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewAllViews: ViewContractDefinition = {
	slug: 'view-all-views',
	name: 'All views',
	type: 'view@1.0.0',
	markers: [],
	data: {
		allOf: [
			{
				name: 'Card type view',
				schema: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							const: 'view@1.0.0',
						},
						active: {
							type: 'boolean',
							const: true,
						},
					},
					additionalProperties: true,
					required: ['type'],
				},
			},
		],
	},
};
