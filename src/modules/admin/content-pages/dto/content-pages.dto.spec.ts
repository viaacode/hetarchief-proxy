import { ContentPagesQueryDto } from '~modules/contentPages/dto/contentPages.dto';

describe('ContentPagesDto', () => {
	describe('ContentPagesQueryDto', () => {
		it('should be able to construct a ContentPagesQueryDto object', async () => {
			const contentPagesQueryDto = new ContentPagesQueryDto();
			expect(contentPagesQueryDto).toEqual({
				page: 1,
				size: 10,
			});
		});
	});
});
