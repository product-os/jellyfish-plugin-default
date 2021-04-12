/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const environment = require('@balena/jellyfish-environment').defaultEnvironment

const scopes = [
	'prospects.all',
	'sequences.all',
	'sequenceStates.all',
	'sequenceSteps.all',
	'sequenceTemplates.all',
	'mailboxes.all',
	'webhooks.all'
]

module.exports = () => {
	return {
		slug: 'oauth-client-outreach',
		type: 'oauth-client@1.0.0',
		name: 'Outreach oauth client',
		data: {
			clientId: environment.integration.outreach.appId,
			clientSecret: environment.integration.outreach.appSecret,
			scope: scopes.join('+'),
			redirectUrl: `${environment.oauth.redirectBaseUrl}/oauth/outreach`
		}
	}
}
