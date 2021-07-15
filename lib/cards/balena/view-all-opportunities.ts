/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewAllOpportunities: ViewContractDefinition = {
	slug: 'view-all-opportunities',
	name: 'All opportunities',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	data: {
		namespace: 'Sales',
		allOf: [
			{
				name: 'Active opportunities',
				schema: {
					anyOf: [
						{
							$$links: {
								'is attached to': {
									type: 'object',
									properties: {
										type: {
											const: 'account@1.0.0',
										},
									},
									additionalProperties: true,
								},
								'is owned by': {
									properties: {
										type: {
											const: 'user@1.0.0',
										},
									},
									additionalProperties: true,
								},
							},
						},
						true,
					],
					type: 'object',
					properties: {
						active: {
							const: true,
							type: 'boolean',
						},
						type: {
							type: 'string',
							const: 'opportunity@1.0.0',
						},
					},
					required: ['active', 'type'],
					additionalProperties: true,
				},
			},
		],
	},
};
