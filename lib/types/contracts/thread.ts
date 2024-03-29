/*
 * This file was automatically generated by 'npm run types'.
 *
 * DO NOT MODIFY IT BY HAND!
 */

// tslint:disable: array-type

import type { Contract, ContractDefinition } from 'autumndb';

export interface ThreadData {
	description?: string;
	participants?: unknown[];
	mentionsUser?: unknown[];
	alertsUser?: unknown[];
	mentionsGroup?: unknown[];
	alertsGroup?: unknown[];
	[k: string]: unknown;
}

export interface ThreadContractDefinition
	extends ContractDefinition<ThreadData> {}

export interface ThreadContract extends Contract<ThreadData> {}
