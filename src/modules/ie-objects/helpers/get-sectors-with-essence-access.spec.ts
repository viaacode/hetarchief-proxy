import { IeObjectSector } from '../ie-objects.types';

import { getSectorsWithEssenceAccess } from './get-sectors-with-essence-access';

describe('GetSectorsWithEssenceAccess', () => {
	it('Culture Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(IeObjectSector.CULTURE);
		expect(sectorsWithEssenceAccess).toEqual([
			IeObjectSector.CULTURE,
			IeObjectSector.GOVERNMENT,
			IeObjectSector.REGIONAL,
			IeObjectSector.PUBLIC,
			IeObjectSector.RURAL,
		]);
	});

	it('Government Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(IeObjectSector.GOVERNMENT);
		expect(sectorsWithEssenceAccess).toEqual([
			IeObjectSector.CULTURE,
			IeObjectSector.GOVERNMENT,
			IeObjectSector.REGIONAL,
			IeObjectSector.PUBLIC,
			IeObjectSector.RURAL,
		]);
	});
	it('Regional Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(IeObjectSector.REGIONAL);
		expect(sectorsWithEssenceAccess).toEqual([
			IeObjectSector.CULTURE,
			IeObjectSector.GOVERNMENT,
			IeObjectSector.REGIONAL,
		]);
	});
	it('Public Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(IeObjectSector.PUBLIC);
		expect(sectorsWithEssenceAccess).toEqual([
			IeObjectSector.CULTURE,
			IeObjectSector.GOVERNMENT,
			IeObjectSector.REGIONAL,
			IeObjectSector.PUBLIC,
		]);
	});

	it('Rural Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(IeObjectSector.RURAL);
		expect(sectorsWithEssenceAccess).toEqual([
			IeObjectSector.CULTURE,
			IeObjectSector.GOVERNMENT,
			IeObjectSector.REGIONAL,
			IeObjectSector.RURAL,
		]);
	});
});
