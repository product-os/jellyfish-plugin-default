/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const ava = require('ava')
const nock = require('nock')
const {
	v4: uuid
} = require('uuid')
const {
	syncIntegrationScenario
} = require('@balena/jellyfish-test-harness')
const ActionLibrary = require('@balena/jellyfish-action-library')
const DefaultPlugin = require('../../../lib')
const environment = require('@balena/jellyfish-environment').defaultEnvironment
const TOKEN = environment.integration.discourse

syncIntegrationScenario.run({
	test: ava.serial,
	before: ava.before,
	beforeEach: ava.beforeEach,
	after: ava.after.always,
	afterEach: ava.afterEach.always
}, {
	basePath: __dirname,
	plugins: [ ActionLibrary, DefaultPlugin ],
	cards: [ 'support-thread', 'message', 'whisper' ],
	integration: require('../../../lib/integrations/discourse'),
	scenarios: require('./webhooks/discourse'),
	baseUrl: 'https://forums.balena.io',
	stubRegex: /.*/,
	source: 'discourse',
	options: {
		token: TOKEN
	},
	isAuthorized: (self, request) => {
		return request.headers['api-key'] === self.options.token.api &&
			request.headers['api-username'] === self.options.token.username
	}
})

ava.serial('should not change the same user email', async (test) => {
	await test.context.jellyfish.insertCard(
		test.context.context, test.context.session, {
			slug: 'user-jviotti',
			type: 'user@1.0.0',
			version: '1.0.0',
			data: {
				email: 'juan@resin.io',
				hash: 'PASSWORDLESS',
				roles: []
			}
		})

	nock('https://forums.balena.io')
		.get('/admin/users/4.json')
		.reply(200,
			require('./webhooks/discourse/inbound-tag-tag/stubs/1/admin-users-4-json.json'))

	nock('https://forums.balena.io')
		.get('/t/6061.json')
		.query({
			print: true,
			include_raw: 1
		})
		.reply(200,
			require('./webhooks/discourse/inbound-tag-tag/stubs/1/t-6061-json-print-true-include-raw-1.json'))

	nock('https://forums.balena.io')
		.get('/categories.json')
		.reply(200,
			require('./webhooks/discourse/inbound-tag-tag/stubs/1/categories-json.json'))

	nock('https://forums.balena.io')
		.get('/posts/33998.json')
		.reply(200,
			require('./webhooks/discourse/inbound-tag-tag/stubs/1/posts-33998-json.json'))

	for (const externalEvent of [
		Object.assign({}, require('./webhooks/discourse/inbound-tag-tag/01.json'), {
			source: 'discourse'
		})
	]) {
		const event = await test.context.jellyfish.insertCard(test.context.context,
			test.context.session, {
				type: 'external-event@1.0.0',
				slug: `external-event-${uuid()}`,
				version: '1.0.0',
				data: externalEvent
			})

		const request = await test.context.queue.producer.enqueue(
			test.context.worker.getId(),
			test.context.session, {
				context: test.context.context,
				action: 'action-integration-import-event@1.0.0',
				card: event.id,
				type: event.type,
				arguments: {}
			})

		await test.context.flush(test.context.session)
		const result = await test.context.queue.producer.waitResults(
			test.context.context, request)
		test.false(result.error)
	}

	const user = await test.context.jellyfish.getCardBySlug(
		test.context.context, test.context.session, 'user-jviotti@latest')

	test.true(user.active)
	test.deepEqual(user.data, {
		email: 'juan@resin.io',
		hash: 'PASSWORDLESS',
		roles: [],
		profile: {
			title: 'Software Engineer',
			name: {
				first: 'Juan'
			}
		}
	})
})

ava.serial('should add a new e-mail to a user', async (test) => {
	await test.context.jellyfish.insertCard(
		test.context.context, test.context.session, {
			slug: 'user-jviotti',
			type: 'user@1.0.0',
			version: '1.0.0',
			data: {
				email: 'foo@bar.com',
				hash: 'PASSWORDLESS',
				roles: []
			}
		})

	nock('https://forums.balena.io')
		.get('/admin/users/4.json')
		.reply(200,
			require('./webhooks/discourse/inbound-tag-tag/stubs/1/admin-users-4-json.json'))

	nock('https://forums.balena.io')
		.get('/t/6061.json')
		.query({
			print: true,
			include_raw: 1
		})
		.reply(200,
			require('./webhooks/discourse/inbound-tag-tag/stubs/1/t-6061-json-print-true-include-raw-1.json'))

	nock('https://forums.balena.io')
		.get('/categories.json')
		.reply(200,
			require('./webhooks/discourse/inbound-tag-tag/stubs/1/categories-json.json'))

	nock('https://forums.balena.io')
		.get('/posts/33998.json')
		.reply(200,
			require('./webhooks/discourse/inbound-tag-tag/stubs/1/posts-33998-json.json'))

	for (const externalEvent of [
		Object.assign({}, require('./webhooks/discourse/inbound-tag-tag/01.json'), {
			source: 'discourse'
		})
	]) {
		const event = await test.context.jellyfish.insertCard(test.context.context,
			test.context.session, {
				type: 'external-event@1.0.0',
				slug: `external-event-${uuid()}`,
				version: '1.0.0',
				data: externalEvent
			})

		const request = await test.context.queue.producer.enqueue(
			test.context.worker.getId(),
			test.context.session, {
				context: test.context.context,
				action: 'action-integration-import-event@1.0.0',
				card: event.id,
				type: event.type,
				arguments: {}
			})

		await test.context.flush(test.context.session)
		const result = await test.context.queue.producer.waitResults(
			test.context.context, request)
		test.false(result.error)
	}

	const user = await test.context.jellyfish.getCardBySlug(
		test.context.context, test.context.session, 'user-jviotti@latest')

	test.true(user.active)
	test.deepEqual(user.data, {
		email: [ 'foo@bar.com', 'juan@resin.io' ],
		roles: [],
		hash: 'PASSWORDLESS',
		profile: {
			title: 'Software Engineer',
			name: {
				first: 'Juan'
			}
		}
	})
})
