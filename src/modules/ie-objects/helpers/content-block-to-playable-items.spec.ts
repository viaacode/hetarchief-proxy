import type { DbContentBlock } from '@meemoo/admin-core-api';
import { describe, expect, it } from 'vitest';

import { contentBlockToPlayableDisplayDataItems } from './content-block-to-playable-items';

const mockBlock = (type: string, components: unknown): DbContentBlock =>
	({ type, components }) as unknown as DbContentBlock;

describe('contentBlockToPlayableDisplayDataItems', () => {
	describe('HETARCHIEF_VIDEO', () => {
		it('returns the object with its snippet converted to seconds', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('HETARCHIEF_VIDEO', {
						mediaItem: { type: 'IE_OBJECT', value: '086348mc8s' },
						startTime: '01:02:03',
						endTime: '01:02:33',
					})
				)
			).toEqual([{ schemaIdentifier: '086348mc8s', start: 3723, end: 3753 }]);
		});

		it('accepts a snippet time without the hours part', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('HETARCHIEF_VIDEO', {
						mediaItem: { value: '086348mc8s' },
						startTime: '01:30',
						endTime: '02:00',
					})
				)
			).toEqual([{ schemaIdentifier: '086348mc8s', start: 90, end: 120 }]);
		});

		it('ignores a half or invalid snippet and plays the whole object', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('HETARCHIEF_VIDEO', {
						mediaItem: { value: '086348mc8s' },
						startTime: '00:01:30',
						endTime: '',
					})
				)
			).toEqual([{ schemaIdentifier: '086348mc8s' }]);

			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('HETARCHIEF_VIDEO', {
						mediaItem: { value: '086348mc8s' },
						startTime: 'not a time',
						endTime: '00:02:00',
					})
				)
			).toEqual([{ schemaIdentifier: '086348mc8s' }]);
		});

		it('ignores a snippet that does not end after it starts', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('HETARCHIEF_VIDEO', {
						mediaItem: { value: '086348mc8s' },
						startTime: '00:02:00',
						endTime: '00:02:00',
					})
				)
			).toEqual([{ schemaIdentifier: '086348mc8s' }]);
		});

		it('returns an empty slot when no object is selected yet', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('HETARCHIEF_VIDEO', { mediaItem: undefined })
				)
			).toEqual([null]);
		});
	});

	describe('HERO_CAROUSEL', () => {
		it('returns one entry per slide, in the order of the block', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('HERO_CAROUSEL', {
						title: 'Hero',
						elements: [
							{ mediaItem: { value: '086348mc8s' }, startTime: '00:00:10', endTime: '00:00:20' },
							{ mediaItem: { value: 'qstt4fps28' }, startTime: '', endTime: '' },
							{ mediaItem: { value: '' } },
						],
					})
				)
			).toEqual([
				{ schemaIdentifier: '086348mc8s', start: 10, end: 20 },
				{ schemaIdentifier: 'qstt4fps28' },
				null,
			]);
		});

		it('returns an empty list when the block has no slides', () => {
			expect(contentBlockToPlayableDisplayDataItems(mockBlock('HERO_CAROUSEL', {}))).toEqual([]);
		});
	});

	describe('TIMELINE', () => {
		it('returns an entry per node, but only resolves the nodes showing an object', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('TIMELINE', {
						sortOrder: 'desc',
						elements: [
							{ visualType: 'OBJECT', mediaItem: { value: '086348mc8s' } },
							{ visualType: 'IMAGE', image: 'https://example.com/image.jpg' },
							{ visualType: 'NONE' },
							{ visualType: 'OBJECT', mediaItem: { value: 'qstt4fps28' } },
						],
					})
				)
			).toEqual([
				{ schemaIdentifier: '086348mc8s' },
				null,
				null,
				{ schemaIdentifier: 'qstt4fps28' },
			]);
		});

		it('cuts a node to the snippet its editor configured', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('TIMELINE', [
						{
							visualType: 'OBJECT',
							mediaItem: { value: '086348mc8s' },
							startTime: '00:00:10',
							endTime: '00:00:20',
						},
					])
				)
			).toEqual([{ schemaIdentifier: '086348mc8s', start: 10, end: 20 }]);
		});

		it('ignores an incomplete or empty snippet', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('TIMELINE', [
						{ visualType: 'OBJECT', mediaItem: { value: '086348mc8s' }, startTime: '00:00:10' },
						{ visualType: 'OBJECT', mediaItem: { value: 'qstt4fps28' }, endTime: '00:00:20' },
						{
							visualType: 'OBJECT',
							mediaItem: { value: 'zp3vt5jn1x' },
							startTime: '',
							endTime: '',
						},
					])
				)
			).toEqual([
				{ schemaIdentifier: '086348mc8s' },
				{ schemaIdentifier: 'qstt4fps28' },
				{ schemaIdentifier: 'zp3vt5jn1x' },
			]);
		});

		it('ignores a snippet that does not end after it starts', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('TIMELINE', [
						{
							visualType: 'OBJECT',
							mediaItem: { value: '086348mc8s' },
							startTime: '00:02:00',
							endTime: '00:01:00',
						},
					])
				)
			).toEqual([{ schemaIdentifier: '086348mc8s' }]);
		});

		it('ignores snippet times on a node that does not show an object', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('TIMELINE', [
						{ visualType: 'IMAGE', startTime: '00:00:10', endTime: '00:00:20' },
					])
				)
			).toEqual([null]);
		});
	});

	it('returns null for a block type that has no playable objects', () => {
		expect(contentBlockToPlayableDisplayDataItems(mockBlock('RICH_TEXT', {}))).toBeNull();
	});
});
