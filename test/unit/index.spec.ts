import { PluginManager } from '@balena/jellyfish-worker';
import _ from 'lodash';
import { defaultPlugin } from '../../lib';

const pluginManager = new PluginManager([defaultPlugin()]);

test('Expected cards are loaded', () => {
	const cards = pluginManager.getCards();

	// Sanity check
	expect(_.isEmpty(cards)).toBe(false);
	expect(cards.message.name).toEqual('Chat message');
	expect(cards['action-maintain-contact'].name).toEqual(
		'Maintain a contact for a user',
	);
});

test('Expected actions are loaded', () => {
	const actions = pluginManager.getActions();

	// Sanity check
	expect(_.isEmpty(actions)).toBe(false);
	expect(typeof actions['action-maintain-contact'].handler).toEqual('function');
});
