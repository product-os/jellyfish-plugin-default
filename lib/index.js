/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

/* eslint-disable class-methods-use-this */

const {
	JellyfishPluginBase
} = require('@balena/jellyfish-plugin-base')
const cards = require('./cards')
const integrations = require('./integrations')
const mixins = require('./cards/mixins')
const {
	version
} = require('../package.json')

/**
 * A plugin for providing default cards and functionality for Jellyfish.
 *
 * @module plugin
 */

/**
 * The default Jellyfish plugin.
 */
module.exports = class DefaultPlugin extends JellyfishPluginBase {
	constructor () {
		super({
			slug: 'jellyfish-plugin-default',
			name: 'Default Jellyfish Plugin',
			version,
			mixins,
			cards,
			integrations
		})
	}
}
