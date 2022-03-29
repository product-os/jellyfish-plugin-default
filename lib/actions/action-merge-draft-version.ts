import * as assert from '@balena/jellyfish-assert';
import { getLogger } from '@balena/jellyfish-logger';
import type {
	Contract,
	ContractSummary,
	TypeContract,
} from '@balena/jellyfish-types/build/core';
import {
	ActionDefinition,
	errors as workerErrors,
	WorkerContext,
} from '@balena/jellyfish-worker';
import _ from 'lodash';
import * as semver from 'semver';
import { retagArtifact } from './registry';

const logger = getLogger(__filename);

const mergeLinkVerb = 'was merged as';
const mergeLinkInverseVerb = 'was merged from';
const repoLinkVerb = 'contains';
const repoLinkInverseVerb = 'is contained in';
interface MergeableData {
	$transformer: {
		parentMerged: boolean;
		mergeable: boolean;
		merged: boolean;
		mergeConfirmed: boolean;
		artifactReady?: any;
	};
	[k: string]: unknown;
}

/**
 * Takes in a draft version of a contract (e.g. 1.0.1-alpha1+rev1) and
 * creates a copy of the contract as its final equivalent (i.e. 1.0.1+rev1)
 * and also links any existing artifacts to this new contract
 */
export const actionMergeDraftVersion: ActionDefinition = {
	contract: {
		slug: 'action-merge-draft-version',
		version: '1.0.0',
		type: 'action@1.0.0',
		name: 'Merge a draft version to its final version',
		data: {
			filter: {
				type: 'object',
			},
			arguments: {},
		},
	},
	handler: async (session, context, contract, request) => {
		logger.info(request.logContext, 'merging draft version', {
			slug: contract.slug,
			version: contract.version,
		});

		assert.USER(
			request.logContext,
			semver.prerelease(contract.version),
			workerErrors.WorkerNoElement,
			`Not a draft version: ${contract.version}`,
		);

		const typeContract = (await context.getCardBySlug(
			session,
			contract.type,
		))! as TypeContract;

		assert.USER(
			request.logContext,
			typeContract,
			workerErrors.WorkerNoElement,
			`No such type: ${contract.type}`,
		);

		// TS-TODO: fix type confusion
		const contractData = contract.data as unknown as MergeableData;
		const previousArtifactReady = contractData.$transformer.artifactReady;

		// * create deep copy of contract *without* data.$transformer (TODO check this) and version finalized
		// * insert contract
		// * link artifacts
		// * update contract with artifactReady=true (need to do this as two steps for docker registry permission checks)
		// * link contracts with 'was merged as'

		const finalVersionContract = _.cloneDeep(
			contract,
		) as unknown as Contract<MergeableData>;
		Reflect.deleteProperty(finalVersionContract, 'id');
		if (previousArtifactReady) {
			finalVersionContract.data.$transformer.artifactReady = false;
		}
		finalVersionContract.version = makeFinal(contract.version);

		// TODO check if final version already exists

		const insertedFinalContract = (await context.insertCard(
			session,
			typeContract,
			{
				timestamp: request.timestamp,
				actor: request.actor,
				originator: request.originator,
				attachEvents: true,
			},
			finalVersionContract,
		))!;
		finalVersionContract.id = insertedFinalContract.id;

		if (previousArtifactReady) {
			// NOTE
			// This action is doing too much. Mostly because of the weak integration between the registry artifacts
			// and the contracts. Also the explicit support for the local env stems from that

			const sessionContract = (await context.getCardById(session, session))!;
			const actorContract = (await context.getCardById(
				session,
				sessionContract.data.actor as any,
			))!;
			await retagArtifact(
				request.logContext,
				contract,
				finalVersionContract,
				actorContract.slug,
				session,
			);

			// this should be used, but as that string typically contains artifact references
			// it would be inconsistent to keep draft versions in there
			const newArtifactReady =
				typeof previousArtifactReady === 'string'
					? previousArtifactReady.replace(
							contract.version,
							finalVersionContract.version,
					  )
					: previousArtifactReady;

			await context.patchCard(
				session,
				typeContract,
				{
					timestamp: request.timestamp,
					actor: request.actor,
					originator: request.originator,
					attachEvents: true,
				},
				finalVersionContract,
				[
					{
						op: 'replace',
						path: '/data/$transformer/artifactReady',
						value: newArtifactReady,
					},
				],
			);
		}

		await linkContracts(
			context,
			session,
			request,
			contract,
			insertedFinalContract,
			mergeLinkVerb,
			mergeLinkInverseVerb,
		);

		const [contractRepo] = await context.query(
			session,
			{
				type: 'object',
				required: ['type'],
				additionalProperties: true,
				properties: {
					type: {
						type: 'string',
						const: 'contract-repository@1.0.0',
					},
				},
				$$links: {
					[repoLinkVerb]: {
						type: 'object',
						properties: {
							id: {
								type: 'string',
								const: contract.id,
							},
						},
					},
				},
			},
			{},
		);

		if (contractRepo) {
			await linkContracts(
				context,
				session,
				request,
				contractRepo,
				insertedFinalContract,
				repoLinkVerb,
				repoLinkInverseVerb,
			);
		}

		const result = insertedFinalContract;

		return {
			id: result.id,
			type: result.type,
			version: result.version,
			slug: result.slug,
		};
	},
};

// node-semver ignores build meta-data in its .toString() ...
const makeFinal = (version: string): string => {
	const v = semver.parse(version);
	if (!v) {
		throw new Error(`semver parsing failed: ${version}`);
	}
	const build = v.build.length ? `+${v.build.join('.')}` : '';
	return `${v.major}.${v.minor}.${v.patch}${build}`;
};

const linkContracts = async (
	context: WorkerContext,
	session: string,
	request: any,
	contract: ContractSummary,
	insertedFinalContract: ContractSummary,
	verb: string,
	inverseVerb: string,
) => {
	const linkTypeContract = (await context.getCardBySlug(
		session,
		'link@1.0.0',
	))! as TypeContract;
	assert.INTERNAL(
		request.logContext,
		linkTypeContract,
		workerErrors.WorkerNoElement,
		'No such type: link',
	);

	await context.insertCard(
		session,
		linkTypeContract,
		{
			timestamp: request.timestamp,
			actor: request.actor,
			originator: request.originator,
			attachEvents: true,
		},
		{
			slug: await context.getEventSlug('link'),
			type: 'link@1.0.0',
			name: verb,
			data: {
				inverseName: inverseVerb,
				from: {
					id: contract.id,
					slug: contract.slug,
					type: contract.type,
				},
				to: {
					id: insertedFinalContract.id,
					slug: insertedFinalContract.slug,
					type: insertedFinalContract.type,
				},
			},
		},
	);
};
