/*
 * This file was automatically generated by 'npm run types'.
 *
 * DO NOT MODIFY IT BY HAND!
 */

// tslint:disable: array-type

import type { Contract, ContractDefinition } from 'autumndb';

export type Status = 'draft' | 'candidate' | 'complete';

export interface WorkflowData {
	lifecycle?: string;
	description?: string;
	diagram?: string;
	participants?: unknown[];
	mentionsUser?: unknown[];
	alertsUser?: unknown[];
	mentionsGroup?: unknown[];
	alertsGroup?: unknown[];
	status: Status;
	[k: string]: unknown;
}

export interface WorkflowContractDefinition
	extends ContractDefinition<WorkflowData> {}

export interface WorkflowContract extends Contract<WorkflowData> {}
