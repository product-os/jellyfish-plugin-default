import type { RelationshipContractDefinition } from 'autumndb';

export const relationshipMessageIsAttachedToGroup: RelationshipContractDefinition =
	{
		slug: 'relationship-message-is-attached-to-group',
		type: 'relationship@1.0.0',
		name: 'is attached to',
		data: {
			inverseName: 'has attached element',
			title: 'Message',
			inverseTitle: 'Group',
			from: {
				type: 'message',
			},
			to: {
				type: 'group',
			},
		},
	};
