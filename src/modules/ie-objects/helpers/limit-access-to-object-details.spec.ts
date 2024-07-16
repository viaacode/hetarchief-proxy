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
import { type LimitAccessUserInfo } from './limit-access-to-object-details.types';

import { GroupId } from '~modules/users/types';

describe('Limit access to object details', () => {
	// INT - ARC2.0: test cases voor licenties en gebruikersgroepen
	// https://docs.google.com/document/d/1Ejqag9Do7QngIBp2nj6sY0M1dYqO4Dh9ZFw0W3Vuwow/edit
	it('Test case 1 - user sees metadataset all on detail page', () => {
		const limitedAccessIeObject1a = limitAccessToObjectDetails(
			// Object: DPG Media (sector = RURAL) - INTRA LICENSES + VIAA-PUBLIEK_METADATA_ALL
			{
				...mockIeObject,
				maintainerId: 'OR-zp3w03v',
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, ...IE_OBJECT_INTRA_CP_LICENSES],
			},
			// User: Basic user - isKeyUser - Public Sector
			{
				...mockUserInfo,
				groupId: GroupId.VISITOR,
				isKeyUser: true,
				sector: IeObjectSector.PUBLIC,
				accessibleVisitorSpaceIds: [],
			}
		);
		expect(limitedAccessIeObject1a).toEqual({
			...mockIeObjectWithMetadataSetALL,
			maintainerId: 'OR-zp3w03v',
			licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, ...IE_OBJECT_INTRA_CP_LICENSES],
			accessThrough: [IeObjectAccessThrough.SECTOR, IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('Test case 2 - user sees metadataset all en essence on detail page', () => {
		const limitedAccessIeObject1b = limitAccessToObjectDetails(
			// Object: ADVN (sector: culture) - INTRA LICENSES + VIAA-PUBLIEK_METADATA_LTD
			{
				...mockIeObject,
				maintainerId: 'OR-xs5jg6w',
				sector: IeObjectSector.CULTURE,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD, ...IE_OBJECT_INTRA_CP_LICENSES],
			},
			// User: CP admin works for ADVN - hasVisitorSpace - Culture sector
			{
				...mockUserInfo,
				maintainerId: 'OR-xs5jg6w',
				accessibleVisitorSpaceIds: ['OR-xs5jg6w'],
				groupId: GroupId.CP_ADMIN,
				isKeyUser: true,
				sector: IeObjectSector.CULTURE,
			}
		);
		expect(limitedAccessIeObject1b).toEqual({
			...mockIeObjectWithMetadataSetALLWithEssence,
			maintainerId: 'OR-xs5jg6w',
			licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD, ...IE_OBJECT_INTRA_CP_LICENSES],
			accessThrough: [
				IeObjectAccessThrough.SECTOR,
				IeObjectAccessThrough.VISITOR_SPACE_FULL,
				IeObjectAccessThrough.PUBLIC_INFO,
			],
		});
	});

	it('Test case 3 - user sees metadataset all en essence on detail page', () => {
		const limitedAccessIeObject1c = limitAccessToObjectDetails(
			// Object: VRT - VIAA-PUBLIEK_METADATA_LTD + VIAA-INTRA_CP-METADATA-ALL + BEZOEKERTOOL-CONTENT
			{
				...mockIeObject,
				maintainerId: 'OR-rf5kf25',
				sector: IeObjectSector.CULTURE,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.INTRA_CP_METADATA_ALL,
					IeObjectLicense.BEZOEKERTOOL_CONTENT,
				],
			},
			// User: Basis gebruiker - isKeyUser - Culture sector - temporary access visitor space VRT
			{
				...mockUserInfo,
				groupId: GroupId.VISITOR,
				isKeyUser: true,
				sector: IeObjectSector.CULTURE,
			}
		);
		expect(limitedAccessIeObject1c).toEqual({
			...mockIeObjectWithMetadataSetALLWithEssence,
			maintainerId: 'OR-rf5kf25',
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
		const limitedAccessIeObject1d = limitAccessToObjectDetails(
			// Object: Amsa-ISG - VIAA-PUBLIEK_METADATA_LTD + BEZOEKERTOOL_METADATA_ALL
			{
				...mockIeObject,
				maintainerId: 'OR-154dn75',
				sector: IeObjectSector.CULTURE,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				],
			},
			// User: Basis gebruiker - folder access visitor space Amsab-ISG - Culture sector
			{
				...mockUserInfo,
				groupId: GroupId.VISITOR,
				isKeyUser: false,
				sector: IeObjectSector.CULTURE,
				accessibleVisitorSpaceIds: [],
				accessibleObjectIdsThroughFolders: [mockIeObject.schemaIdentifier],
			}
		);
		expect(limitedAccessIeObject1d).toEqual({
			...mockIeObjectWithMetadataSetALL,
			maintainerId: 'OR-154dn75',
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
		const limitedAccessIeObject1da = limitAccessToObjectDetails(
			// Object: Amsa-ISG - VIAA-PUBLIEK_METADATA_LTD + BEZOEKERTOOL_METADATA_ALL
			{
				...mockIeObject,
				maintainerId: 'OR-154dn75',
				sector: IeObjectSector.CULTURE,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				],
			},
			// User: Basis gebruiker - folder access visitor space MAAR NIET VOOR Amsab-ISG - Culture sector
			{
				...mockUserInfo,
				groupId: GroupId.VISITOR,
				isKeyUser: false,
				sector: IeObjectSector.CULTURE,
				accessibleVisitorSpaceIds: [],
				accessibleObjectIdsThroughFolders: [
					'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6743',
				],
			}
		);
		expect(limitedAccessIeObject1da).toEqual({
			...mockIeObjectWithMetadataSetLTD,
			maintainerId: 'OR-154dn75',
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
			],
			accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('Test case 5 - user sees metadataset all on detail page', () => {
		const limitedAccessIeObject1e = limitAccessToObjectDetails(
			// Object: DPG Media (sector = landelijke private omroep)
			{
				...mockIeObject,
				maintainerId: 'OR-zp3w03v',
				sector: IeObjectSector.RURAL,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.INTRA_CP_CONTENT,
					IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				],
			},
			// User: MEEMOO ADMIN
			{
				...mockUserInfo,
				groupId: GroupId.MEEMOO_ADMIN,
				isKeyUser: false,
				sector: null,
				maintainerId: 'OR-rf4kf25',
				accessibleVisitorSpaceIds: ['OR-zp3w03v', 'OR-rf4kf25', 'OR-rf5kf25'], // MEEMOO_ADMIN has access to all visitor spaces
				accessibleObjectIdsThroughFolders: [],
			}
		);
		expect(limitedAccessIeObject1e).toEqual({
			...mockIeObjectWithMetadataSetALL,
			maintainerId: 'OR-zp3w03v',
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.INTRA_CP_CONTENT,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
			],
			accessThrough: [
				IeObjectAccessThrough.VISITOR_SPACE_FULL,
				IeObjectAccessThrough.PUBLIC_INFO,
			],
		});
	});

	it("Test case 6 - user doesn't see object", () => {
		const limitedAccessIeObject1f = limitAccessToObjectDetails(
			// Object: Letterenhuis (Culture sector)
			{
				...mockIeObject,
				maintainerId: 'OR-kw57h48', // Letterenhuis
				sector: IeObjectSector.CULTURE,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.BEZOEKERTOOL_CONTENT,
				],
			},
			// User: KIOSK - ADVN (Culture sector)
			{
				...mockUserInfo,
				maintainerId: 'OR-xs5jg6w', // ADVN
				groupId: GroupId.KIOSK_VISITOR,
				isKeyUser: false,
				sector: IeObjectSector.CULTURE,
				accessibleVisitorSpaceIds: ['OR-xs5jg6w'],
				accessibleObjectIdsThroughFolders: [],
			}
		);
		expect(limitedAccessIeObject1f).toEqual(null);
	});

	it('Test case 7 - user sees limited metadataset on detail page', () => {
		const limitedAccessIeObject1g = limitAccessToObjectDetails(
			// Object: SBS Belgium (Rural)
			{
				...mockIeObject,
				maintainerId: 'OR-wh2dd79',
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			},
			// User: CP admin - isKeyUser - AVS (Regional sector)
			{
				...mockUserInfo,
				maintainerId: 'OR-h41jm06',
				groupId: GroupId.CP_ADMIN,
				isKeyUser: true,
				sector: IeObjectSector.REGIONAL,
				accessibleVisitorSpaceIds: ['OR-h41jm06'],
				accessibleObjectIdsThroughFolders: [],
			}
		);
		expect(limitedAccessIeObject1g).toEqual({
			...mockIeObjectWithMetadataSetLTD,
			maintainerId: 'OR-wh2dd79',
			licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			accessThrough: [IeObjectAccessThrough.SECTOR],
		});
	});

	it('Test case 8 - user sees metadataset all and essence on detail page', () => {
		const limitedAccessIeObject1h = limitAccessToObjectDetails(
			// Object: SBS Belgium (Rural)
			{
				...mockIeObject,
				maintainerId: 'OR-wh2dd79',
				sector: IeObjectSector.RURAL,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
					IeObjectLicense.INTRA_CP_METADATA_ALL,
					IeObjectLicense.INTRA_CP_CONTENT,
				],
			},
			// User: Basis gebruiker - isKeyUser - SBS Belgium (Rural)
			{
				...mockUserInfo,
				maintainerId: 'OR-wh2dd79',
				groupId: GroupId.VISITOR,
				isKeyUser: true,
				sector: IeObjectSector.RURAL,
				accessibleVisitorSpaceIds: [],
				accessibleObjectIdsThroughFolders: [],
			}
		);
		expect(limitedAccessIeObject1h).toEqual({
			...mockIeObjectWithMetadataSetALLWithEssence,
			maintainerId: 'OR-wh2dd79',
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				IeObjectLicense.INTRA_CP_METADATA_ALL,
				IeObjectLicense.INTRA_CP_CONTENT,
			],
			accessThrough: [IeObjectAccessThrough.SECTOR, IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('Test case 9 - user sees metadataset limited on detail page', () => {
		const limitedAccessIeObject1h = limitAccessToObjectDetails(
			// Object: SBS Belgium (Rural)
			{
				...mockIeObject,
				maintainerId: 'OR-wh2dd79',
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			},
			// User: Basis gebruiker - isKeyUser - SBS Belgium (Rural)
			{
				...mockUserInfo,
				maintainerId: 'OR-wh2dd79',
				groupId: GroupId.VISITOR,
				isKeyUser: true,
				sector: IeObjectSector.RURAL,
				accessibleVisitorSpaceIds: [],
				accessibleObjectIdsThroughFolders: [],
			}
		);
		expect(limitedAccessIeObject1h).toEqual({
			...mockIeObjectWithMetadataSetALLWithEssence,
			maintainerId: 'OR-wh2dd79',
			licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			accessThrough: [IeObjectAccessThrough.SECTOR],
		});
	});

	it('Test case 10 - user sees metadataset all on detail page', () => {
		const limitedAccessIeObject = limitAccessToObjectDetails(
			// Object: DPG Media (RURAL)
			{
				...mockIeObject,
				maintainerId: 'OR-zp3w03v',
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, IeObjectLicense.INTRA_CP_CONTENT],
			},
			// User: Basis gebruiker - isKeyUser - SBS Belgium (Rural)
			{
				...mockUserInfo,
				maintainerId: 'OR-wh2dd79',
				groupId: GroupId.VISITOR,
				isKeyUser: true,
				sector: IeObjectSector.RURAL,
				accessibleVisitorSpaceIds: [],
				accessibleObjectIdsThroughFolders: [],
			}
		);
		expect(limitedAccessIeObject).toEqual({
			...mockIeObjectWithMetadataSetALL,
			maintainerId: 'OR-zp3w03v',
			licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, IeObjectLicense.INTRA_CP_CONTENT],
			accessThrough: [IeObjectAccessThrough.SECTOR, IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('Test case 11 - user sees metadataset all on detail page', () => {
		const limitedAccessIeObject1h = limitAccessToObjectDetails(
			// Object: SBS Belgium (Rural)
			{
				...mockIeObject,
				maintainerId: 'OR-wh2dd79',
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.INTRA_CP_METADATA_ALL],
			},
			// User: Basis gebruiker - isKeyUser - SBS Belgium (Rural)
			{
				...mockUserInfo,
				maintainerId: 'OR-wh2dd79',
				groupId: GroupId.VISITOR,
				isKeyUser: true,
				sector: IeObjectSector.RURAL,
				accessibleVisitorSpaceIds: [],
				accessibleObjectIdsThroughFolders: [],
			}
		);
		expect(limitedAccessIeObject1h).toEqual({
			...mockIeObjectWithMetadataSetALL,
			maintainerId: 'OR-wh2dd79',
			licenses: [IeObjectLicense.INTRA_CP_METADATA_ALL],
			accessThrough: [IeObjectAccessThrough.SECTOR],
		});
	});

	// -------------------------------------------------------------------------

	it('USER visitor NO SECTOR - user sees metadataset all on detail page', () => {
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

	it('USER cp admin NO SECTOR - user (CP Admin) sees metadataset limited on detail page', () => {
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

	it('USER meemoo admin NO SECTOR - user sees metadataset all on detail page', () => {
		const mockUserInfoTestCaseNoSectorC: LimitAccessUserInfo = {
			...mockUserInfo,
			groupId: GroupId.MEEMOO_ADMIN,
			isKeyUser: false,
			sector: null,
			maintainerId: 'meemoo-or-id',
			accessibleVisitorSpaceIds: ['OR-rf5kf25'], // MEEMOO_ADMIN has access to all visitor spaces
			accessibleObjectIdsThroughFolders: [],
		};
		const limitedAccessIeObject2d = limitAccessToObjectDetails(
			// DPG Media (sector = landelijke private omroep)
			{
				...mockIeObject,
				sector: IeObjectSector.CULTURE,
				maintainerId: 'OR-rf5kf25',
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
			accessThrough: [
				IeObjectAccessThrough.VISITOR_SPACE_FULL,
				IeObjectAccessThrough.PUBLIC_INFO,
			],
		});
	});

	it('USER NO SECTOR - only show public metadata', () => {
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

	it("USER NO SECTOR - don't show object", () => {
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
