import * as errors from '@balena/jellyfish-sync/build/errors';
import * as pipeline from '@balena/jellyfish-sync/build/pipeline';
import { syncIntegrationScenario } from '@balena/jellyfish-test-harness';
import type { core } from '@balena/jellyfish-types';
import _ from 'lodash';
import { DefaultPlugin } from '../../lib';

// tslint:disable: no-var-requires
const TestIntegration = require('./test-integration');
const BrokenIntegration = require('./broken-integration');

const context: core.Context = {
	id: 'jellyfish-test-plugin-default',
};

beforeAll(async () => {
	const plugins = [DefaultPlugin];
	const cards = [];
	await syncIntegrationScenario.before(context, plugins, cards);
	await syncIntegrationScenario.save(context);
});

afterAll(async () => {
	await syncIntegrationScenario.after(context);
});

afterEach(async () => {
	await syncIntegrationScenario.afterEach(context);
});

describe('importCards()', () => {
	test('should import no card', async () => {
		const result = await pipeline.importCards(context.syncContext, []);

		expect(result).toEqual([]);
	});

	test('should throw if the type is invalid', async () => {
		expect.assertions(1);

		const sequence = [
			{
				time: new Date(),
				actor: context.actor.id,
				card: {
					slug: 'hello-world',
					type: 'xxxxxxxxxxxxx@1.0.0',
					version: '1.0.0',
					data: {
						test: 1,
					},
				},
			},
		];
		try {
			await pipeline.importCards(context.syncContext, sequence);
		} catch (error) {
			expect(error).toEqual(
				new context.worker.errors.WorkerNoElement(
					`No such type: ${sequence[0].card.type}`,
				),
			);
		}
	});

	test('should import a single card', async () => {
		const result = await pipeline.importCards(context.syncContext, [
			{
				time: new Date(),
				actor: context.actor.id,
				card: {
					slug: 'hello-world',
					type: 'card@1.0.0',
					version: '1.0.0',
					data: {
						test: 1,
					},
				},
			},
		]);

		expect(result).toEqual([
			context.kernel.defaults({
				created_at: result[0].created_at,
				id: result[0].id,
				name: null,
				slug: 'hello-world',
				links: result[0].links,
				type: 'card@1.0.0',
				version: '1.0.0',
				data: {
					test: 1,
				},
			}),
		]);
	});

	test('should patch an existing card', async () => {
		const card = await context.jellyfish.insertCard(
			context.context,
			context.session,
			{
				type: 'card@1.0.0',
				slug: 'foo',
				version: '1.0.0',
				data: {
					test: 1,
				},
			},
		);

		const result = await pipeline.importCards(context.syncContext, [
			{
				time: new Date(),
				actor: context.actor.id,
				card: context.kernel.defaults({
					id: card.id,
					slug: 'foo',
					type: 'card@1.0.0',
					version: '1.0.0',
					active: false,
					data: {
						test: 1,
					},
				}),
			},
		]);

		expect(result).toEqual([
			context.kernel.defaults({
				created_at: card.created_at,
				updated_at: result[0].updated_at,
				id: card.id,
				name: null,
				slug: 'foo',
				type: 'card@1.0.0',
				version: '1.0.0',
				active: false,
				links: result[0].links,
				data: {
					test: 1,
				},
			}),
		]);
	});

	test('should import two independent cards', async () => {
		const result = await pipeline.importCards(context.syncContext, [
			{
				time: new Date(),
				actor: context.actor.id,
				card: {
					type: 'card@1.0.0',
					slug: 'foo',
					version: '1.0.0',
					data: {
						test: 1,
					},
				},
			},
			{
				time: new Date(),
				actor: context.actor.id,
				card: {
					type: 'card@1.0.0',
					slug: 'bar',
					version: '1.0.0',
					data: {
						test: 2,
					},
				},
			},
		]);

		expect(result).toEqual(
			[
				{
					created_at: result[0].created_at,
					id: result[0].id,
					name: null,
					slug: 'foo',
					links: result[0].links,
					type: 'card@1.0.0',
					version: '1.0.0',
					data: {
						test: 1,
					},
				},
				{
					created_at: result[1].created_at,
					id: result[1].id,
					name: null,
					slug: 'bar',
					links: result[1].links,
					type: 'card@1.0.0',
					version: '1.0.0',
					data: {
						test: 2,
					},
				},
			].map(context.kernel.defaults),
		);
	});

	test('should import two parallel cards', async () => {
		const result = await pipeline.importCards(context.syncContext, [
			{
				time: new Date(),
				actor: context.actor.id,
				card: {
					type: 'card@1.0.0',
					slug: 'foo',
					version: '1.0.0',
					data: {
						test: 1,
					},
				},
			},
			{
				time: new Date(),
				actor: context.actor.id,
				card: {
					type: 'card@1.0.0',
					slug: 'bar',
					version: '1.0.0',
					data: {
						test: 2,
					},
				},
			},
		]);

		const sortedResult = _.sortBy(result, 'data.test');

		expect(sortedResult).toEqual(
			[
				{
					created_at: sortedResult[0].created_at,
					id: sortedResult[0].id,
					links: sortedResult[0].links,
					name: null,
					slug: 'foo',
					type: 'card@1.0.0',
					version: '1.0.0',
					data: {
						test: 1,
					},
				},
				{
					created_at: sortedResult[1].created_at,
					id: sortedResult[1].id,
					links: sortedResult[1].links,
					name: null,
					slug: 'bar',
					type: 'card@1.0.0',
					version: '1.0.0',
					data: {
						test: 2,
					},
				},
			].map(context.kernel.defaults),
		);
	});

	test('should import dependent cards', async () => {
		const result = await pipeline.importCards(context.syncContext, [
			{
				time: new Date(),
				actor: context.actor.id,
				card: {
					type: 'card@1.0.0',
					slug: 'foo',
					version: '1.0.0',
					data: {
						test: 1,
					},
				},
			},
			{
				time: new Date(),
				actor: context.actor.id,
				card: {
					type: 'card@1.0.0',
					slug: 'bar',
					version: '1.0.0',
					data: {
						target: {
							$eval: 'cards[0].id',
						},
					},
				},
			},
		]);

		expect(result).toEqual([
			context.kernel.defaults({
				created_at: result[0].created_at,
				id: result[0].id,
				active: true,
				name: null,
				slug: 'foo',
				links: result[0].links,
				markers: [],
				tags: [],
				type: 'card@1.0.0',
				version: '1.0.0',
				data: {
					test: 1,
				},
			}),
			context.kernel.defaults({
				created_at: result[1].created_at,
				id: result[1].id,
				active: true,
				name: null,
				slug: 'bar',
				links: result[1].links,
				markers: [],
				tags: [],
				type: 'card@1.0.0',
				version: '1.0.0',
				data: {
					target: result[0].id,
				},
			}),
		]);
	});

	test('should not throw given string interpolation', async () => {
		const results = await pipeline.importCards(context.syncContext, [
			{
				time: new Date(),
				actor: context.actor.id,
				card: {
					type: 'card@1.0.0',
					slug: 'bar',
					version: '1.0.0',
					data: {
						// eslint-disable-next-line no-template-curly-in-string
						foo: 'Hello ${world}:$foo #{bar}',
					},
				},
			},
		]);

		expect(results).toEqual([
			context.jellyfish.defaults({
				id: results[0].id,
				slug: 'bar',
				created_at: results[0].created_at,
				name: null,
				type: 'card@1.0.0',
				data: {
					// eslint-disable-next-line no-template-curly-in-string
					foo: 'Hello ${world}:$foo #{bar}',
				},
			}),
		]);
	});

	test('should throw if a template does not evaluate', async () => {
		expect.assertions(1);

		try {
			await pipeline.importCards(context.syncContext, [
				{
					time: new Date(),
					actor: context.actor.id,
					card: {
						type: 'card@1.0.0',
						slug: 'foo',
						version: '1.0.0',
						data: {
							test: 1,
						},
					},
				},
				{
					time: new Date(),
					actor: context.actor.id,
					card: {
						type: 'card@1.0.0',
						slug: 'bar',
						version: '1.0.0',
						data: {
							target: {
								$eval: 'cards[0].hello',
							},
						},
					},
				},
			]);
		} catch (error: any) {
			expect(error instanceof errors.SyncInvalidTemplate).toBe(true);
		}
	});

	test('should import a dependent card in parallel segment', async () => {
		const result = await pipeline.importCards(context.syncContext, [
			{
				time: new Date(),
				actor: context.actor.id,
				card: {
					type: 'card@1.0.0',
					slug: 'foo',
					version: '1.0.0',
					data: {
						test: 1,
					},
				},
			},
			[
				{
					time: new Date(),
					actor: context.actor.id,
					card: {
						type: 'card@1.0.0',
						slug: 'bar',
						version: '1.0.0',
						data: {
							test: 2,
						},
					},
				},
				{
					time: new Date(),
					actor: context.actor.id,
					card: {
						type: 'card@1.0.0',
						slug: 'baz',
						version: '1.0.0',
						data: {
							test: 3,
							target: {
								$eval: 'cards[0].id',
							},
						},
					},
				},
			],
		]);

		const sortedResult = _.sortBy(result, 'data.test');

		expect(sortedResult).toEqual(
			[
				{
					created_at: sortedResult[0].created_at,
					id: sortedResult[0].id,
					links: sortedResult[0].links,
					name: null,
					slug: 'foo',
					type: 'card@1.0.0',
					version: '1.0.0',
					data: {
						test: 1,
					},
				},
				{
					created_at: sortedResult[1].created_at,
					id: sortedResult[1].id,
					links: sortedResult[1].links,
					name: null,
					slug: 'bar',
					type: 'card@1.0.0',
					version: '1.0.0',
					data: {
						test: 2,
					},
				},
				{
					created_at: sortedResult[2].created_at,
					id: sortedResult[2].id,
					links: sortedResult[2].links,
					name: null,
					slug: 'baz',
					type: 'card@1.0.0',
					version: '1.0.0',
					data: {
						test: 3,
						target: sortedResult[0].id,
					},
				},
			].map(context.kernel.defaults),
		);
	});

	test('should add create events', async () => {
		const result = await pipeline.importCards(context.syncContext, [
			{
				time: new Date(),
				actor: context.actor.id,
				card: {
					slug: 'hello-world',
					type: 'card@1.0.0',
					version: '1.0.0',
					data: {
						test: 1,
					},
				},
			},
		]);

		const timeline = await context.jellyfish.query(
			context.context,
			context.session,
			{
				type: 'object',
				additionalProperties: true,
				required: ['data'],
				properties: {
					data: {
						type: 'object',
						required: ['target'],
						additionalProperties: true,
						properties: {
							target: {
								type: 'string',
								const: result[0].id,
							},
						},
					},
				},
			},
		);

		expect(timeline.length).toBe(1);
		expect(timeline[0].type).toEqual('create@1.0.0');
	});
});

describe('translateExternalEvent()', () => {
	test('should pass the originator to the sync context', async () => {
		const slug = context.generateRandomSlug({
			prefix: 'external-event',
		});

		const result = await pipeline.translateExternalEvent(
			TestIntegration,
			context.kernel.defaults({
				id: '4a962ad9-20b5-4dd8-a707-bf819593cc84',
				type: 'external-event@1.0.0',
				slug,
				version: '1.0.0',
				data: {
					source: 'test',
					headers: {},
					payload: {
						actor: context.actor.id,
						foo: 'bar',
						bar: 'baz',
					},
				},
			}),
			{
				context: Object.assign({}, context.syncContext, {
					upsertElement: async (type: string, object: any, options: any) => {
						object.data.originator = options.originator;
						return context.syncContext.upsertElement(type, object, options);
					},
				}),
				actor: context.actor.id,
				origin: 'foobar',
				defaultUser: 'foobar',
				provider: 'foobar',
				token: 'foobar',
			},
		);

		expect(result).toEqual([
			context.kernel.defaults({
				created_at: result[0].created_at,
				id: result[0].id,
				slug,
				type: 'card@1.0.0',
				name: null,
				version: '1.0.0',
				links: result[0].links,
				data: {
					origin: result[0].data.origin,
					originator: '4a962ad9-20b5-4dd8-a707-bf819593cc84',
					payload: {
						actor: context.actor.id,
						foo: 'bar',
						bar: 'baz',
					},
				},
			}),
		]);
	});

	test('should translate an external event through the noop integration', async () => {
		const slug = context.generateRandomSlug({
			prefix: 'external-event',
		});

		const result = await pipeline.translateExternalEvent(
			TestIntegration,
			context.kernel.defaults({
				id: '4a962ad9-20b5-4dd8-a707-bf819593cc84',
				type: 'external-event@1.0.0',
				slug,
				version: '1.0.0',
				data: {
					source: 'test',
					headers: {},
					payload: {
						actor: context.actor.id,
						foo: 'bar',
						bar: 'baz',
					},
				},
			}),
			{
				context: context.syncContext,
				actor: context.actor.id,
				origin: 'foobar',
				defaultUser: 'foobar',
				provider: 'foobar',
				token: 'foobar',
			},
		);

		expect(TestIntegration.instance.initialized).toBe(true);
		expect(TestIntegration.instance.destroyed).toBe(true);

		expect(result).toEqual([
			context.kernel.defaults({
				created_at: result[0].created_at,
				id: result[0].id,
				slug,
				type: 'card@1.0.0',
				name: null,
				version: '1.0.0',
				links: result[0].links,
				data: {
					origin: result[0].data.origin,
					payload: {
						actor: context.actor.id,
						foo: 'bar',
						bar: 'baz',
					},
				},
			}),
		]);
	});

	test('should destroy the integration even if there was an import error', async () => {
		expect.hasAssertions();

		try {
			await pipeline.translateExternalEvent(
				TestIntegration,
				context.kernel.defaults({
					id: '4a962ad9-20b5-4dd8-a707-bf819593cc84',
					slug: context.generateRandomSlug({
						prefix: 'external-event',
					}),
					type: 'invalid-type@1.0.0',
					version: '1.0.0',
					data: {
						source: 'test',
						headers: {},
						payload: {
							foo: {
								$eval: 'hello',
							},
							bar: 'baz',
						},
					},
				}),
				{
					context: context.syncContext,
					actor: context.actor.id,
					origin: 'foobar',
					defaultUser: 'foobar',
					provider: 'foobar',
					token: 'foobar',
				},
			);
		} catch (error) {
			expect(error instanceof errors.SyncInvalidTemplate).toBe(true);
		}

		expect(TestIntegration.instance.initialized).toBe(true);
		expect(TestIntegration.instance.destroyed).toBe(true);
	});

	test('should destroy the integration even if there was a translate error', async () => {
		expect.hasAssertions();

		try {
			await pipeline.translateExternalEvent(
				BrokenIntegration,
				{
					id: '4a962ad9-20b5-4dd8-a707-bf819593cc84',
					type: 'invalid-type@1.0.0',
					slug: context.generateRandomSlug({
						prefix: 'external-event',
					}),
					version: '1.0.0',
					data: {
						source: 'test',
						headers: {},
						payload: {
							foo: {
								$eval: 'hello',
							},
							bar: 'baz',
						},
					},
					tags: [],
					created_at: '',
					markers: [],
					active: true,
					requires: [],
					capabilities: [],
				},
				{
					context: context.syncContext,
					actor: context.actor.id,
					origin: 'foobar',
					defaultUser: 'foobar',
					provider: 'foobar',
					token: 'foobar',
				},
			);
		} catch (error: any) {
			expect(error.name).toEqual('TranslateError');
		}

		expect(BrokenIntegration.instance.initialized).toBe(true);
		expect(BrokenIntegration.instance.destroyed).toBe(true);
	});
});
