import { SpacesQueryDto } from '~modules/spaces/dto/spaces.dto';
import { VisitorSpaceStatus } from '~shared/types/types';

describe('SpacesQueryDto', () => {
	describe('SpacesQueryDto', () => {
		it('should be able to construct a SpacesQueryDto object', async () => {
			const spacesQueryDto = new SpacesQueryDto();
			expect(spacesQueryDto).toEqual({
				accessType: undefined,
				orderDirection: 'asc',
				orderProp: 'content_partner.schema_name',
				page: 1,
				query: undefined,
				size: 10,
				status: [VisitorSpaceStatus.Active],
			});
		});
	});
});
