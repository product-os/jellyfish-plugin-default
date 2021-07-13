/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { RoleContractDefinition } from '@balena/jellyfish-types/build/core';

export const roleUserGuest: RoleContractDefinition = {
	slug: 'role-user-guest',
	name: 'Guest role permissions',
	type: 'role@1.0.0',
	markers: [],
	data: {
		read: {
			type: 'object',
			required: ['active'],
			properties: {
				active: {
					type: 'boolean',
					const: true,
				},
			},
			anyOf: [
				{
					type: 'object',
					required: ['slug', 'type', 'data'],
					properties: {
						slug: {
							type: 'string',
							enum: [
								'execute',
								'link',
								'user',
								'card',
								'action',
								'create',
								'update',
								'session',
							],
						},
						type: {
							type: 'string',
							const: 'type@1.0.0',
						},
						data: {
							type: 'object',
							additionalProperties: true,
						},
					},
				},
				{
					type: 'object',
					required: ['id', 'type', 'data'],
					properties: {
						id: {
							type: 'string',
						},
						type: {
							type: 'string',
							enum: ['create@1.0.0', 'update@1.0.0'],
						},
						data: {
							type: 'object',
							required: ['timestamp', 'target', 'actor', 'payload'],
							properties: {
								timestamp: {
									type: 'string',
								},
								target: {
									type: 'string',
								},
								actor: {
									type: 'string',
									const: {
										$eval: 'user.id',
									},
								},
								payload: {
									type: 'object',
								},
							},
						},
					},
				},
				{
					type: 'object',
					required: ['type', 'data'],
					additionalProperties: true,
					properties: {
						type: {
							type: 'string',
							const: 'link@1.0.0',
						},
						data: {
							type: 'object',
							additionalProperties: true,
						},
					},
				},
				{
					type: 'object',
					required: ['id', 'slug', 'type', 'data'],
					properties: {
						id: {
							type: 'string',
						},
						slug: {
							type: 'string',
							enum: [
								'action-create-session',
								'action-update-card',
								'action-upsert-card',
								'action-create-event',
								'action-oauth-authorize',
								'action-request-password-reset',
								'action-complete-password-reset',
								'action-complete-first-time-login',
							],
						},
						type: {
							type: 'string',
							const: 'action@1.0.0',
						},
						data: {
							type: 'object',
							additionalProperties: true,
						},
					},
				},
				{
					type: 'object',
					required: ['type', 'data'],
					additionalProperties: true,
					properties: {
						type: {
							type: 'string',
							enum: ['execute@1.0.0', 'session@1.0.0'],
						},
						data: {
							type: 'object',
							additionalProperties: true,
							required: ['actor'],
							properties: {
								actor: {
									type: 'string',
									const: {
										$eval: 'user.id',
									},
								},
							},
						},
					},
				},
				{
					type: 'object',
					required: ['slug', 'type'],
					additionalProperties: true,
					properties: {
						slug: {
							type: 'string',
							const: {
								$eval: 'user.slug',
							},
						},
						type: {
							type: 'string',
							const: 'user@1.0.0',
						},
					},
				},
				{
					type: 'object',
					required: ['id', 'type', 'slug', 'version'],
					additionalProperties: false,
					properties: {
						id: {
							type: 'string',
						},
						type: {
							type: 'string',
							const: 'user@1.0.0',
						},
						slug: {
							type: 'string',
							not: {
								const: 'user-admin',
							},
						},
						version: {
							type: 'string',
						},
					},
				},
			],
		},
	},
};
