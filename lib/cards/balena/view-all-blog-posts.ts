/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ViewContractDefinition } from '@balena/jellyfish-types/build/core';

export const viewAllBlogPosts: ViewContractDefinition = {
	slug: 'view-all-blog-posts',
	name: 'Blog posts',
	type: 'view@1.0.0',
	markers: ['org-balena'],
	data: {
		allOf: [
			{
				name: 'All blog-posts',
				schema: {
					type: 'object',
					properties: {
						type: {
							type: 'string',
							const: 'blog-post@1.0.0',
						},
					},
					additionalProperties: true,
					required: ['type'],
				},
			},
		],
	},
};
