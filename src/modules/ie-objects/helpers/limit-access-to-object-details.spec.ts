import { IE_OBJECT_INTRA_CP_LICENSES } from '../ie-objects.conts';
import { IeObjectAccessThrough, IeObjectLicense, IeObjectSector } from '../ie-objects.types';
import {
	mockIeObject,
	mockIeObjectWithMetadataSetALL,
	mockIeObjectWithMetadataSetALLWithEssence,
	mockIeObjectWithMetadataSetLTD,
	mockUserInfo,
} from '../mocks/ie-objects.mock';

import { limitAccessToObjectDetails } from './limit-access-to-object-details';
import { LimitAccessUserInfo } from './limit-access-to-object-details.types';

import { GroupId } from '~modules/users/types';

describe('Limit access to object details', () => {
	// INT - ARC2.0: test cases voor licenties en gebruikersgroepen
	// https://docs.google.com/document/d/1Ejqag9Do7QngIBp2nj6sY0M1dYqO4Dh9ZFw0W3Vuwow/edit
	it('Test case 1 - user sees metadataset all on detail page', () => {
		const mockUserInfoTestCase1a: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.VISITOR,
			isKeyUser: true,
			sector: IeObjectSector.PUBLIC,
			accessibleVisitorSpaceIds: [],
		};
		const limitedAccessIeObject1a = limitAccessToObjectDetails(
			// DPG Media (sector = RURAL) - INTRA LICENSES + VIAA-PUBLIEK_METADATA_ALL
			{
				...mockIeObject,
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, ...IE_OBJECT_INTRA_CP_LICENSES],
			},
			// Basic user - isKeyUser - Public Sector
			mockUserInfoTestCase1a
		);
		expect(limitedAccessIeObject1a).toEqual({
			...mockIeObjectWithMetadataSetALL,
			licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, ...IE_OBJECT_INTRA_CP_LICENSES],
			accessThrough: [IeObjectAccessThrough.SECTOR, IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('Test case 2 - user sees metadataset all en essence on detail page', () => {
		const mockUserInfoTestCase2a: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.CP_ADMIN,
			isKeyUser: true,
			sector: IeObjectSector.CULTURE,
		};
		const limitedAccessIeObject1b = limitAccessToObjectDetails(
			// ADVN (sector: culture) - INTRA LICENSES + VIAA-PUBLIEK_METADATA_LTD
			{
				...mockIeObject,
				sector: IeObjectSector.CULTURE,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD, ...IE_OBJECT_INTRA_CP_LICENSES],
			},
			// CP admin works for ADVN - hasVisitorSpace - Culture sector
			mockUserInfoTestCase2a
		);
		expect(limitedAccessIeObject1b).toEqual({
			...mockIeObjectWithMetadataSetALLWithEssence,
			licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD, ...IE_OBJECT_INTRA_CP_LICENSES],
			accessThrough: [
				IeObjectAccessThrough.SECTOR,
				IeObjectAccessThrough.VISITOR_SPACE_FULL,
				IeObjectAccessThrough.PUBLIC_INFO,
			],
		});
	});

	it('Test case 3 - user sees metadataset all en essence on detail page', () => {
		const mockUserInfoTestCase3a: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.VISITOR,
			isKeyUser: true,
			sector: IeObjectSector.CULTURE,
		};
		const limitedAccessIeObject1c = limitAccessToObjectDetails(
			// VRT - VIAA-PUBLIEK_METADATA_LTD + VIAA-INTRA_CP-METADATA-ALL + BEZOEKERTOOL-CONTENT
			{
				...mockIeObject,
				sector: IeObjectSector.CULTURE,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.INTRA_CP_METADATA_ALL,
					IeObjectLicense.BEZOEKERTOOL_CONTENT,
				],
			},
			// Basis gebruiker - isKeyUser - Culture sector - temporary access visitor space VRT
			mockUserInfoTestCase3a
		);
		expect(limitedAccessIeObject1c).toEqual({
			...mockIeObjectWithMetadataSetALLWithEssence,
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.INTRA_CP_METADATA_ALL,
				IeObjectLicense.BEZOEKERTOOL_CONTENT,
			],
			accessThrough: [
				IeObjectAccessThrough.SECTOR,
				IeObjectAccessThrough.VISITOR_SPACE_FULL,
				IeObjectAccessThrough.PUBLIC_INFO,
			],
		});
	});

	it('Test case 4 - user sees metadataset all on detail page', () => {
		const mockUserInfoTestCase4a: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.VISITOR,
			isKeyUser: false,
			sector: IeObjectSector.CULTURE,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [mockIeObject.schemaIdentifier],
		};
		const limitedAccessIeObject1d = limitAccessToObjectDetails(
			// Amsa-ISG - VIAA-PUBLIEK_METADATA_LTD + BEZOEKERTOOL_METADATA_ALL
			{
				...mockIeObject,
				sector: IeObjectSector.CULTURE,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				],
			},
			// Basis gebruiker - temporary access visitor space Amsab-ISG - Culture sector
			mockUserInfoTestCase4a
		);
		expect(limitedAccessIeObject1d).toEqual({
			...mockIeObjectWithMetadataSetALL,
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
			],
			accessThrough: [
				IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
				IeObjectAccessThrough.PUBLIC_INFO,
			],
		});
	});

	it('Test case 4b - user sees metadataset limited on detail page', () => {
		const mockUserInfoTestCase4b: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.VISITOR,
			isKeyUser: false,
			sector: IeObjectSector.CULTURE,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [
				'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6743',
			],
		};
		const limitedAccessIeObject1da = limitAccessToObjectDetails(
			// Amsa-ISG - VIAA-PUBLIEK_METADATA_LTD + BEZOEKERTOOL_METADATA_ALL
			{
				...mockIeObject,
				sector: IeObjectSector.CULTURE,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				],
			},
			// Basis gebruiker - temporary access visitor space MAAR NIET VOOR Amsab-ISG - Culture sector
			mockUserInfoTestCase4b
		);
		expect(limitedAccessIeObject1da).toEqual({
			...mockIeObjectWithMetadataSetLTD,
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
			],
			accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('Test case 5 - user sees metadataset all on detail page', () => {
		const mockUserInfoTestCase5a: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.MEEMOO_ADMIN,
			isKeyUser: false,
			sector: null,
			maintainerId: 'OR-rf4kf25',
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject1e = limitAccessToObjectDetails(
			// DPG Media (sector = landelijke private omroep)
			{
				...mockIeObject,
				sector: IeObjectSector.CULTURE,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.INTRA_CP_CONTENT,
					IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				],
			},
			// MEEMOO ADMIN
			mockUserInfoTestCase5a
		);
		expect(limitedAccessIeObject1e).toEqual({
			...mockIeObjectWithMetadataSetALL,
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.INTRA_CP_CONTENT,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
			],
			accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it("Test case 6 - user doesn't see object", () => {
		const mockUserInfoTestCase6a: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.KIOSK_VISITOR,
			isKeyUser: false,
			sector: IeObjectSector.CULTURE,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject1f = limitAccessToObjectDetails(
			// Letterenhuis (Culture sector)
			{
				...mockIeObject,
				sector: IeObjectSector.CULTURE,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.BEZOEKERTOOL_CONTENT,
				],
			},
			// KIOSK - ADVN (Culture sector)
			mockUserInfoTestCase6a
		);
		expect(limitedAccessIeObject1f).toEqual(null);
	});

	it('Test case 7 - user sees limited metadataset on detail page', () => {
		const mockUserInfoTestCase7a: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.CP_ADMIN,
			isKeyUser: true,
			sector: IeObjectSector.REGIONAL,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject1g = limitAccessToObjectDetails(
			// SBS Belgium (Rural)
			{
				...mockIeObject,
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			},
			// CP admin - isKeyUser - AVS (Regional sector)
			mockUserInfoTestCase7a
		);
		expect(limitedAccessIeObject1g).toEqual({
			...mockIeObjectWithMetadataSetLTD,
			licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			accessThrough: [IeObjectAccessThrough.SECTOR],
		});
	});

	it('Test case 8 - user sees metadataset all and essence on detail page', () => {
		const mockUserInfoTestCase8a: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.VISITOR,
			isKeyUser: true,
			sector: IeObjectSector.RURAL,
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject1h = limitAccessToObjectDetails(
			// SBS Belgium (Rural)
			{
				...mockIeObject,
				sector: IeObjectSector.RURAL,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
					IeObjectLicense.INTRA_CP_METADATA_ALL,
					IeObjectLicense.INTRA_CP_CONTENT,
				],
			},
			// Basis gebruiker - isKeyUser - SBS Belgium (Rural)
			mockUserInfoTestCase8a
		);
		expect(limitedAccessIeObject1h).toEqual({
			...mockIeObjectWithMetadataSetALLWithEssence,
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				IeObjectLicense.INTRA_CP_METADATA_ALL,
				IeObjectLicense.INTRA_CP_CONTENT,
			],
			accessThrough: [IeObjectAccessThrough.SECTOR, IeObjectAccessThrough.VISITOR_SPACE_FULL],
		});
	});

	// -------------------------------------------------------------------------

	it('USER NO SECTOR - user sees metadataset all on detail page', () => {
		const mockUserInfoTestCaseNoSectorA: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.VISITOR,
			isKeyUser: false,
			sector: null,
			maintainerId: null,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject2a = limitAccessToObjectDetails(
			// DPG Media (sector = RURAL) - INTRA LICENSES + VIAA-PUBLIEK_METADATA_ALL
			{
				...mockIeObject,
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, ...IE_OBJECT_INTRA_CP_LICENSES],
			},
			// Basic user
			mockUserInfoTestCaseNoSectorA
		);
		expect(limitedAccessIeObject2a).toEqual({
			...mockIeObjectWithMetadataSetALL,
			licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, ...IE_OBJECT_INTRA_CP_LICENSES],
			accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('USER NO SECTOR - user (CP Admin) sees metadataset limited on detail page', () => {
		const mockUserInfoTestCaseNoSectorB: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.CP_ADMIN,
			isKeyUser: false,
			sector: null,
			maintainerId: null,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject2b = limitAccessToObjectDetails(
			// ADVN (sector: culture) - INTRA LICENSES + VIAA-PUBLIEK_METADATA_LTD
			{
				...mockIeObject,
				sector: IeObjectSector.CULTURE,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD, ...IE_OBJECT_INTRA_CP_LICENSES],
			},
			// CP admin
			mockUserInfoTestCaseNoSectorB
		);
		expect(limitedAccessIeObject2b).toEqual({
			...mockIeObjectWithMetadataSetLTD,
			licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD, ...IE_OBJECT_INTRA_CP_LICENSES],
			accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('USER NO SECTOR - user sees metadataset all on detail page', () => {
		const mockUserInfoTestCaseNoSectorC: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.MEEMOO_ADMIN,
			isKeyUser: false,
			sector: null,
			maintainerId: null,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject2d = limitAccessToObjectDetails(
			// DPG Media (sector = landelijke private omroep)
			{
				...mockIeObject,
				sector: IeObjectSector.CULTURE,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.INTRA_CP_CONTENT,
					IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				],
			},
			// MEEMOO ADMIN
			mockUserInfoTestCaseNoSectorC
		);
		expect(limitedAccessIeObject2d).toEqual({
			...mockIeObjectWithMetadataSetALL,
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.INTRA_CP_CONTENT,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
			],
			accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it("USER NO SECTOR - user doesn't see object", () => {
		const mockUserInfoTestCaseNoSectorD: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.KIOSK_VISITOR,
			isKeyUser: false,
			sector: null,
			maintainerId: null,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject2e = limitAccessToObjectDetails(
			// Letterenhuis (Culture sector)
			{
				...mockIeObject,
				sector: IeObjectSector.CULTURE,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.BEZOEKERTOOL_CONTENT,
				],
			},
			// KIOSK
			mockUserInfoTestCaseNoSectorD
		);
		expect(limitedAccessIeObject2e).toEqual(null);
	});

	it("USER NO SECTOR - user doesn't see object", () => {
		const mockUserInfoTestCaseNoSectorE: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.CP_ADMIN,
			isKeyUser: false,
			sector: null,
			maintainerId: null,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject2f = limitAccessToObjectDetails(
			// SBS Belgium (Rural)
			{
				...mockIeObject,
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			},
			// CP admin
			mockUserInfoTestCaseNoSectorE
		);
		expect(limitedAccessIeObject2f).toEqual(null);
	});

	it('ANONYMOUS USER, LIMITED METADATA - user sees object with limited metadata', () => {
		const mockUserInfoTestCaseNoSectorF: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: undefined,
			isKeyUser: false,
			sector: null,
			maintainerId: null,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject2f = limitAccessToObjectDetails(
			{
				...mockIeObject,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
			},
			// CP admin
			mockUserInfoTestCaseNoSectorF
		);
		expect(limitedAccessIeObject2f).toEqual({
			...mockIeObjectWithMetadataSetLTD,
			accessThrough: ['PUBLIC_INFO'],
		});
	});

	it('ANONYMOUS USER, LICENSES NULL - user should not see the object', () => {
		const mockUserInfoTestCaseNoSectorG: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: undefined,
			isKeyUser: false,
			sector: null,
			maintainerId: null,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject2f = limitAccessToObjectDetails(
			{
				...mockIeObject,
				licenses: null,
			},
			// CP admin
			mockUserInfoTestCaseNoSectorG
		);
		expect(limitedAccessIeObject2f).toEqual(null);
	});
});
