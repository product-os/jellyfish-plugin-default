/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const environment = require('@balena/jellyfish-environment').defaultEnvironment
const errors = require('@balena/jellyfish-sync/build/errors')
const ava = require('ava')
const nock = require('nock')
const {
	v4: uuidv4
} = require('uuid')
const Front = require('./front')

ava('getFile() should download file', async (test) => {
	const file = {
		slug: uuidv4(),
		content: uuidv4()
	}

	const options = {
		token: environment.integration.front,
		errors
	}
	const instance = new Front(options)

	nock('https://api2.frontapp.com', {
		reqheaders: {
			Authorization: `Bearer ${options.token.api}`
		}
	}).get(`/download/${file.slug}`).reply(200, file.content)

	const result = await instance.getFile(file.slug)
	test.is(result.toString(), file.content)
})
