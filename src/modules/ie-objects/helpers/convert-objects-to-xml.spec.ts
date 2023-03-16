import { IeObject } from '../ie-objects.types';
import {
	mockIeObjectWithMetadataSetALL,
	mockIeObjectWithMetadataSetALLWithEssence,
	mockIeObjectWithMetadataSetAllWithEssenceXml,
	mockIeObjectWithMetadataSetAllXml,
	mockIeObjectWithMetadataSetLTD,
	mockIeObjectWithMetadataSetLtdXml,
} from '../mocks/ie-objects.mock';

import { convertObjectToXml } from './convert-objects-to-xml';

describe('convertObjectToXml', () => {
	it('returns the xml version of an object', () => {
		const xml = convertObjectToXml({ meemooOriginalCp: '1' } as unknown as IeObject);
		expect(xml.startsWith('<object>')).toBeTruthy();
	});

	it('returns the xml version of an object with metadata set LTD', () => {
		const xml = convertObjectToXml(mockIeObjectWithMetadataSetLTD);
		expect(xml).toEqual(mockIeObjectWithMetadataSetLtdXml);
	});
	it('returns the xml version of an object with metadata set ALL', () => {
		const xml = convertObjectToXml(mockIeObjectWithMetadataSetALL);
		expect(xml).toEqual(mockIeObjectWithMetadataSetAllXml);
	});
	it('returns the xml version of an object with metadata set ALL with Essence', () => {
		const xml = convertObjectToXml(mockIeObjectWithMetadataSetALLWithEssence);
		expect(xml).toEqual(mockIeObjectWithMetadataSetAllWithEssenceXml);
	});
});
