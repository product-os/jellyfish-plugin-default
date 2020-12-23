/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const combinatorics = require('js-combinatorics/commonjs/combinatorics')
const {
	v4: uuid
} = require('uuid')
const coreMixins = require('@balena/jellyfish-core/lib/cards/mixins')
const getCards = require('../../lib/cards')

exports.loadDefaultCards = () => {
	return getCards(coreMixins)
}

exports.generateRandomID = () => {
	return uuid()
}

exports.generateRandomSlug = (options = {}) => {
	const slug = exports.generateRandomID()
	if (options.prefix) {
		return `${options.prefix}-${slug}`
	}

	return slug
}

exports.PermutationCombination = class PermutationCombination {
	constructor (seed) {
		this.seed = [ ...seed ]
	}

	[Symbol.iterator] () {
		return (function *(it) {
			// eslint-disable-next-line id-length
			for (let index = 1, l = it.length; index <= l; index++) {
				yield * new combinatorics.Permutation(it, index)
			}
		}(this.seed))
	}
}
