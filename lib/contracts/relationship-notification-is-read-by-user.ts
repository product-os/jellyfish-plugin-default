export const relationshipNotificationIsReadByUser = {
	slug: 'relationship-notification-is-read-by-user',
	type: 'relationship@1.0.0',
	name: 'is read by',
	data: {
		inverseName: 'read',
		title: 'User',
		inverseTitle: 'Notification',
		from: {
			type: 'notification',
		},
		to: {
			type: 'user',
		},
	},
};
