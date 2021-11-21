// tslint:disable-next-line: no-var-requires
const NoOpIntegration = require('./noop-integration');

module.exports = class TestIntegration extends NoOpIntegration {
	constructor(options: any) {
		super(options);
		TestIntegration.instance = this;
	}
};
