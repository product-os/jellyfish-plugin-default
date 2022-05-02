export const relationshipFeedbackItemIsFeedbackForUser = {
	slug: 'relationship-feedback-item-is-feedback-for-user',
	type: 'relationship@1.0.0',
	name: 'is feedback for',
	data: {
		inverseName: 'is reviewed with',
		title: 'User',
		inverseTitle: 'Feedback item',
		from: {
			type: 'feedback-item',
		},
		to: {
			type: 'user',
		},
	},
};
