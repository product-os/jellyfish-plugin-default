import type { RelationshipContractDefinition } from 'autumndb';

export const relationshipMessageIsAttachedToThread: RelationshipContractDefinition =
	{
		slug: 'relationship-message-is-attached-to-thread',
		type: 'relationship@1.0.0',
		name: 'is attached to',
		data: {
			inverseName: 'has attached element',
			title: 'Message',
			inverseTitle: 'Thread',
			from: {
				type: 'message',
			},
			to: {
				type: 'thread',
			},
		},
	};
