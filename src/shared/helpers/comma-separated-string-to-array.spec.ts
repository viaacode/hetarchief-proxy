import { commaSeparatedStringToArray } from './comma-separated-string-to-array';

describe('commaSeparatedStringToArray', () => {
	it('should split a string into an array of strings', () => {
		const converted = commaSeparatedStringToArray({ value: 'first,second' });
		expect(converted).toEqual(['first', 'second']);
	});
	it('should split a string into an array of strings even if no commas in string', () => {
		const converted = commaSeparatedStringToArray({ value: 'first' });
		expect(converted).toEqual(['first']);
	});

	it('should pass through array of strings without modifications', () => {
		const converted = commaSeparatedStringToArray({ value: ['first', 'second'] });
		expect(converted).toEqual(['first', 'second']);
	});

	it('should pass through array of strings without modifications even if only one item', () => {
		const converted = commaSeparatedStringToArray({ value: ['first'] });
		expect(converted).toEqual(['first']);
	});

	it('should convert empty string als empty array', () => {
		const converted = commaSeparatedStringToArray({ value: '' });
		expect(converted).toEqual([]);
	});

	it('should pass through array of strings without modifications even if no items in array', () => {
		const converted = commaSeparatedStringToArray({ value: [] });
		expect(converted).toEqual([]);
	});
});
