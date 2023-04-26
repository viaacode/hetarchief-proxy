import {
	CreateMaterialRequestDto,
	MaterialRequestsQueryDto,
	UpdateMaterialRequestDto,
} from './material-requests.dto';

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
				organisation: null,
				requesterCapacity: undefined,
				type: undefined,
				reason: '',
			});
		});
	});

	describe('UpdateMaterialRequestDto', () => {
		it('should be able to construct an UpdateMaterialRequestDto object', async () => {
			const updateMaterialRequestDto = new UpdateMaterialRequestDto();
			expect(updateMaterialRequestDto).toEqual({});
		});
	});
});
