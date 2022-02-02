import type { PluginDefinition } from '@balena/jellyfish-worker';
import { actions } from './actions';
import { contracts } from './contracts';
export * as testUtils from './test-utils';

// tslint:disable-next-line: no-var-requires
const { version } = require('../package.json');

/**
 * The default Jellyfish plugin.
 */
export const defaultPlugin = (): PluginDefinition => {
	return {
		slug: 'plugin-default',
		name: 'Default Jellyfish Plugin',
		version,
		actions,
		contracts,
	};
};
