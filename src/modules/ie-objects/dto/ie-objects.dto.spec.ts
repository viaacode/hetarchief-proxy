import { IeObjectsQueryDto, PlayerTicketsQueryDto, SearchFilter } from './ie-objects.dto';

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
				size: 10,
			});
		});
	});
	describe('PlayerTicketsQueryDto', () => {
		it('should be able to construct a PlayerTicketsQueryDto object', async () => {
			const playerTicketsQueryDto = new PlayerTicketsQueryDto();
			expect(playerTicketsQueryDto).toEqual({});
		});
	});
});
