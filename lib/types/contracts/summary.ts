/*
 * This file was automatically generated by 'npm run types'.
 *
 * DO NOT MODIFY IT BY HAND!
 */

// tslint:disable: array-type

import type { Contract, ContractDefinition } from 'autumndb';

export interface SummaryData {
	timestamp: string;
	actor: string;
	payload: {
		mentionsUser?: string[];
		alertsUser?: string[];
		mentionsGroup?: string[];
		alertsGroup?: string[];
		message: string;
		[k: string]: unknown;
	};
	/**
	 * Users that have seen this summary
	 */
	readBy?: string[];
	[k: string]: unknown;
}

export interface SummaryContractDefinition
	extends ContractDefinition<SummaryData> {}

export interface SummaryContract extends Contract<SummaryData> {}