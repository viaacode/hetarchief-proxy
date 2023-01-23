import { MaterialRequestsQueryDto } from './material-requests.dto';

describe('MaterialRequestsDto', () => {
	describe('MaterialRequestsQueryDto', () => {
		it('should be able to construct a MaterialRequestsQueryDto object', async () => {
			const materialRequestsQueryDto = new MaterialRequestsQueryDto();
			expect(materialRequestsQueryDto).toEqual({
				page: 1,
				size: 10,
				orderProp: 'createdAt',
				orderDirection: 'desc',
			});
		});
	});
});
