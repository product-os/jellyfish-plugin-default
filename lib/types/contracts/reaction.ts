import type {
	Contract,
	ContractDefinition,
} from '@balena/jellyfish-types/build/core';

export interface ReactionData {
	reaction: string;
}

export interface ReactionContractDefinition
	extends ContractDefinition<ReactionData> {}

export interface ReactionContract extends Contract<ReactionData> {}
