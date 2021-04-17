/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const ava = require('ava')
const nock = require('nock')
const jwt = require('jsonwebtoken')
const environment = require('@balena/jellyfish-environment').defaultEnvironment
const {
	syncIntegrationScenario
} = require('@balena/jellyfish-test-harness')
const ActionLibrary = require('@balena/jellyfish-action-library')
const DefaultPlugin = require('../../../lib')
const TOKEN = environment.integration.github

const beforeEach = async (test) => {
	if (TOKEN.api && TOKEN.key) {
		await nock('https://api.github.com')
			.persist()
			.post(/^\/app\/installations\/\d+\/access_tokens$/)
			.reply(function (uri, request, callback) {
				const token = this.req.headers.authorization[0].split(' ')[1]
				jwt.verify(token, TOKEN.key, {
					algorithms: [ 'RS256' ]
				}, (error) => {
					if (error) {
						return callback(error)
					}

					return callback(null, [
						201,
						{
							token: TOKEN.api,
							expires_at: '2056-07-11T22:14:10Z',
							permissions: {
								issues: 'write',
								contents: 'read'
							},
							repositories: []
						}
					])
				})
			})
	}
}

syncIntegrationScenario.run({
	test: ava.serial,
	before: ava.before,
	beforeEach: ava.beforeEach,
	after: ava.after.always,
	afterEach: ava.afterEach.always
}, {
	basePath: __dirname,
	plugins: [ ActionLibrary, DefaultPlugin ],
	cards: [ 'issue', 'pull-request', 'message', 'repository', 'gh-push', 'check-run' ],
	beforeEach,
	integration: require('../../../lib/integrations/github'),
	scenarios: require('./webhooks/github'),
	baseUrl: 'https://api.github.com',
	stubRegex: /.*/,
	source: 'github',
	options: {
		token: TOKEN
	},
	isAuthorized: (self, request) => {
		return request.headers.authorization &&
			request.headers.authorization[0] === `token ${self.options.token.api}`
	}
})
