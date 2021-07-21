/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { RoleContractDefinition } from '@balena/jellyfish-types/build/core';

export const roleUserOperator: RoleContractDefinition = {
	slug: 'role-user-operator',
	name: 'Operator role permissions',
	type: 'role@1.0.0',
	markers: [],
	data: {
		read: {
			type: 'object',
			anyOf: [
				{
					type: 'object',
					additionalProperties: true,
					required: ['slug'],
					properties: {
						slug: {
							type: 'string',
							enum: ['first-time-login', 'action-create-user'],
						},
					},
				},
				{
					type: 'object',
					description:
						"User can see other user's roles (except for user-admin and user-guest)",
					additionalProperties: true,
					required: ['data', 'type', 'slug'],
					properties: {
						slug: {
							type: 'string',
							not: {
								enum: ['user-admin', 'user-guest'],
							},
						},
						type: {
							type: 'string',
							const: 'user@1.0.0',
						},
						data: {
							type: 'object',
							properties: {
								roles: {
									type: 'array',
									items: {
										type: 'string',
									},
								},
							},
						},
					},
				},
			],
		},
	},
};