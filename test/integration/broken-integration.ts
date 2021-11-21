import * as typedErrors from 'typed-errors';

// tslint:disable-next-line: no-var-requires
const NoOpIntegration = require('./noop-integration');

const TranslateError = typedErrors.makeTypedError('TranslateError');

module.exports = class BrokenIntegration extends NoOpIntegration {
	constructor(options: any) {
		super(options);
		BrokenIntegration.instance = this;
	}

	async translate() {
		throw new TranslateError('Foo Bar');
	}
};
