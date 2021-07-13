/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import type { ExtraMixins } from '@balena/jellyfish-plugin-base';
import { asPipelineItem } from './as-pipeline-item';
import { withEvents } from './with-events';

function uiSchemaDef(key: string): string {
	return `node_modules/@balena/jellyfish-core/build/cards/mixins/ui-schema-defs.json#/${key}`;
}

export const mixins: ExtraMixins = {
	uiSchemaDef,
	asPipelineItem,
	withEvents: withEvents({
		uiSchemaDef,
	}),
};
