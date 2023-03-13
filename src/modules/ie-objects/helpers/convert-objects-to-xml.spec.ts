import { IeObject } from '../ie-objects.types';
import {
	mockIeObjectWithMetadataSetALL,
	mockIeObjectWithMetadataSetALLWithEssence,
	mockIeObjectWithMetadataSetALLXml,
	mockIeObjectWithMetadataSetLTD,
	mockIeObjectWithMetadataSetLTDXml,
} from '../mocks/ie-objects.mock';

import { convertObjectToXml } from './convert-objects-to-xml';

describe('convertObjectToXml', () => {
	it('returns the xml version of an object', () => {
		const xml = convertObjectToXml({ meemooOriginalCp: '1' } as unknown as IeObject);
		expect(xml.startsWith('<object>')).toBeTruthy();
	});

	it('returns the xml version of an object with metadata set LTD', () => {
		const xml = convertObjectToXml(mockIeObjectWithMetadataSetLTD);
		expect(xml).toEqual(mockIeObjectWithMetadataSetLTDXml);
	});
	it('returns the xml version of an object with metadata set ALL', () => {
		const xml = convertObjectToXml(mockIeObjectWithMetadataSetALL);
		expect(xml).toEqual(mockIeObjectWithMetadataSetALLXml);
	});
	it('returns the xml version of an object with metadata set ALL with Essence', () => {
		const xml = convertObjectToXml(
			mockIeObjectWithMetadataSetALLWithEssence as unknown as IeObject
		);
		expect(xml).toEqual(mockIeObjectWithMetadataSetALLXml);
	});
});
