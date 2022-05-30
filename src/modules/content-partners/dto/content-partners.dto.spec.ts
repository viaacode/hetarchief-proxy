import { ContentPartnersQueryDto } from './content-partners.dto';

describe('ContentPartnersQueryDto', () => {
	describe('ContentPartnersQueryDto', () => {
		it('should be able to construct a ContentPartnersQueryDto object', async () => {
			const contentPartnersQueryDto = new ContentPartnersQueryDto();
			expect(contentPartnersQueryDto).toEqual({
				hasSpace: undefined,
			});
		});
	});
});
