import { SpacesQueryDto } from '~modules/spaces/dto/spaces.dto';

describe('SpacesQueryDto', () => {
	describe('SpacesQueryDto', () => {
		it('should be able to construct a SpacesQueryDto object', async () => {
			const spacesQueryDto = new SpacesQueryDto();
			expect(spacesQueryDto).toEqual({
				accessType: undefined,
				orderDirection: 'asc',
				orderProp: 'schema_maintainer.schema_name',
				page: 1,
				query: undefined,
				size: 10,
			});
		});
	});
});
