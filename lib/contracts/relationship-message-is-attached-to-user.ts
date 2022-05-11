import type { RelationshipContractDefinition } from 'autumndb';

export const relationshipMessageIsAttachedToUser: RelationshipContractDefinition =
	{
		slug: 'relationship-message-is-attached-to-user',
		type: 'relationship@1.0.0',
		name: 'is attached to',
		data: {
			inverseName: 'has attached element',
			title: 'Message',
			inverseTitle: 'User',
			from: {
				type: 'message',
			},
			to: {
				type: 'user',
			},
		},
	};
