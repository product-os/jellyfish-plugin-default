/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { JellyfishPluginBase } from '@balena/jellyfish-plugin-base';
import { actions } from './actions';
import { cards } from './cards';
import { mixins } from './cards/mixins';
export const cardMixins = mixins;

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
			mixins,
			cards,
			actions,
		});
	}
}
