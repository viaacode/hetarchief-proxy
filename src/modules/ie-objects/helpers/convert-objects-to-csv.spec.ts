import { IeObject } from '../ie-objects.types';

import { convertObjectsToCsv, convertObjectToCsv } from './convert-objects-to-csv';

describe('convertObjectToCsv', () => {
	it('returns the csv version of an object', () => {
		const csv = convertObjectToCsv({ id: '1' } as unknown as IeObject);
		expect(csv.startsWith('id')).toBeTruthy();
	});

	it('returns the csv version of a nested object', () => {
		const csv = convertObjectToCsv({ id: '1', nest: { name: 'test' } } as unknown as IeObject);
		expect(csv.startsWith('id;nest.name')).toBeTruthy();
		expect(csv.endsWith('1;test')).toBeTruthy();
	});
});

describe('convertObjectsToCsv', () => {
	it('returns the csv version of an array of objects', () => {
		const csv = convertObjectsToCsv([{ id: '1' }] as unknown as IeObject[]);
		expect(csv.startsWith('0.id')).toBeTruthy();
	});

	it('returns the csv version of an array of nested objects', () => {
		const csv = convertObjectsToCsv([
			{ id: '1', nest: { name: 'test' } },
		] as unknown as IeObject[]);
		console.log(csv);
		expect(csv.startsWith('0.id;0.nest.name')).toBeTruthy();
		expect(csv.endsWith('1;test')).toBeTruthy();
	});
});
