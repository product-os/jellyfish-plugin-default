/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewNonExecutedActionRequests: ViewContractDefinition = {
	slug: 'view-non-executed-action-requests',
	name: 'Pending actions',
	type: 'view@1.0.0',
	markers: [],
	data: {
		allOf: [
			{
				name: 'Action Requests',
				schema: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
						},
						type: {
							type: 'string',
							const: 'action-request@1.0.0',
						},
						data: {
							type: 'object',
							properties: {
								action: {
									type: 'string',
								},
								actor: {
									type: 'string',
								},
								target: {
									type: 'string',
								},
								arguments: {
									type: 'object',
									additionalProperties: true,
								},
							},
							required: ['action', 'target', 'arguments'],
						},
					},
					required: ['id', 'type', 'data'],
				},
			},
			{
				name: 'Non-executed',
				schema: {
					type: 'object',
					properties: {
						data: {
							type: 'object',
							properties: {
								executed: {
									type: 'boolean',
									const: false,
								},
							},
							required: ['executed'],
						},
					},
					required: ['data'],
				},
			},
		],
	},
};
