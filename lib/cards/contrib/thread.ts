import type { Mixins } from '@balena/jellyfish-plugin-base';
import type { ContractDefinition } from '@balena/jellyfish-types/build/core';

export function thread({ mixin, withEvents }: Mixins): ContractDefinition {
	return mixin(withEvents)({
		slug: 'thread',
		type: 'type@1.0.0',
		name: 'Chat thread',
		data: {
			schema: {
				type: 'object',
				properties: {
					data: {
						type: 'object',
						properties: {
							description: {
								type: 'string',
								fullTextSearch: true,
							},
						},
					},
				},
			},
		},
	});
}
