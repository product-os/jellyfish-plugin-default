import type { RelationshipContractDefinition } from 'autumndb';

export const relationshipMessageIsAttachedToSupportThread: RelationshipContractDefinition =
	{
		slug: 'relationship-message-is-attached-to-support-thread',
		type: 'relationship@1.0.0',
		name: 'is attached to',
		data: {
			inverseName: 'has attached element',
			title: 'Message',
			inverseTitle: 'Support Thread',
			from: {
				type: 'message',
			},
			to: {
				type: 'support-thread',
			},
		},
	};
