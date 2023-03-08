import { IE_OBJECT_INTRA_CP_LICENSES, IE_OBJECT_LICENSES_BY_USER_GROUP } from '../ie-objects.conts';
import {
	IeObjectAccessThrough,
	IeObjectExtraUserGroupType,
	IeObjectLicense,
	IeObjectSector,
} from '../ie-objects.types';
import {
	mockIeObject,
	mockIeObjectWithMetadataSetALL,
	mockIeObjectWithMetadataSetALLWithEssence,
	mockIeObjectWithMetadataSetLTD,
	mockUserInfo,
} from '../mocks/ie-objects.mock';

import { limitAccessToObjectDetails } from './limit-access-to-object-details';

import { Group } from '~modules/users/types';

describe('Limit access to object details', () => {
	// INT - ARC2.0: test cases voor licenties en gebruikersgroepen
	// https://docs.google.com/document/d/1Ejqag9Do7QngIBp2nj6sY0M1dYqO4Dh9ZFw0W3Vuwow/edit
	it('Test case 1 - user ziet uitgebreide metadataset op de detailpagina', () => {
		const mockUserInfoTestCase1a = {
			...mockUserInfo,
			groupId: Group.VISITOR,
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
			{
				...mockUserInfoTestCase1a,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCase1a.groupId ?? IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
		);
		expect(limitedAccessIeObject1a).toEqual({
			...mockIeObjectWithMetadataSetALL,
			licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, ...IE_OBJECT_INTRA_CP_LICENSES],
			accessThrough: [IeObjectAccessThrough.SECTOR, IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('Test case 2 - user ziet uitgebreide metadataset en essence op de detailpagina', () => {
		const mockUserInfoTestCase2a = {
			...mockUserInfo,
			groupId: Group.CP_ADMIN,
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
			{
				...mockUserInfoTestCase2a,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCase2a.groupId ?? IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
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

	it('Test case 3 - user ziet uitgebreide metadataset en essence op de detailpagina', () => {
		const mockUserInfoTestCase3a = {
			...mockUserInfo,
			groupId: Group.VISITOR,
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
			{
				...mockUserInfoTestCase3a,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCase3a.groupId ?? IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
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

	it('Test case 4 - user ziet uitgebreide metadataset op de detailpagina', () => {
		const mockUserInfoTestCase4a = {
			...mockUserInfo,
			groupId: Group.VISITOR,
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
			{
				...mockUserInfoTestCase4a,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCase4a.groupId ?? IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
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

	it('Test case 4b - user ziet gelimiteerde metadataset op de detailpagina', () => {
		const mockUserInfoTestCase4b = {
			...mockUserInfo,
			groupId: Group.VISITOR,
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
			{
				...mockUserInfoTestCase4b,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCase4b.groupId ?? IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
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

	it('Test case 5 - user ziet uitgebreide metadataset op de detailpagina', () => {
		const mockUserInfoTestCase5a = {
			...mockUserInfo,
			groupId: Group.MEEMOO_ADMIN,
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
			{
				...mockUserInfoTestCase5a,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCase5a.groupId ?? IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
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

	it('Test case 6 - user ziet object niet', () => {
		const mockUserInfoTestCase6a = {
			...mockUserInfo,
			groupId: Group.KIOSK_VISITOR,
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
			{
				...mockUserInfoTestCase6a,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCase6a.groupId ?? IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
		);
		expect(limitedAccessIeObject1f).toEqual(null);
	});

	it('Test case 7 - user ziet gelimiteerde metadataset op de detailpagina', () => {
		const mockUserInfoTestCase7a = {
			...mockUserInfo,
			groupId: Group.CP_ADMIN,
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
			{
				...mockUserInfoTestCase7a,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCase7a.groupId ?? IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
		);
		expect(limitedAccessIeObject1g).toEqual({
			...mockIeObjectWithMetadataSetLTD,
			licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			accessThrough: [IeObjectAccessThrough.SECTOR],
		});
	});

	it('Test case 8 - user ziet uitgebreide metadataset en essence op de detailpagina', () => {
		const mockUserInfoTestCase8a = {
			...mockUserInfo,
			groupId: Group.VISITOR,
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
			{
				...mockUserInfoTestCase8a,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCase8a.groupId ?? IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
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

	it('USER GEEN SECTOR - user ziet gelimiteerd metadataset op de detailpagina', () => {
		const mockUserInfoTestCaseNoSectorA = {
			...mockUserInfo,
			groupId: Group.VISITOR,
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
			{
				...mockUserInfoTestCaseNoSectorA,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCaseNoSectorA.groupId ??
							IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
		);
		expect(limitedAccessIeObject2a).toEqual({
			...mockIeObjectWithMetadataSetALL,
			licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, ...IE_OBJECT_INTRA_CP_LICENSES],
			accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('USER GEEN SECTOR - user (CP Admin) ziet gelimiteerd metadataset op de detailpagina', () => {
		const mockUserInfoTestCaseNoSectorB = {
			...mockUserInfo,
			groupId: Group.CP_ADMIN,
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
			{
				...mockUserInfoTestCaseNoSectorB,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCaseNoSectorB.groupId ??
							IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
		);
		expect(limitedAccessIeObject2b).toEqual({
			...mockIeObjectWithMetadataSetLTD,
			licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD, ...IE_OBJECT_INTRA_CP_LICENSES],
			accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('USER GEEN SECTOR - user ziet uitgebreide metadataset op de detailpagina', () => {
		const mockUserInfoTestCaseNoSectorC = {
			...mockUserInfo,
			groupId: Group.MEEMOO_ADMIN,
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
			{
				...mockUserInfoTestCaseNoSectorC,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCaseNoSectorC.groupId ??
							IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
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

	it('USER GEEN SECTOR - user ziet object niet', () => {
		const mockUserInfoTestCaseNoSectorD = {
			...mockUserInfo,
			groupId: Group.KIOSK_VISITOR,
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
			{
				...mockUserInfoTestCaseNoSectorD,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCaseNoSectorD.groupId ??
							IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
		);
		expect(limitedAccessIeObject2e).toEqual(null);
	});

	it('USER GEEN SECTOR - user ziet gelimiteerd metadataset op de detailpagina', () => {
		const mockUserInfoTestCaseNoSectorE = {
			...mockUserInfo,
			groupId: Group.CP_ADMIN,
			isKeyUser: false,
			sector: null,
			maintainerId: null,
			accessibleVisitorSpaceIds: [],
			accessibleObjectIdsThroughFolders: [],
			licensesByUserGroup:
				IE_OBJECT_LICENSES_BY_USER_GROUP[
					Group.CP_ADMIN ?? IeObjectExtraUserGroupType.ANONYMOUS
				],
		};
		const limitedAccessIeObject2f = limitAccessToObjectDetails(
			// SBS Belgium (Rural)
			{
				...mockIeObject,
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			},
			// CP admin
			{
				...mockUserInfoTestCaseNoSectorE,
				licensesByUserGroup:
					IE_OBJECT_LICENSES_BY_USER_GROUP[
						mockUserInfoTestCaseNoSectorE.groupId ??
							IeObjectExtraUserGroupType.ANONYMOUS
					],
			}
		);
		expect(limitedAccessIeObject2f).toEqual(null);
	});
});
