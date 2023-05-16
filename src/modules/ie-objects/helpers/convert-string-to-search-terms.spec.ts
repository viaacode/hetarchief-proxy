import { convertStringToSearchTerms } from '~modules/ie-objects/helpers/convert-string-to-search-terms';

describe('convertNodeToSearchStrings', () => {
	it('should return the correct literals and identifiers as a string array (1)', () => {
		expect(
			convertStringToSearchTerms(
				"genetics AND ('dna sequencing' AND crispr AND (cloning OR genomics) AND NOT dna)"
			)
		).toEqual(['genetics', 'dna sequencing', 'crispr', 'cloning', 'genomics', 'dna']);
	});

	it('should return the correct literals and identifiers as a string array (2)', () => {
		expect(
			convertStringToSearchTerms("'Ineke van dam' test AND gent AND brussel AND NOT kortrijk")
		).toEqual(['Ineke van dam', 'test', 'gent', 'brussel', 'kortrijk']);
	});

	it('should return the correct literals and identifiers as a string array (3)', () => {
		expect(
			convertStringToSearchTerms(
				"genetics test AND ('dna sequencing' test AND crispr AND (cloning OR genomics) AND NOT dna brecht tafel)"
			)
		).toEqual([
			'genetics',
			'test',
			'dna sequencing',
			'test',
			'crispr',
			'cloning',
			'genomics',
			'dna',
			'brecht',
			'tafel',
		]);
	});

	it('should return the string as a literal string', () => {
		try {
			expect(convertStringToSearchTerms('The big -)( test')).toThrowError();
			fail(
				'convertStringToSearchTerms should have thrown an error when there are special characters'
			);
		} catch (err) {
			// If it fails the first time, we try again with quotes around the whole string
			expect(convertStringToSearchTerms('"The big -)( test"')).toEqual(['The big -)( test']);
		}
	});

	it('should return an empty array if input is an empty string', () => {
		expect(convertStringToSearchTerms('')).toEqual([]);
	});
});
