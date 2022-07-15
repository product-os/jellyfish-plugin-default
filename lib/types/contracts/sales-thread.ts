/*
 * This file was automatically generated by 'npm run types'.
 *
 * DO NOT MODIFY IT BY HAND!
 */

// tslint:disable: array-type

import type { Contract, ContractDefinition } from 'autumndb';

export type CurrentStatus = string;
export type Status = 'open' | 'closed' | 'archived';

export interface SalesThreadData {
	tags?: string[];
	mirrors?: string[];
	inbox?: string;
	statusDescription?: CurrentStatus;
	status: Status;
	[k: string]: unknown;
}

export interface SalesThreadContractDefinition
	extends ContractDefinition<SalesThreadData> {}

export interface SalesThreadContract extends Contract<SalesThreadData> {}