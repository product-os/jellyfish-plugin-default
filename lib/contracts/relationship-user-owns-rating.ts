export const relationshipUserOwnsRating = {
	slug: 'relationship-user-owns-rating',
	type: 'relationship@1.0.0',
	name: 'owns',
	data: {
		inverseName: 'is owned by',
		title: 'Owned rating',
		inverseTitle: 'Owner',
		from: {
			type: 'user',
		},
		to: {
			type: 'rating',
		},
	},
};
