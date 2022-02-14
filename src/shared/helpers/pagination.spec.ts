import { PaginationHelper } from './pagination';

describe('convertPagination', () => {
	it('handles page 0 as page 1', () => {
		const converted = PaginationHelper.convertPagination(0, 10);
		expect(converted.offset).toBe(0);
		expect(converted.limit).toBe(10);
	});

	it('converts pagination', () => {
		const converted = PaginationHelper.convertPagination(2, 10);
		expect(converted.offset).toBe(10);
		expect(converted.limit).toBe(10);
	});
});
