/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const ava = require('ava')
const _ = require('lodash')
const environment = require('@balena/jellyfish-environment').defaultEnvironment
const {
	syncIntegrationScenario
} = require('@balena/jellyfish-test-harness')
const ActionLibrary = require('@balena/jellyfish-action-library')
const DefaultPlugin = require('../../../lib')
const TOKEN = environment.integration.front

syncIntegrationScenario.run({
	test: ava.serial,
	before: ava.before,
	beforeEach: ava.beforeEach,
	after: ava.after.always,
	afterEach: ava.afterEach.always
}, {
	basePath: __dirname,
	plugins: [ ActionLibrary, DefaultPlugin ],
	cards: [ 'support-thread', 'sales-thread', 'whisper', 'message' ],
	integration: require('../../../lib/integrations/front'),
	scenarios: require('./webhooks/front'),
	slices: _.range(0, 50),
	baseUrl: /(api2.frontapp.com|api.intercom.io)(:443)?$/,
	stubRegex: /.*/,
	source: 'front',
	options: {
		token: TOKEN
	},
	isAuthorized: (self, request) => {
		return request.options.headers.authorization === `Bearer ${self.options.token.api}` ||
		request.options.headers.authorization.startsWith('Basic')
	}
})
