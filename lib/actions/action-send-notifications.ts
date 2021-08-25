/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { getLogger } from '@balena/jellyfish-logger';
import type { ActionFile } from '@balena/jellyfish-plugin-base';
import { WorkerContext } from '@balena/jellyfish-types/build/worker';
import _ from 'lodash';

const logger = getLogger(__filename);

const handler: ActionFile['handler'] = async (
	session: string,
	context: WorkerContext,
	card: any,
	request: any,
) => {
	logger.info(request.context, 'Send notifications');

	/*
	 * Get all notifications whose creation date + NOTIFICATION_TIMEOUT is in range of card.data.last <-> card.data.next
	 */
	const notifications = await context.query(session, {
		type: 'object',
		required: ['type'],
		properties: {
			type: {
				const: 'notification@1.0.0',
			},
		},
		$$links: {
			'is attached to': {
				type: 'object',
				required: ['type'],
				properties: {
					type: {
						const: 'message@1.0.0',
					},
				},
				$$links: {
					'is attached to': {
						required: ['type'],
						properties: {
							type: {
								const: 'support-thread@1.0.0',
							},
						},
					},
				},
			},
		},
		not: {
			$$links: {
				'is read by': {
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
	});

	const notificationsGroupedByActors = _.groupBy(
		notifications,
		(notification) => {
			const message = notification.links!['is attached to'].find((contract) => {
				return contract.type === 'message@1.0.0';
			});

			return message!.data.actor;
		},
	);

	await Promise.all(
		Object.entries(notificationsGroupedByActors).map(
			([actor, notification]) => {
				// Send email
			},
		),
	);
};

export const actionSendNotifications: ActionFile = {
	handler,
	card: {
		slug: 'action-send-notifications',
		type: 'action@1.0.0',
		name: 'Send notifications',
		data: {
			filter: {
				type: 'object',
			},
			arguments: {},
		},
	},
};
