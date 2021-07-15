/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewMyConversations: ViewContractDefinition = {
	slug: 'view-my-conversations',
	name: 'My conversations',
	type: 'view@1.0.0',
	markers: [],
	data: {
		allOf: [
			{
				name: 'My conversations',
				schema: {
					anyOf: [
						{
							$$links: {
								'is owned by': {
									type: 'object',
									required: ['type'],
									properties: {
										type: {
											const: 'user@1.0.0',
										},
									},
								},
							},
						},
						true,
					],
					$$links: {
						'is owned by': {
							type: 'object',
							properties: {
								id: {
									const: {
										$eval: 'user.id',
									},
								},
							},
						},
					},
					type: 'object',
					properties: {
						active: {
							const: true,
							type: 'boolean',
						},
						type: {
							enum: ['support-thread@1.0.0', 'sales-thread@1.0.0'],
						},
					},
					additionalProperties: true,
				},
			},
		],
	},
};
