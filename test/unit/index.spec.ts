import { PluginManager } from '@balena/jellyfish-worker';
import _ from 'lodash';
import { defaultPlugin } from '../../lib';

const pluginManager = new PluginManager([defaultPlugin()]);

test('Expected contracts are loaded', () => {
	const contracts = pluginManager.getCards();

	// Sanity check
	expect(_.isEmpty(contracts)).toBe(false);
	expect(contracts.message.name).toEqual('Chat message');
	expect(contracts['action-maintain-contact'].name).toEqual(
		'Maintain a contact for a user',
	);
});

test('Expected actions are loaded', () => {
	const actions = pluginManager.getActions();

	// Sanity check
	expect(_.isEmpty(actions)).toBe(false);
	expect(typeof actions['action-maintain-contact'].handler).toEqual('function');
});
