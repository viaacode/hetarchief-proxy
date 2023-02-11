import { IeObject } from '../ie-objects.types';

import { convertObjectToXml } from './convert-objects-to-xml';

describe('convertObjectToXml', () => {
	it('returns the xml version of an object', () => {
		const xml = convertObjectToXml({ id: '1' } as unknown as IeObject);
		expect(xml.startsWith('<object>')).toBeTruthy();
	});
});
