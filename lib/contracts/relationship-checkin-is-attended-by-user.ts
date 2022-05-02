export const relationshipCheckinIsAttendedByUser = {
	slug: 'relationship-checkin-is-attended-by-user',
	type: 'relationship@1.0.0',
	name: 'is attended by',
	data: {
		inverseName: 'attended',
		title: 'Attendee',
		inverseTitle: 'Checkin',
		from: {
			type: 'checkin',
		},
		to: {
			type: 'user',
		},
	},
};
