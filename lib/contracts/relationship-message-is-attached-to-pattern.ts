import type { RelationshipContractDefinition } from 'autumndb';

export const relationshipMessageIsAttachedToPattern: RelationshipContractDefinition =
	{
		slug: 'relationship-message-is-attached-to-pattern',
		type: 'relationship@1.0.0',
		name: 'is attached to',
		data: {
			inverseName: 'has attached element',
			title: 'Message',
			inverseTitle: 'Pattern',
			from: {
				type: 'message',
			},
			to: {
				type: 'pattern',
			},
		},
	};
