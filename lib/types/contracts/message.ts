/*
 * This file was automatically generated by 'npm run types'.
 *
 * DO NOT MODIFY IT BY HAND!
 */

// tslint:disable: array-type

import type { Contract, ContractDefinition } from 'autumndb';

export interface MessageData {
	timestamp: string;
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
		attachments?: {
			url: string;
			name: string;
			mime: string;
			bytesize: number;
			[k: string]: unknown;
		}[];
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

export interface MessageContractDefinition
	extends ContractDefinition<MessageData> {}

export interface MessageContract extends Contract<MessageData> {}
