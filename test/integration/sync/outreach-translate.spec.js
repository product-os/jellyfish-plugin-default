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
const TOKEN = environment.integration.outreach

const OAUTH_DETAILS = {
	access_token: 'MTQ0NjJkZmQ5OTM2NDE1ZTZjNGZmZjI3',
	token_type: 'bearer',
	expires_in: 3600,
	refresh_token: 'IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk',
	scope: 'create'
}

const before = async (context) => {
	const userCard = await context.jellyfish.getCardBySlug(
		context.context,
		context.jellyfish.sessions.admin,
		`user-${environment.integration.default.user}@latest`)

	await context.jellyfish.patchCardBySlug(
		context.context,
		context.jellyfish.sessions.admin,
		`${userCard.slug}@${userCard.version}`, [
			{
				op: 'add',
				path: '/data/oauth',
				value: {}
			},
			{
				op: 'add',
				path: '/data/oauth/outreach',
				value: OAUTH_DETAILS
			}
		], {
			type: 'user'
		})
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
	cards: [ 'email-sequence' ],
	before,
	integration: require('../../../lib/integrations/outreach'),
	scenarios: require('./webhooks/outreach'),
	slices: _.range(0, 50),
	baseUrl: 'https://api.outreach.io',
	stubRegex: /.*/,
	source: 'outreach',
	options: {
		token: TOKEN
	},
	isAuthorized: (self, request) => {
		return request.headers.authorization === `Bearer ${OAUTH_DETAILS.access_token}`
	}
})
