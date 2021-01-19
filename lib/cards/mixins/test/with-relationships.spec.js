/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const _ = require('lodash')
const ava = require('ava')
const sinon = require('sinon')
const linkConstraints = require('@balena/jellyfish-client-sdk/lib/link-constraints')
const withRelationships = require('../with-relationships')

const expected = require('./fixtures/expected.json')
const expectedFiltered = require('./fixtures/expected-filtered.json')
const card = require('./fixtures/01.json')
const fakeConstraints = require('./fixtures/constraints-subset')

ava('withRelationships adds correct relations to card', async (test) => {
	sinon.stub(linkConstraints, 'constraints').returns(fakeConstraints)
	const relationships = withRelationships(card.slug)
	const cardWithRelationships = _.merge({}, card, relationships)

	test.deepEqual(cardWithRelationships, expected)
})

ava('withRelationships excludes relationships to any specified card types', async (test) => {
	sinon.stub(linkConstraints, 'constraints').returns(fakeConstraints)
	const relationships = withRelationships(card.slug, [ 'support-issue', 'sales-thread' ])
	const cardWithRelationships = _.merge({}, card, relationships)
	test.deepEqual(cardWithRelationships, expectedFiltered)
})
