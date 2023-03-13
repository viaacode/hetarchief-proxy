import { IeObject } from '../ie-objects.types';
import {
	mockIeObjectWithMetadataSetALL,
	mockIeObjectWithMetadataSetALLCsvHeaders,
	mockIeObjectWithMetadataSetALLWithEssence,
	mockIeObjectWithMetadataSetALLWithEssenceCsvHeaders,
	mockIeObjectWithMetadataSetLTD,
	mockIeObjectWithMetadataSetLTDCsvHeaders,
} from '../mocks/ie-objects.mock';

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

	it('returns the csv version of an object with metadate set LTD', () => {
		const csv = convertObjectToCsv(mockIeObjectWithMetadataSetLTD);
		expect(csv.startsWith(mockIeObjectWithMetadataSetLTDCsvHeaders)).toBeTruthy();
	});
	it('returns the csv version of an object with metadate set ALL', () => {
		const csv = convertObjectToCsv(mockIeObjectWithMetadataSetALL);
		expect(csv.startsWith(mockIeObjectWithMetadataSetALLCsvHeaders)).toBeTruthy();
	});
	it('returns the csv version of an object with metadate set ALL with Essence', () => {
		const csv = convertObjectToCsv(
			mockIeObjectWithMetadataSetALLWithEssence as unknown as IeObject
		);
		expect(csv.startsWith(mockIeObjectWithMetadataSetALLWithEssenceCsvHeaders)).toBeTruthy();
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
		expect(csv.startsWith('0.meemooOriginalCp;0.creator.Maker')).toBeTruthy();
		expect(csv.endsWith('1;test')).toBeTruthy();
	});
});
