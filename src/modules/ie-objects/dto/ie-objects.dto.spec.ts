import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import {
	IeObjectsPlayableDisplayDataQueryDto,
	IeObjectsQueryDto,
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
		it('accepts a blockId', async () => {
			const dto = plainToInstance(IeObjectsPlayableDisplayDataQueryDto, {
				blockId: 'c9c9f4b1-1a6f-4f0e-9d2e-9e5f1a2b3c4d',
			});
			const errors = await validate(dto);
			expect(errors).toEqual([]);
		});

		it('rejects a missing blockId', async () => {
			const dto = plainToInstance(IeObjectsPlayableDisplayDataQueryDto, {});
			const errors = await validate(dto);
			expect(errors).not.toEqual([]);
		});

		it('rejects a non-string blockId', async () => {
			const dto = plainToInstance(IeObjectsPlayableDisplayDataQueryDto, { blockId: 42 });
			const errors = await validate(dto);
			expect(errors).not.toEqual([]);
		});
	});
});
