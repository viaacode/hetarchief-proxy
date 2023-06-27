import { IeSector } from '../ie-objects.types';

import { getSectorsWithEssenceAccess } from './get-sectors-with-essence-access';

describe('GetSectorsWithEssenceAccess', () => {
	it('Culture Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(IeSector.CULTURE);
		expect(sectorsWithEssenceAccess).toEqual([
			IeSector.CULTURE,
			IeSector.GOVERNMENT,
			IeSector.REGIONAL,
			IeSector.PUBLIC,
			IeSector.RURAL,
		]);
	});

	it('Government Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(IeSector.GOVERNMENT);
		expect(sectorsWithEssenceAccess).toEqual([
			IeSector.CULTURE,
			IeSector.GOVERNMENT,
			IeSector.REGIONAL,
			IeSector.PUBLIC,
			IeSector.RURAL,
		]);
	});
	it('Regional Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(IeSector.REGIONAL);
		expect(sectorsWithEssenceAccess).toEqual([
			IeSector.CULTURE,
			IeSector.GOVERNMENT,
			IeSector.REGIONAL,
		]);
	});
	it('Public Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(IeSector.PUBLIC);
		expect(sectorsWithEssenceAccess).toEqual([
			IeSector.CULTURE,
			IeSector.GOVERNMENT,
			IeSector.REGIONAL,
			IeSector.PUBLIC,
		]);
	});

	it('Rural Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(IeSector.RURAL);
		expect(sectorsWithEssenceAccess).toEqual([
			IeSector.CULTURE,
			IeSector.GOVERNMENT,
			IeSector.REGIONAL,
			IeSector.RURAL,
		]);
	});
});
