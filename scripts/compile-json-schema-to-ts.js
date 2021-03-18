/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const fs = require('fs')
const path = require('path')
const {
	compile
} = require('json-schema-to-typescript')
const coreMixins = require('@balena/jellyfish-core/lib/cards/mixins')
const DefaultPlugin = require('../lib')

const context = {
	id: 'jellyfish-plugin-default-generate-types'
}

const defaultPlugin = new DefaultPlugin()
const cards = defaultPlugin.getCards(context, coreMixins)
const DIR = path.resolve(__dirname, '../lib/types')

const generate = async () => {
	// Clear the directory
	try {
		await fs.promises.rmdir(DIR, {
			recursive: true
		})
	} catch (err) {
		if (err.name !== 'ENOENT') {
			throw err
		}
	}

	// Recreate the directory
	await fs.promises.mkdir(DIR)

	// Generate files
	await Promise.all(
		Object.entries(cards)
			.filter(([ , card ]) => {
				return card.type === 'type@1.0.0'
			})
			.map(async ([ slug, card ]) => {
				const compiled = await compile({
					title: slug,
					...card.data.schema
				})

				const filePath = `${DIR}/${slug}.d.ts`
				await fs.promises.writeFile(filePath, compiled)
			})
	)
}

generate()
