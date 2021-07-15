/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewAllProjects: ViewContractDefinition = {
	slug: 'view-all-projects',
	name: 'Projects',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	data: {
		allOf: [
			{
				name: 'All Projects',
				schema: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							const: 'project@1.0.0',
						},
					},
					additionalProperties: true,
					required: ['type'],
				},
			},
		],
	},
};
