import { contractMixins } from '@balena/jellyfish-worker';
import type { ContractDefinition } from 'autumndb';

const slug = 'thread';
const type = 'type@1.0.0';

export const thread: ContractDefinition = contractMixins.mixin(
	contractMixins.withEvents(slug, type),
)({
	slug,
	type,
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
