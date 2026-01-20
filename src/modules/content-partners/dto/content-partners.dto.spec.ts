import { describe, expect, it } from 'vitest';
import { ContentPartnersQueryDto } from './content-partners.dto';

describe('ContentPartnersQueryDto', () => {
	describe('ContentPartnersQueryDto', () => {
		it('should be able to construct a ContentPartnersQueryDto object', async () => {
			const contentPartnersQueryDto = new ContentPartnersQueryDto();
			expect(contentPartnersQueryDto).toEqual({
				hasSpace: undefined,
				orIds: [],
			});
		});
	});
});
