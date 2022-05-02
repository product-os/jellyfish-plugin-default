export const relationshipProjectIsOwnedByUser = {
	slug: 'relationship-project-is-owned-by-user',
	type: 'relationship@1.0.0',
	name: 'is owned by',
	data: {
		inverseName: 'owns',
		title: 'Owner',
		inverseTitle: 'Owned project',
		from: {
			type: 'project',
		},
		to: {
			type: 'user',
		},
	},
};
