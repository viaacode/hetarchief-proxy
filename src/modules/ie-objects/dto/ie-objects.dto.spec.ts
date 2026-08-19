import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import {
	IeObjectsPlayableDisplayDataQueryDto,
	IeObjectsQueryDto,
	PLAYABLE_DISPLAY_DATA_MAX_OBJECTS,
	PlayerTicketsQueryDto,
	SearchFilter,
} from './ie-objects.dto';

describe('IeObjectsDto', () => {
	describe('SearchFilters', () => {
		it('should be able to construct a SearchFilters object', async () => {
			const searchFilter = new SearchFilter();
			expect(searchFilter).toEqual({});
		});
	});
	describe('IeObjectsQueryDto', () => {
		it('should be able to construct a IeObjectQueryDto object', async () => {
			const ieObjectsDto = new IeObjectsQueryDto();
			expect(ieObjectsDto).toEqual({
				orderDirection: 'asc',
				orderProp: 'relevance',
				page: 1,
				size: 20,
			});
		});
	});
	describe('PlayerTicketsQueryDto', () => {
		it('should be able to construct a PlayerTicketsQueryDto object', async () => {
			const playerTicketsQueryDto = new PlayerTicketsQueryDto();
			expect(playerTicketsQueryDto).toEqual({});
		});
	});
	describe('IeObjectsPlayableDisplayDataQueryDto', () => {
		it('accepts a non-empty objects array up to the max size', async () => {
			const dto = plainToInstance(IeObjectsPlayableDisplayDataQueryDto, {
				objects: Array.from({ length: PLAYABLE_DISPLAY_DATA_MAX_OBJECTS }, (_, i) => `id-${i}`),
			});
			const errors = await validate(dto);
			expect(errors).toEqual([]);
		});

		it('rejects an empty objects array', async () => {
			const dto = plainToInstance(IeObjectsPlayableDisplayDataQueryDto, { objects: [] });
			const errors = await validate(dto);
			expect(errors).not.toEqual([]);
		});

		it('rejects an objects array larger than the max size', async () => {
			const dto = plainToInstance(IeObjectsPlayableDisplayDataQueryDto, {
				objects: Array.from({ length: PLAYABLE_DISPLAY_DATA_MAX_OBJECTS + 1 }, (_, i) => `id-${i}`),
			});
			const errors = await validate(dto);
			expect(errors).not.toEqual([]);
		});
	});
});
