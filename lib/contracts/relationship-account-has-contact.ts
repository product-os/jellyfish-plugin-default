export const relationshipAccountHasContact = {
	slug: 'relationship-account-has-contact',
	type: 'relationship@1.0.0',
	name: 'has',
	data: {
		inverseName: 'is member of',
		title: 'Contact',
		inverseTitle: 'Account',
		from: {
			type: 'account',
		},
		to: {
			type: 'contact',
		},
	},
};
