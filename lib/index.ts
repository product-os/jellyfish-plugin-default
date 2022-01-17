import { JellyfishPluginBase } from '@balena/jellyfish-plugin-base';
import { cards } from './cards';
import { actions } from './actions';

// tslint:disable-next-line: no-var-requires
const { version } = require('../package.json');

/**
 * The default Jellyfish plugin.
 */
export class DefaultPlugin extends JellyfishPluginBase {
	constructor() {
		super({
			slug: 'jellyfish-plugin-default',
			name: 'Default Jellyfish Plugin',
			version,
			cards,
			actions,
		});
	}
}
