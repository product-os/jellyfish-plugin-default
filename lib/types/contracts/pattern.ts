/*
 * This file was automatically generated by 'npm run types'.
 *
 * DO NOT MODIFY IT BY HAND!
 */

// tslint:disable: array-type

import type { Contract, ContractDefinition } from 'autumndb';

/**
 * Known workaround that can be used while a definitive solution does not yet exist
 */
export type TemporarySolution = string;
export type ImprovementsProgress = number;
export type Status =
	| 'open'
	| 'brainstorming'
	| 'improvement-in-progress'
	| 'partially-resolved'
	| 'resolved-pending-review'
	| 'closed-resolved'
	| 'closed-unresolved';

export interface PatternData {
	description?: string;
	temporarySolution?: TemporarySolution;
	improvementsPercentComplete?: ImprovementsProgress;
	/**
	 * How active the pattern is
	 */
	weight?: number;
	participants?: unknown[];
	mentionsUser?: unknown[];
	alertsUser?: unknown[];
	mentionsGroup?: unknown[];
	alertsGroup?: unknown[];
	status: Status;
	[k: string]: unknown;
}

export interface PatternContractDefinition
	extends ContractDefinition<PatternData> {}

export interface PatternContract extends Contract<PatternData> {}
