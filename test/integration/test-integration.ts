/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

// tslint:disable-next-line: no-var-requires
const NoOpIntegration = require('./noop-integration');

module.exports = class TestIntegration extends NoOpIntegration {
	constructor(options: any) {
		super(options);
		TestIntegration.instance = this;
	}
};
