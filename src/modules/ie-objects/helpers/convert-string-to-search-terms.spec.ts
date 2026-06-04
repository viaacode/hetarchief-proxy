import { describe, expect, it } from 'vitest';
import { convertStringToSearchTerms } from '~modules/ie-objects/helpers/convert-string-to-search-terms';

describe('convertNodeToSearchStrings', () => {
	it('should return the correct literals and identifiers as a string array (1)', () => {
		const response = convertStringToSearchTerms(
			"genetics AND ('dna sequencing' AND crispr AND (cloning OR genomics) AND NOT dna)"
		);
		expect(response.plainTextSearchTerms).toEqual([
			{
				isLiteral: false,
				value: 'genetics',
			},
			{
				isLiteral: true,
				value: 'dna sequencing',
			},
			{
				isLiteral: false,
				value: 'crispr',
			},
			{
				isLiteral: false,
				value: 'cloning',
			},
			{
				isLiteral: false,
				value: 'genomics',
			},
		]);
		expect(response.parsedSuccessfully).toEqual(true);
	});

	it('should return the correct literals and identifiers as a string array (2)', () => {
		const response = convertStringToSearchTerms(
			"'Ineke van dam' test AND gent AND brussel AND NOT kortrijk"
		);
		expect(response.plainTextSearchTerms).toEqual([
			{
				isLiteral: true,
				value: 'Ineke van dam',
			},
			{
				isLiteral: false,
				value: 'test',
			},
			{
				isLiteral: false,
				value: 'gent',
			},
			{
				isLiteral: false,
				value: 'brussel',
			},
		]);
		expect(response.parsedSuccessfully).toEqual(true);
	});

	it('should return the correct literals and identifiers as a string array (3)', () => {
		const response = convertStringToSearchTerms(
			"genetics test AND ('dna sequencing' test AND crispr AND (cloning OR genomics) AND NOT dna brecht tafel)"
		);
		expect(response.plainTextSearchTerms).toEqual([
			{
				isLiteral: false,
				value: 'genetics',
			},
			{
				isLiteral: false,
				value: 'test',
			},
			{
				isLiteral: true,
				value: 'dna sequencing',
			},
			{
				isLiteral: false,
				value: 'test',
			},
			{
				isLiteral: false,
				value: 'crispr',
			},
			{
				isLiteral: false,
				value: 'cloning',
			},
			{
				isLiteral: false,
				value: 'genomics',
			},
			{
				isLiteral: false,
				value: 'brecht',
			},
			{
				isLiteral: false,
				value: 'tafel',
			},
		]);
		expect(response.parsedSuccessfully).toEqual(true);
	});

	it('should return the string as a literal string', () => {
		try {
			expect(convertStringToSearchTerms('The big -)( test')).toThrowError();
			fail(
				'convertStringToSearchTerms should have thrown an error when there are special characters'
			);
		} catch (err) {
			// If it fails the first time, we try again with quotes around the whole string
			const result = convertStringToSearchTerms('"The big -)( test"');
			expect(result.plainTextSearchTerms).toEqual([
				{
					isLiteral: true,
					value: 'The big -)( test',
				},
			]);
			expect(result.parsedSuccessfully).toEqual(true);
		}
	});

	it('should return an empty array if input is an empty string', () => {
		const result = convertStringToSearchTerms('');
		expect(result.plainTextSearchTerms).toEqual([]);
		expect(result.parsedSuccessfully).toEqual(true);
	});
});
