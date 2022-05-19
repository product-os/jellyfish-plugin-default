import type { RelationshipContractDefinition } from 'autumndb';

export const relationshipMessageIsAttachedToSalesThread: RelationshipContractDefinition =
	{
		slug: 'relationship-message-is-attached-to-sales-thread',
		type: 'relationship@1.0.0',
		name: 'is attached to',
		data: {
			inverseName: 'has attached element',
			title: 'Message',
			inverseTitle: 'Sales thread',
			from: {
				type: 'message',
			},
			to: {
				type: 'sales-thread',
			},
		},
	};
