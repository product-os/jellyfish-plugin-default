/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewAllBrainstormCalls: ViewContractDefinition = {
	slug: 'view-all-brainstorm-calls',
	name: 'Calls',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	data: {
		namespace: 'Brainstorms',
		allOf: [
			{
				name: 'Active calls',
				schema: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							const: 'brainstorm-call@1.0.0',
						},
						active: {
							type: 'boolean',
							const: true,
						},
					},
					required: ['active', 'type'],
					additionalProperties: true,
				},
			},
		],
	},
};
