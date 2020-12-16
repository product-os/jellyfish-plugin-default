/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

/* eslint-disable class-methods-use-this */

const getDefaultCards = require('./default-cards')

/**
 * A plugin for providing default cards and functionality for Jellyfish.
 *
 * @module plugin
 */

/**
 * The default Jellyfish plugin.
 *
 * TODO: use TypeScript to define a plugin interface
 * that this class must implement.
 */
module.exports = class DefaultPlugin {
	constructor (options = {}) {
		this.options = options
		this.name = 'Default Jellyfish Plugin'
	}

	getCards (mixin) {
		return getDefaultCards(mixin)
	}
}
