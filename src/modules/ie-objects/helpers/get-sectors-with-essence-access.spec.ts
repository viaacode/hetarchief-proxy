import { HetArchiefIeObjectSector } from '@viaa/avo2-types';

import { describe, expect, it } from 'vitest';
import { getSectorsWithEssenceAccess } from './get-sectors-with-essence-access';

describe('GetSectorsWithEssenceAccess', () => {
	it('Culture Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(HetArchiefIeObjectSector.CULTURE);
		expect(sectorsWithEssenceAccess).toEqual([
			HetArchiefIeObjectSector.CULTURE,
			HetArchiefIeObjectSector.GOVERNMENT,
			HetArchiefIeObjectSector.REGIONAL,
			HetArchiefIeObjectSector.PUBLIC,
			HetArchiefIeObjectSector.RURAL,
		]);
	});

	it('Government Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(
			HetArchiefIeObjectSector.GOVERNMENT
		);
		expect(sectorsWithEssenceAccess).toEqual([
			HetArchiefIeObjectSector.CULTURE,
			HetArchiefIeObjectSector.GOVERNMENT,
			HetArchiefIeObjectSector.REGIONAL,
			HetArchiefIeObjectSector.PUBLIC,
			HetArchiefIeObjectSector.RURAL,
		]);
	});
	it('Regional Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(HetArchiefIeObjectSector.REGIONAL);
		expect(sectorsWithEssenceAccess).toEqual([
			HetArchiefIeObjectSector.CULTURE,
			HetArchiefIeObjectSector.GOVERNMENT,
			HetArchiefIeObjectSector.REGIONAL,
		]);
	});
	it('Public Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(HetArchiefIeObjectSector.PUBLIC);
		expect(sectorsWithEssenceAccess).toEqual([
			HetArchiefIeObjectSector.CULTURE,
			HetArchiefIeObjectSector.GOVERNMENT,
			HetArchiefIeObjectSector.REGIONAL,
			HetArchiefIeObjectSector.PUBLIC,
		]);
	});

	it('Rural Sector', () => {
		const sectorsWithEssenceAccess = getSectorsWithEssenceAccess(HetArchiefIeObjectSector.RURAL);
		expect(sectorsWithEssenceAccess).toEqual([
			HetArchiefIeObjectSector.CULTURE,
			HetArchiefIeObjectSector.GOVERNMENT,
			HetArchiefIeObjectSector.REGIONAL,
		]);
	});
});
