import { testUtils as coreTestUtils } from '@balena/jellyfish-core';
import type { Contract } from '@balena/jellyfish-types/build/core';
import {
	ActionDefinition,
	PluginDefinition,
	testUtils as workerTestUtils,
} from '@balena/jellyfish-worker';
import _ from 'lodash';

/**
 * Context that can be used in tests using plugin-default.
 */
export interface TestContext extends workerTestUtils.TestContext {
	createSupportThread: (
		actor: string,
		session: string,
		name: string | null,
		data: any,
		markers?: any,
	) => Promise<Contract>;
	createMessage: (
		actor: string,
		session: string,
		target: Contract,
		body: string,
	) => Promise<Contract>;
	createWhisper: (
		actor: string,
		session: string,
		target: Contract,
		body: string,
	) => Promise<Contract>;
}

/**
 * Options accepted by `newContext`.
 */
export interface NewContextOptions extends coreTestUtils.NewContextOptions {
	/**
	 * Set of plugins needed to run tests.
	 */
	plugins?: PluginDefinition[];
	actions?: ActionDefinition[];
}

/**
 * Create a new `TestContext` with helper utilities.
 */
export const newContext = async (
	options: NewContextOptions = {},
): Promise<TestContext> => {
	const workerTestContext = await workerTestUtils.newContext(options);

	const createSupportThread = async (
		actor: string,
		session: string,
		name: string | null,
		data: any,
		markers = [],
	) => {
		return workerTestContext.createContract(
			actor,
			session,
			'support-thread@1.0.0',
			name,
			data,
			markers,
		);
	};

	const createMessage = (
		actor: string,
		session: string,
		target: Contract,
		body: string,
	) => {
		return workerTestContext.createEvent(
			actor,
			session,
			target,
			body,
			'message',
		);
	};

	const createWhisper = (
		actor: string,
		session: string,
		target: Contract,
		body: string,
	) => {
		return workerTestContext.createEvent(
			actor,
			session,
			target,
			body,
			'whisper',
		);
	};

	return {
		createSupportThread,
		createMessage,
		createWhisper,
		...workerTestContext,
	};
};

/**
 * Deinitialize the worker.
 */
export const destroyContext = async (context: TestContext) => {
	await workerTestUtils.destroyContext(context);
};
