import { describe, expect, it } from 'vitest';
import { SpacesQueryDto } from '~modules/spaces/dto/spaces.dto';
import { VisitorSpaceOrderProps } from '~modules/spaces/spaces.types';
import { VisitorSpaceStatus } from '~shared/types/types';

describe('SpacesQueryDto', () => {
	describe('SpacesQueryDto', () => {
		it('should be able to construct a SpacesQueryDto object', async () => {
			const spacesQueryDto = new SpacesQueryDto();
			expect(spacesQueryDto).toEqual({
				accessType: undefined,
				orderDirection: 'asc',
				orderProp: VisitorSpaceOrderProps.OrganisationName,
				page: 1,
				query: undefined,
				size: 10,
				status: [VisitorSpaceStatus.Active],
			});
		});
	});
});
