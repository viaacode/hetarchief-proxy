import { QueryBuilder } from './queryBuilder';

describe('QueryBuilder', () => {
	describe('build', () => {
		it('should build a valid search query', () => {
			// const query = ;
			expect(() => QueryBuilder.build(null)).toThrowError('Failed to build query object');
		});

		it('should return a match_all query when no filters are specified', () => {
			const esQuery = QueryBuilder.build({ size: 10, from: 0 });
			expect(esQuery.query).toEqual({ match_all: {} });
		});

		it('should return a match_all query when empty filters are specified', () => {
			const esQuery = QueryBuilder.build({ filters: {}, size: 10, from: 0 });
			expect(esQuery.query).toEqual({ match_all: {} });
		});

		it('should return a search query when a query filter is specified', () => {
			const esQuery = QueryBuilder.build({
				filters: { query: 'searchme' },
				size: 10,
				from: 0,
			});
			expect(esQuery.query.bool.should.length).toBeGreaterThanOrEqual(3);
		});

		it('should return an empty query when empty query filter is specified', () => {
			const esQuery = QueryBuilder.build({
				filters: { query: '' },
				size: 10,
				from: 0,
			});
			expect(esQuery.query).toEqual({ match_all: {} });
		});
	});
});
