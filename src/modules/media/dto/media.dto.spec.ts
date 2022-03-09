import { MediaQueryDto, PlayerTicketsQueryDto, SearchFilters } from '~modules/media/dto/media.dto';

describe('NotificationsDto', () => {
	describe('SearchFilters', () => {
		it('should be able to construct a SearchFilters object', async () => {
			const searchFilters = new SearchFilters();
			expect(searchFilters).toEqual({});
		});
	});
	describe('MediaQueryDto', () => {
		it('should be able to construct a MediaQueryDto object', async () => {
			const mediaQueryDto = new MediaQueryDto();
			expect(mediaQueryDto).toEqual({
				orderDirection: 'asc',
				orderProp: 'dcterms_available',
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
