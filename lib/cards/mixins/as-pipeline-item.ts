/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import _ from 'lodash';

const defaultStatusOptions = ['open', 'closed', 'archived'];

// Defines fields common to all items used in pipelines
export function asPipelineItem(
	statusOptions = defaultStatusOptions,
	defaultStatus = 'open',
	statusNames = null,
): any {
	return {
		data: {
			schema: {
				properties: {
					data: {
						type: 'object',
						required: ['status'],
						properties: {
							status: {
								title: 'Status',
								type: 'string',
								default: defaultStatus,
								enum: statusOptions,
								enumNames: statusNames || statusOptions.map(_.startCase),
							},
						},
					},
				},
				required: ['data'],
			},
			uiSchema: {
				fields: {
					data: {
						status: {
							'ui:widget': 'Badge',
						},
					},
				},
			},
			slices: ['properties.data.properties.status'],
			indexed_fields: [['data.status']],
		},
	};
}
