import { MediaQueryDto, PlayerTicketsQueryDto, SearchFilter } from '~modules/media/dto/media.dto';

describe('MediaDto', () => {
	describe('SearchFilters', () => {
		it('should be able to construct a SearchFilters object', async () => {
			const searchFilter = new SearchFilter();
			expect(searchFilter).toEqual({});
		});
	});
	describe('MediaQueryDto', () => {
		it('should be able to construct a MediaQueryDto object', async () => {
			const mediaQueryDto = new MediaQueryDto();
			expect(mediaQueryDto).toEqual({
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
