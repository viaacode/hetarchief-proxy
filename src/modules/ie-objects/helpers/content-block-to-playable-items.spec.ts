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
							{ mediaItem: { value: '086348mc8s' }, startPoint: '00:00:10', endPoint: '00:00:20' },
							{ mediaItem: { value: 'qstt4fps28' }, startPoint: '', endPoint: '' },
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
					mockBlock('TIMELINE', [
						{ visualType: 'OBJECT', mediaItem: { value: '086348mc8s' } },
						{ visualType: 'IMAGE', image: 'https://example.com/image.jpg' },
						{ visualType: 'NONE' },
						{ visualType: 'OBJECT', mediaItem: { value: 'qstt4fps28' } },
					])
				)
			).toEqual([
				{ schemaIdentifier: '086348mc8s' },
				null,
				null,
				{ schemaIdentifier: 'qstt4fps28' },
			]);
		});
	});

	describe('THREE_CHOICES_PLAYER', () => {
		it('returns an entry per interest, in the block order', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('THREE_CHOICES_PLAYER', {
						interests: [
							{ name: 'Wielrennen', mediaItem: { value: '086348mc8s' }, themeId: 'theme-1' },
							{ name: 'Kermis', mediaItem: { value: 'qstt4fps28' }, themeId: 'theme-2' },
						],
					})
				)
			).toEqual([{ schemaIdentifier: '086348mc8s' }, { schemaIdentifier: 'qstt4fps28' }]);
		});

		it('keeps the place of an interest with no object selected yet', () => {
			expect(
				contentBlockToPlayableDisplayDataItems(
					mockBlock('THREE_CHOICES_PLAYER', {
						interests: [
							{ name: 'Wielrennen', mediaItem: { value: '086348mc8s' } },
							{ name: 'Leeg' },
							{ name: 'Ook leeg', mediaItem: { value: '' } },
							{ name: 'Kermis', mediaItem: { value: 'qstt4fps28' } },
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

		it('never carries a snippet, because an interest cannot configure one', () => {
			const items = contentBlockToPlayableDisplayDataItems(
				mockBlock('THREE_CHOICES_PLAYER', {
					// A stray start/end on the interest must be ignored, not trusted.
					interests: [{ mediaItem: { value: '086348mc8s' }, startTime: '00:10', endTime: '00:20' }],
				})
			);

			expect(items).toEqual([{ schemaIdentifier: '086348mc8s' }]);
		});

		it('returns an empty list when the block has no interests', () => {
			expect(contentBlockToPlayableDisplayDataItems(mockBlock('THREE_CHOICES_PLAYER', {}))).toEqual(
				[]
			);
		});
	});

	it('returns null for a block type that has no playable objects', () => {
		expect(contentBlockToPlayableDisplayDataItems(mockBlock('RICH_TEXT', {}))).toBeNull();
	});
});
