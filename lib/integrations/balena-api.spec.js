/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const errors = require('@balena/jellyfish-sync/build/errors')
const ava = require('ava')
const nock = require('nock')
const {
	v4: uuidv4
} = require('uuid')
const integration = require('./balena-api')

const context = {
	id: `TEST-${uuidv4()}`
}

ava('whoami() should get and return user information', async (test) => {
	const credentials = {
		token_type: uuidv4(),
		access_token: uuidv4()
	}
	const response = {
		id: 1234,
		username: 'foobar',
		email: 'foo@bar.baz'
	}

	nock(integration.OAUTH_BASE_URL, {
		reqheaders: {
			Authorization: `${credentials.token_type} ${credentials.access_token}`
		}
	}).get('/user/v1/whoami').reply(200, response)

	const result = await integration.whoami(context, credentials, {
		errors
	})
	test.deepEqual(result, response)
})
