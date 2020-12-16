/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const ava = require('ava')
const coreMixins = require('@balena/jellyfish-core/lib/cards/mixins')

const getCards = require('./index')

ava('Default cards are loaded', (test) => {
	const cards = getCards(coreMixins)

	// Sanity check
	test.is(cards.message.name, 'Chat message')
})
