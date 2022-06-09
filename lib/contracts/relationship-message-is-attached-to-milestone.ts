import type { RelationshipContractDefinition } from 'autumndb';

export const relationshipMessageIsAttachedToMilestone: RelationshipContractDefinition =
	{
		slug: 'relationship-message-is-attached-to-milestone',
		type: 'relationship@1.0.0',
		name: 'is attached to',
		data: {
			inverseName: 'has attached element',
			title: 'Message',
			inverseTitle: 'Milestone',
			from: {
				type: 'message',
			},
			to: {
				type: 'milestone',
			},
		},
	};
