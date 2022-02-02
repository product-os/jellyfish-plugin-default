import type { IntegrationDefinition, Map } from '@balena/jellyfish-worker';
import { FoobarIntegration, foobarIntegrationDefinition } from './foobar';

export { FoobarIntegration };

export const integrationMap: Map<IntegrationDefinition> = {
	foobar: foobarIntegrationDefinition,
};
