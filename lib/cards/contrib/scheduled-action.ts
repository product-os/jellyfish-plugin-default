/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export const scheduledAction: ContractDefinition = {
	slug: 'scheduled-action',
	type: 'type@1.0.0',
	name: 'Scheduled action',
	markers: [],
	data: {
		schema: {
			type: 'object',
			required: ['data'],
			properties: {
				data: {
					type: 'object',
					required: ['action', 'schedule'],
					properties: {
						action: {
							title: 'Action name',
							type: 'string',
						},
						arguments: {
							title: 'Action arguments',
							type: 'object',
						},
						schedule: {
							title: 'Action schedule',
							type: 'object',
							required: ['start', 'end', 'interval'],
							properties: {
								start: {
									title: 'Execution start date/time',
									type: 'string',
									format: 'date-time',
								},
								end: {
									title: 'Execution end date/time',
									type: 'string',
									format: 'date-time',
								},
								interval: {
									title: 'Execution interval (cron format)',
									type: 'string',
									pattern:
										'^([\\d|/|*|\\-|,]+\\s)?[\\d|/|*|\\-|,]+\\s[\\d|/|*|\\-|,]+\\s[\\d|L|/|*|\\-|,|\\?]+\\s[\\d|/|*|\\-|,]+\\s[\\d|L|/|*|\\-|,|\\?]+$',
								},
							},
						},
						jobs: {
							title: 'Scheduled job keys',
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
				},
			},
		},
	},
};
