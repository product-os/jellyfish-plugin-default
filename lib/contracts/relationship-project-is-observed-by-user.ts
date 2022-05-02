export const relationshipProjectIsObservedByUser = {
	slug: 'relationship-project-is-observed-by-user',
	type: 'relationship@1.0.0',
	name: 'is observed by',
	data: {
		inverseName: 'observes',
		title: 'Observer',
		inverseTitle: 'Project observation',
		from: {
			type: 'project',
		},
		to: {
			type: 'user',
		},
	},
};
