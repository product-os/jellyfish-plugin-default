/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const _ = require('lodash')
const ava = require('ava')
const coreMixins = require('@balena/jellyfish-core/build/cards/mixins')
const DefaultPlugin = require('./index')

const context = {
	id: 'jellyfish-plugin-default-test'
}

const plugin = new DefaultPlugin()

ava('Plugin returns collection of cards', (test) => {
	const cards = plugin.getCards(context, coreMixins)
	test.truthy(!_.isEmpty(cards))
	test.is(cards.message.name, 'Chat message')
	test.is(cards['action-maintain-contact'].name, 'Maintain a contact for a user')
})

ava('Plugin returns actions', (test) => {
	const actions = plugin.getActions(context)
	test.truthy(!_.isEmpty(actions))
	test.is(typeof actions['action-maintain-contact'].handler, 'function')
})
