/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const _ = require('lodash')
const environment = require('@balena/jellyfish-environment').defaultEnvironment
const errors = require('@balena/jellyfish-sync/build/errors')
const ava = require('ava')
const nock = require('nock')
const {
	v4: uuidv4
} = require('uuid')
const Front = require('./front')
const fs = require('fs')
const os = require('os')
const path = require('path')
const FormData = require('form-data')
const axios = require('axios')

ava.serial.before((test) => {
	test.context = {
		file: {
			slug: uuidv4(),
			path: path.join(os.tmpdir(), `${uuidv4()}.txt`),
			content: uuidv4()
		}
	}
	fs.writeFileSync(test.context.file.path, test.context.file.content)
})

ava.serial.after((test) => {
	fs.unlinkSync(test.context.file.path)
})

// Skip non-nocked test by default locally
const avaTest = environment.test.integration.skip ? ava.serial.skip : ava.serial

ava.serial('getFile() should download file (nock)', async (test) => {
	const options = {
		token: environment.integration.front,
		errors
	}
	const instance = new Front(options)

	nock('https://api2.frontapp.com', {
		reqheaders: {
			Authorization: `Bearer ${options.token.api}`
		}
	}).get(`/download/${test.context.file.slug}`).reply(200, test.context.file.content)

	const result = await instance.getFile(test.context.file.slug)
	test.is(result.toString(), test.context.file.content)

	nock.cleanAll()
})

avaTest('getFile() should download file', async (test) => {
	const options = {
		token: environment.integration.front,
		errors
	}
	const instance = new Front(options)

	// Get test channel
	const channels = await axios.get('https://api2.frontapp.com/channels', {
		headers: {
			Authorization: `Bearer ${options.token.api}`,
			Accept: 'application/json'
		}
	})

	// eslint-disable-next-line no-underscore-dangle
	const channel = _.find(channels.data._results, {
		name: 'Test Channel'
	})

	// Upload attachment with a message
	const form = new FormData()
	form.append('subject', 'attachment test')
	form.append('to[0]', 'test@foo.bar')
	form.append('sender_name', 'test')
	form.append('body', '<p>Test message body</p>')
	form.append('attachments[0]', fs.createReadStream(test.context.file.path))
	const message = await axios.post(`https://api2.frontapp.com/channels/${channel.id}/messages`, form, {
		headers: Object.assign({}, form.getHeaders(), {
			Authorization: `Bearer ${options.token.api}`
		})
	})

	// Download attachment
	const url = message.data.attachments[0].url
	const fileSlug = url.substring(url.lastIndexOf('/') + 1)
	const download = await instance.getFile(fileSlug)
	test.is(download.toString(), test.context.file.content)
})
