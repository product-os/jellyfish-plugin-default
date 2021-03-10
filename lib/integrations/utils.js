/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const _ = require('lodash')

/**
 * @summary Convert to slug-compatible string
 * @function
 * @private
 *
 * @param {String} string - string to convert
 * @returns {String} slugified string
 */
exports.slugify = (string) => {
	return string
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, '-')
		.replace(/-{1,}/g, '-')
}

/**
 * @summary Get a date object from an epoch number
 * @function
 * @private
 *
 * @param {Number} epoch - epoch date
 * @returns {Date} date object
 */
exports.getDateFromEpoch = (epoch) => {
	return new Date(epoch * 1000)
}

exports.attachCards = (date, fromCard, toCard, options) => {
	return {
		time: date,
		actor: options.actor,
		card: {
			slug: `link-${fromCard.slug}-is-attached-to-${toCard.slug}`,
			type: 'link@1.0.0',
			name: 'is attached to',
			data: {
				inverseName: 'has attached element',
				from: {
					id: fromCard.id,
					type: fromCard.type
				},
				to: {
					id: toCard.id,
					type: toCard.type
				}
			}
		}
	}
}

exports.postEvent = (sequence, eventCard, targetCard, options) => {
	if (!eventCard) {
		return []
	}

	const date = new Date(eventCard.data.timestamp)
	return [
		{
			time: date,
			actor: options.actor,
			card: eventCard
		},
		exports.attachCards(date, {
			id: {
				$eval: `cards[${sequence.length}].id`
			},
			slug: eventCard.slug,
			type: eventCard.type
		}, {
			id: eventCard.data.target,
			slug: targetCard.slug,
			type: targetCard.type
		}, {
			actor: options.actor
		})
	]
}

exports.isEmail = (string) => {
	return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(string)
}

// TODO: This code is copied from ui-components, deduplicate asap.
// --->
exports.createPrefixRegExp = (prefix) => {
	const regExp = new RegExp(`(\\s|^)((${prefix})[a-z\\d-_\\/]+(\\.[a-z\\d-_\\/]+)*)`, 'gmi')
	return regExp
}

exports.findWordsByPrefix = (prefix, source) => {
	const regExp = exports.createPrefixRegExp(prefix)
	return _.invokeMap(_.compact(source.match(regExp)), 'trim')
}

exports.getSlugsByPrefix = (prefix, source, replacement = '') => {
	const words = exports.findWordsByPrefix(prefix, source)

	return _.uniq(words.map((name) => {
		return name.trim().replace(prefix, replacement)
	}))
}

exports.getMessageMetaData = (message) => {
	return {
		tags: exports.findWordsByPrefix('#', message).map((tag) => {
			return tag.slice(1).toLowerCase()
		}),
		payload: {
			mentionsUser: exports.getSlugsByPrefix('@', message, 'user-'),
			alertsUser: exports.getSlugsByPrefix('!', message, 'user-'),
			mentionsGroup: exports.getSlugsByPrefix('@@', message),
			alertsGroup: exports.getSlugsByPrefix('!!', message),
			message
		}
	}
}

// <---
