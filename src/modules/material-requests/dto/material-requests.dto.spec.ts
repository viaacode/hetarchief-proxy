import { MaterialRequestType } from '../material-requests.types';

import { CreateMaterialRequestDto, MaterialRequestsQueryDto } from './material-requests.dto';

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

	describe('CreateMaterialRequestDto', () => {
		it('should be able to construct a CreateMaterialRequestDto object', async () => {
			const createMaterialRequestDto = new CreateMaterialRequestDto();
			expect(createMaterialRequestDto).toEqual({
				type: MaterialRequestType.VIEW,
			});
		});
	});
});
