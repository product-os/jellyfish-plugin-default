import type { RelationshipContractDefinition } from 'autumndb';

export const relationshipMessageIsAttachedToImprovement: RelationshipContractDefinition =
	{
		slug: 'relationship-message-is-attached-to-improvement',
		type: 'relationship@1.0.0',
		name: 'is attached to',
		data: {
			inverseName: 'has attached element',
			title: 'Message',
			inverseTitle: 'Improvement',
			from: {
				type: 'message',
			},
			to: {
				type: 'improvement',
			},
		},
	};
