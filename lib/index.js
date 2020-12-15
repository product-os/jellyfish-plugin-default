/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const loadDefaultCards = require('./default-cards')

/**
 * A plugin for providing default cards and functionality for Jellyfish.
 *
 * @module plugin
 */

module.exports = {
	cards: (mixin) => {
		return loadDefaultCards(mixin)
	}
}
