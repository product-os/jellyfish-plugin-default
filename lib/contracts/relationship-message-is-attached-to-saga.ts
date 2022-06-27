import type { RelationshipContractDefinition } from 'autumndb';

export const relationshipMessageIsAttachedToSaga: RelationshipContractDefinition =
	{
		slug: 'relationship-message-is-attached-to-saga',
		type: 'relationship@1.0.0',
		name: 'is attached to',
		data: {
			inverseName: 'has attached element',
			title: 'Message',
			inverseTitle: 'Saga',
			from: {
				type: 'message',
			},
			to: {
				type: 'saga',
			},
		},
	};
