/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewAllSupportIssues: ViewContractDefinition = {
	slug: 'view-all-support-issues',
	name: 'Support knowledge base',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	data: {
		namespace: 'Support',
		allOf: [
			{
				name: 'Support knowledge base',
				schema: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							const: 'support-issue@1.0.0',
						},
					},
					additionalProperties: true,
					required: ['type'],
				},
			},
		],
	},
};
