/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewAllGroups: ViewContractDefinition = {
	slug: 'view-all-groups',
	name: 'Chat groups',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	data: {
		namespace: 'Comms',
		allOf: [
			{
				name: 'All Groups',
				schema: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							const: 'group@1.0.0',
						},
					},
					additionalProperties: true,
					required: ['type'],
				},
			},
		],
	},
};
