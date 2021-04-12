/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const ava = require('ava')
const environment = require('@balena/jellyfish-environment').defaultEnvironment
const {
	syncIntegrationScenario
} = require('@balena/jellyfish-test-harness')
const ActionLibrary = require('@balena/jellyfish-action-library')
const DefaultPlugin = require('../../../lib')
const TOKEN = environment.integration.flowdock

syncIntegrationScenario.run(ava, {
	basePath: __dirname,
	plugins: [ ActionLibrary, DefaultPlugin ],
	cards: [ 'thread', 'whisper', 'message' ],
	integration: require('../../../lib/integrations/flowdock'),
	scenarios: require('./webhooks/flowdock'),
	baseUrl: 'https://api.flowdock.com',
	stubRegex: /.*/,
	source: 'flowdock',
	options: {
		token: TOKEN
	},
	isAuthorized: (self, request) => {
		return request.headers.authorization === `Basic ${Buffer.from(self.options.token.api).toString('base64')}`
	}
})
