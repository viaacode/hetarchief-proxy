import { HetArchiefIeObjectAccessThrough, HetArchiefIeObjectLicense } from '@viaa/avo2-types';
import { describe, expect, it } from 'vitest';
import { getAccessThrough } from './get-access-through';

describe('Access Through', () => {
	const hasIntraCpLicenses = [
		HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL,
		HetArchiefIeObjectLicense.INTRA_CP_CONTENT,
		HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL,
	].some((license: HetArchiefIeObjectLicense) =>
		[
			HetArchiefIeObjectLicense.INTRA_CP_CONTENT,
			HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL,
		].includes(license)
	);

	const hasPublicLicenses = [
		HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL,
		HetArchiefIeObjectLicense.INTRA_CP_CONTENT,
		HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL,
	].some((license: HetArchiefIeObjectLicense) =>
		[
			HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD,
			HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL,
		].includes(license)
	);
	// INT - ARC2.0: test cases voor licenties en gebruikersgroepen - https://docs.google.com/document/d/1Ejqag9Do7QngIBp2nj6sY0M1dYqO4Dh9ZFw0W3Vuwow/edit
	// -------------------------------------------------------------------------
	it('Should return PUBLIC INFO', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: false,
			hasFolderAccess: false,
			hasIntraCPLicenses: false,
			hasPublicLicenses: hasPublicLicenses,
		});

		expect(accessThrough).toEqual([HetArchiefIeObjectAccessThrough.PUBLIC_INFO]);
	});
	it('Should return SECTOR', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: false,
			hasFolderAccess: false,
			hasIntraCPLicenses: hasIntraCpLicenses,
			hasPublicLicenses: false,
		});

		expect(accessThrough).toEqual([HetArchiefIeObjectAccessThrough.SECTOR]);
	});
	it('Should return VISITOR_SPACE_FOLDERS', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: false,
			hasFolderAccess: true,
			hasIntraCPLicenses: false,
			hasPublicLicenses: false,
		});

		expect(accessThrough).toEqual([HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FOLDERS]);
	});
	it('Should return VISITOR_SPACE_FULL', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: true,
			hasFolderAccess: false,
			hasIntraCPLicenses: false,
			hasPublicLicenses: false,
		});

		expect(accessThrough).toEqual([HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FULL]);
	});
	it('Should return PUBLIC INFO & SECTOR & VISITOR_SPACE_FULL', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: true,
			hasFolderAccess: false,
			hasIntraCPLicenses: hasIntraCpLicenses,
			hasPublicLicenses: hasPublicLicenses,
		});

		expect(accessThrough).toEqual([
			HetArchiefIeObjectAccessThrough.SECTOR,
			HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FULL,
			HetArchiefIeObjectAccessThrough.PUBLIC_INFO,
		]);
	});
	it('Should return PUBLIC INFO & SECTOR & VISITOR_SPACE_FOLDERS', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: false,
			hasFolderAccess: true,
			hasIntraCPLicenses: hasIntraCpLicenses,
			hasPublicLicenses: hasPublicLicenses,
		});

		expect(accessThrough).toEqual([
			HetArchiefIeObjectAccessThrough.SECTOR,
			HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
			HetArchiefIeObjectAccessThrough.PUBLIC_INFO,
		]);
	});
	it('Should return SECTOR & VISITOR_SPACE_FULL', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: true,
			hasFolderAccess: false,
			hasIntraCPLicenses: hasIntraCpLicenses,
			hasPublicLicenses: false,
		});

		expect(accessThrough).toEqual([
			HetArchiefIeObjectAccessThrough.SECTOR,
			HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FULL,
		]);
	});
	it('Should return SECTOR & VISITOR_SPACE_FOLDERS', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: false,
			hasFolderAccess: true,
			hasIntraCPLicenses: hasIntraCpLicenses,
			hasPublicLicenses: false,
		});

		expect(accessThrough).toEqual([
			HetArchiefIeObjectAccessThrough.SECTOR,
			HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
		]);
	});
});
