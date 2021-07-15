/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewAllSagas: ViewContractDefinition = {
	slug: 'view-all-sagas',
	name: 'Sagas',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	data: {
		allOf: [
			{
				name: 'All Sagas',
				schema: {
					type: 'object',
					anyOf: [
						{
							$$links: {
								'has attached': {
									type: 'object',
									properties: {
										type: {
											const: 'improvement@1.0.0',
										},
									},
									additionalProperties: false,
								},
							},
						},
						true,
					],
					properties: {
						type: {
							type: 'string',
							const: 'saga@1.0.0',
						},
					},
					additionalProperties: true,
					required: ['type'],
				},
			},
		],
	},
};
