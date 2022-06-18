import type { RelationshipContractDefinition } from 'autumndb';

export const relationshipMessageIsAttachedToBlogPost: RelationshipContractDefinition =
	{
		slug: 'relationship-message-is-attached-to-blog-post',
		type: 'relationship@1.0.0',
		name: 'is attached to',
		data: {
			inverseName: 'has attached element',
			title: 'Message',
			inverseTitle: 'Blog post',
			from: {
				type: 'message',
			},
			to: {
				type: 'blog-post',
			},
		},
	};
