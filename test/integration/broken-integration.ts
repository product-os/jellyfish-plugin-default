import { TypedError } from 'typed-error';

// tslint:disable-next-line: no-var-requires
const NoOpIntegration = require('./noop-integration');

class TranslateError extends TypedError {}

module.exports = class BrokenIntegration extends NoOpIntegration {
	constructor(options: any) {
		super(options);
		BrokenIntegration.instance = this;
	}

	async translate() {
		throw new TranslateError('Foo Bar');
	}
};
