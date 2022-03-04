import {
	CreateNavigationDto,
	NavigationsQueryDto,
} from '~modules/admin/navigations/dto/navigations.dto';

describe('NavigationsDto', () => {
	describe('NavigationsQueryDto', () => {
		it('should be able to construct a NavigationsQueryDto object', async () => {
			const navigationsQueryDto = new NavigationsQueryDto();
			expect(navigationsQueryDto).toEqual({});
		});
	});
	describe('CreateNavigationDto', () => {
		it('should be able to construct a CreateNavigationDto object', async () => {
			const createNavigationDto = new CreateNavigationDto();
			expect(createNavigationDto).toEqual({
				icon_name: '',
			});
		});
	});
});
