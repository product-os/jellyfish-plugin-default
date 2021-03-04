/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const environment = require('@balena/jellyfish-environment')

module.exports = () => {
	return {
		slug: 'oauth-client-balena-api',
		type: 'oauth-client@1.0.0',
		name: 'Balena oauth client',
		data: {
			clientId: environment.integration['balena-api'].appId,
			clientSecret: environment.integration['balena-api'].appSecret
		}
	}
}
