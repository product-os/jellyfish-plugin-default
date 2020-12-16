/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const _ = require('lodash')
const ava = require('ava')
const coreMixins = require('@balena/jellyfish-core/lib/cards/mixins')

const DefaultPlugin = require('./index')

ava('Plugin returns collection of cards', (test) => {
	const plugin = new DefaultPlugin()
	const cards = plugin.getCards(coreMixins)
	test.truthy(!_.isEmpty(cards))
})
