import { IeObject } from '../ie-objects.types';

import { convertObjectsToCsv, convertObjectToCsv } from './convert-objects-to-csv';

describe('convertObjectToCsv', () => {
	it('returns the csv version of an object', () => {
		const csv = convertObjectToCsv({
			otherKey: 'otherValue',
			meemooOriginalCp: '1',
		} as unknown as IeObject);
		expect(csv.startsWith('meemooOriginalCp')).toBeTruthy();
	});

	it('returns the csv version of a nested object', () => {
		const csv = convertObjectToCsv({
			otherKey: 'otherValue',
			meemooOriginalCp: '1',
			creator: { Maker: 'test' },
		} as unknown as IeObject);
		expect(csv.startsWith('meemooOriginalCp;creator.Maker')).toBeTruthy();
		expect(csv.endsWith('1;test')).toBeTruthy();
	});
});

describe('convertObjectsToCsv', () => {
	it('returns the csv version of an array of objects', () => {
		const csv = convertObjectsToCsv([
			{ otherKey: 'otherValue', meemooOriginalCp: '1' },
		] as unknown as IeObject[]);
		expect(csv.startsWith('0.meemooOriginalCp')).toBeTruthy();
	});

	it('returns the csv version of an array of nested objects', () => {
		const csv = convertObjectsToCsv([
			{
				otherKey: 'otherValue',
				meemooOriginalCp: '1',
				creator: { Maker: 'test' },
			},
		] as unknown as IeObject[]);
		console.log(csv);
		expect(csv.startsWith('0.meemooOriginalCp;0.creator.Maker')).toBeTruthy();
		expect(csv.endsWith('1;test')).toBeTruthy();
	});
});
