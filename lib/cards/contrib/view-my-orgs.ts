/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewMyOrgs: ViewContractDefinition = {
	slug: 'view-my-orgs',
	name: 'My organisations',
	type: 'view@1.0.0',
	markers: [],
	data: {
		allOf: [
			{
				name: 'My organisations',
				schema: {
					$$links: {
						'has member': {
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
						type: {
							const: 'org@1.0.0',
						},
					},
					additionalProperties: true,
				},
			},
		],
	},
};
