export const relationshipPatternIsAttachedToThread = {
	slug: 'relationship-pattern-is-attached-to-thread',
	type: 'relationship@1.0.0',
	name: 'is attached to',
	data: {
		inverseName: 'has attached',
		title: 'Thread',
		inverseTitle: 'Pattern',
		from: {
			type: 'pattern',
		},
		to: {
			type: 'thread',
		},
	},
};
