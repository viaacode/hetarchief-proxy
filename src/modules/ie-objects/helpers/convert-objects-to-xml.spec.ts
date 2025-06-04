import type { IeObject } from '../ie-objects.types';
import {
	mockIeObjectWithMetadataSetALL,
	mockIeObjectWithMetadataSetALLWithEssence,
	mockIeObjectWithMetadataSetAllWithEssenceXml,
	mockIeObjectWithMetadataSetAllXml,
	mockIeObjectWithMetadataSetLTD,
	mockIeObjectWithMetadataSetLtdXml,
} from '../mocks/ie-objects.mock';

import { convertObjectToXml } from './convert-objects-to-xml';

import { mockConfigService } from '~shared/test/mock-config-service';

describe('convertObjectToXml', () => {
	it('returns the xml version of an object', () => {
		const xml = convertObjectToXml(
			{ meemooOriginalCp: '1' } as unknown as IeObject,
			mockConfigService.get('CLIENT_HOST') as string
		);
		expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBeTruthy();
	});

	it('returns the xml version of an object with metadata set LTD', () => {
		const xml = convertObjectToXml(
			mockIeObjectWithMetadataSetLTD,
			mockConfigService.get('CLIENT_HOST') as string
		);
		expect(xml).toEqual(mockIeObjectWithMetadataSetLtdXml);
	});
	it('returns the xml version of an object with metadata set ALL', () => {
		const xml = convertObjectToXml(
			mockIeObjectWithMetadataSetALL,
			mockConfigService.get('CLIENT_HOST') as string
		);
		expect(xml).toEqual(mockIeObjectWithMetadataSetAllXml);
	});
	it('returns the xml version of an object with metadata set ALL with Essence', () => {
		const xml = convertObjectToXml(
			mockIeObjectWithMetadataSetALLWithEssence,
			mockConfigService.get('CLIENT_HOST') as string
		);
		expect(xml).toEqual(mockIeObjectWithMetadataSetAllWithEssenceXml);
	});
});
