/*
 * This file was automatically generated by 'npm run types'.
 *
 * DO NOT MODIFY IT BY HAND!
 */

// tslint:disable: array-type

import type { Contract, ContractDefinition } from 'autumndb';

export type Empathy = 1 | 0 | -1;
export type TechnicalKnowledge = 1 | 0 | -1;
export type Process = 1 | 0 | -1;
export type Grammar = 1 | 0 | -1;
export type GoingTheExtraMile = 1 | 0 | -1;

export interface FeedbackItemData {
	feedback: {
		empathy?: Empathy;
		knowledge?: TechnicalKnowledge;
		process?: Process;
		grammar?: Grammar;
		effort?: GoingTheExtraMile;
		notes?: string;
		[k: string]: unknown;
	};
	[k: string]: unknown;
}

export interface FeedbackItemContractDefinition
	extends ContractDefinition<FeedbackItemData> {}

export interface FeedbackItemContract extends Contract<FeedbackItemData> {}
