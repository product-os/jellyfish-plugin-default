import type { RelationshipContractDefinition } from 'autumndb';

export const relationshipMessageIsAttachedToBrainstormTopic: RelationshipContractDefinition =
	{
		slug: 'relationship-message-is-attached-to-brainstorm-topic',
		type: 'relationship@1.0.0',
		name: 'is attached to',
		data: {
			inverseName: 'has attached element',
			title: 'Message',
			inverseTitle: 'Brainstorm topic',
			from: {
				type: 'message',
			},
			to: {
				type: 'brainstorm-topic',
			},
		},
	};
