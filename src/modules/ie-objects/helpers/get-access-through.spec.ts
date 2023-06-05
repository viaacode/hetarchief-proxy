import { IeObjectAccessThrough, IeObjectLicense } from './../ie-objects.types';
import { getAccessThrough } from './get-access-through';

describe('Access Through', () => {
	const hasIntraCpLicenses = [
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.INTRA_CP_CONTENT,
		IeObjectLicense.INTRA_CP_METADATA_ALL,
	].some((license: IeObjectLicense) =>
		[IeObjectLicense.INTRA_CP_CONTENT, IeObjectLicense.INTRA_CP_METADATA_ALL].includes(license)
	);

	const hasPublicLicenses = [
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.INTRA_CP_CONTENT,
		IeObjectLicense.INTRA_CP_METADATA_ALL,
	].some((license: IeObjectLicense) =>
		[IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIEK_METADATA_ALL].includes(
			license
		)
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

		expect(accessThrough).toEqual([IeObjectAccessThrough.PUBLIC_INFO]);
	});
	it('Should return SECTOR', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: false,
			hasFolderAccess: false,
			hasIntraCPLicenses: hasIntraCpLicenses,
			hasPublicLicenses: false,
		});

		expect(accessThrough).toEqual([IeObjectAccessThrough.SECTOR]);
	});
	it('Should return VISITOR_SPACE_FOLDERS', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: false,
			hasFolderAccess: true,
			hasIntraCPLicenses: false,
			hasPublicLicenses: false,
		});

		expect(accessThrough).toEqual([IeObjectAccessThrough.VISITOR_SPACE_FOLDERS]);
	});
	it('Should return VISITOR_SPACE_FULL', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: true,
			hasFolderAccess: false,
			hasIntraCPLicenses: false,
			hasPublicLicenses: false,
		});

		expect(accessThrough).toEqual([IeObjectAccessThrough.VISITOR_SPACE_FULL]);
	});
	it('Should return PUBLIC INFO & SECTOR & VISITOR_SPACE_FULL', () => {
		const accessThrough = getAccessThrough({
			hasFullAccess: true,
			hasFolderAccess: false,
			hasIntraCPLicenses: hasIntraCpLicenses,
			hasPublicLicenses: hasPublicLicenses,
		});

		expect(accessThrough).toEqual([
			IeObjectAccessThrough.SECTOR,
			IeObjectAccessThrough.VISITOR_SPACE_FULL,
			IeObjectAccessThrough.PUBLIC_INFO,
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
			IeObjectAccessThrough.SECTOR,
			IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
			IeObjectAccessThrough.PUBLIC_INFO,
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
			IeObjectAccessThrough.SECTOR,
			IeObjectAccessThrough.VISITOR_SPACE_FULL,
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
			IeObjectAccessThrough.SECTOR,
			IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
		]);
	});
});
