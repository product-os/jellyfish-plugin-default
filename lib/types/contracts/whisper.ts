/*
 * This file was automatically generated by 'npm run types'.
 *
 * DO NOT MODIFY IT BY HAND!
 */

// tslint:disable: array-type

import type { Contract, ContractDefinition } from 'autumndb';

export interface WhisperData {
	timestamp: string;
	target: string;
	actor: string;
	payload: {
		reactions?: {
			[k: string]: unknown;
		};
		mentionsUser?: string[];
		alertsUser?: string[];
		mentionsGroup?: string[];
		alertsGroup?: string[];
		file?: {
			name?: string;
			mime?: string;
			bytesize?: number;
			slug?: string;
			[k: string]: unknown;
		};
		message: string;
		[k: string]: unknown;
	};
	edited_at?: string;
	/**
	 * Users that have seen this message
	 */
	readBy?: string[];
	[k: string]: unknown;
}

export interface WhisperContractDefinition
	extends ContractDefinition<WhisperData> {}

export interface WhisperContract extends Contract<WhisperData> {}
