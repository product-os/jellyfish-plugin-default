import _ from 'lodash';
import { cardMixins } from '@balena/jellyfish-core';
import { DefaultPlugin } from '../../lib';

const context = {
	id: 'jellyfish-plugin-default-test',
};

const plugin = new DefaultPlugin();

test('Expected cards are loaded', () => {
	const cards = plugin.getCards(context, cardMixins);

	// Sanity check
	expect(_.isEmpty(cards)).toBe(false);
	expect(cards.message.name).toEqual('Chat message');
	expect(cards['action-maintain-contact'].name).toEqual(
		'Maintain a contact for a user',
	);
});

test('Expected actions are loaded', () => {
	const actions = plugin.getActions(context);

	// Sanity check
	expect(_.isEmpty(actions)).toBe(false);
	expect(typeof actions['action-maintain-contact'].handler).toEqual('function');
});
