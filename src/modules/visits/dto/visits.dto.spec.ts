import { describe, expect, it } from 'vitest';
import {
	CreateVisitDto,
	UpdateVisitDto,
	UpdateVisitStatusDto,
	VisitsQueryDto,
} from '~modules/visits/dto/visits.dto';

describe('VisitsDto', () => {
	describe('CreateVisitDto', () => {
		it('should be able to construct a CreateVisitDto object', async () => {
			const createVisitDto = new CreateVisitDto();
			expect(createVisitDto).toEqual({});
		});
	});
	describe('UpdateVisitStatusDto', () => {
		it('should be able to construct a UpdateVisitStatusDto object', async () => {
			const updateVisitStatusDto = new UpdateVisitStatusDto();
			expect(updateVisitStatusDto).toEqual({});
		});
	});
	describe('UpdateVisitDto', () => {
		it('should be able to construct a UpdateVisitDto object', async () => {
			const updateVisitDto = new UpdateVisitDto();
			expect(updateVisitDto).toEqual({});
		});
	});
	describe('VisitsQueryDto', () => {
		it('should be able to construct a VisitsQueryDto object', async () => {
			const visitsQueryDto = new VisitsQueryDto();
			expect(visitsQueryDto).toEqual({
				page: 1,
				size: 10,
				orderProp: 'startAt',
				orderDirection: 'desc',
			});
		});
	});
	describe('UpdateVisitStatusDto', () => {
		it('should be able to construct a UpdateVisitStatusDto object', async () => {
			const updateVisitStatusDto = new UpdateVisitStatusDto();
			expect(updateVisitStatusDto).toEqual({});
		});
	});
});
