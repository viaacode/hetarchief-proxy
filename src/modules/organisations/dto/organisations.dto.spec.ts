import { describe, expect, it } from 'vitest';
import { OrganisationSlugQueryDto } from './organisations.dto';

describe('OrganisationSlugQueryDto', () => {
	describe('OrganisationSlugQueryDto', () => {
		it('should be able to construct a OrganisationSlugQueryDto object', async () => {
			const organisationSlugQueryDto = new OrganisationSlugQueryDto();
			expect(organisationSlugQueryDto).toEqual({
				page: 1,
				size: 20,
				orderProp: 'name',
				orderDirection: 'asc',
			});
		});
	});
});
