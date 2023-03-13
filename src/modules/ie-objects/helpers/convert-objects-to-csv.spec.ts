import { IeObject } from '../ie-objects.types';
import {
	mockIeObjectWithMetadataSetALL,
	mockIeObjectWithMetadataSetALLCsv,
	mockIeObjectWithMetadataSetALLWithEssence,
	mockIeObjectWithMetadataSetALLWithEssenceCsv,
	mockIeObjectWithMetadataSetLTD,
	mockIeObjectWithMetadataSetLTDCsv,
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

	it('returns the csv version of an object with metadata set LTD', () => {
		const csv = convertObjectToCsv(mockIeObjectWithMetadataSetLTD);
		expect(csv).toEqual(mockIeObjectWithMetadataSetLTDCsv);
	});
	it('returns the csv version of an object with metadata set ALL', () => {
		const csv = convertObjectToCsv(mockIeObjectWithMetadataSetALL);
		expect(csv).toEqual(mockIeObjectWithMetadataSetALLCsv);
	});
	it('returns the csv version of an object with metadata set ALL with Essence', () => {
		const csv = convertObjectToCsv(
			mockIeObjectWithMetadataSetALLWithEssence as unknown as IeObject
		);
		expect(csv).toEqual(mockIeObjectWithMetadataSetALLWithEssenceCsv);
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
