export const relationshipImprovementHasAttachedMilestone = {
	slug: 'relationship-improvement-has-attached-milestone',
	type: 'relationship@1.0.0',
	name: 'has attached',
	data: {
		inverseName: 'is attached to',
		title: 'Milestone',
		inverseTitle: 'Improvement',
		from: {
			type: 'improvement',
		},
		to: {
			type: 'milestone',
		},
	},
};
