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

import { Group } from '~modules/users/types';

describe('Limit access to object details', () => {
	// INT - ARC2.0: test cases voor licenties en gebruikersgroepen - https://docs.google.com/document/d/1Ejqag9Do7QngIBp2nj6sY0M1dYqO4Dh9ZFw0W3Vuwow/edit
	// -------------------------------------------------------------------------
	it('Test case 1 - user ziet uitgebreide metadataset op de detailpagina', () => {
		const limitedAccessIeObject = limitAccessToObjectDetails(
			// DPG Media (sector = RURAL) - INTRA LICENSES + VIAA-PUBLIEK_METADATA_ALL
			{
				...mockIeObject,
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, ...IE_OBJECT_INTRA_CP_LICENSES],
			},
			// Basic user - isKeyUser - Public Sector
			{
				...mockUserInfo,
				groupId: Group.VISITOR,
				isKeyUser: true,
				sector: IeObjectSector.PUBLIC,
				accessibleVisitorSpaceIds: [],
			}
		);

		expect(limitedAccessIeObject).toEqual({
			...mockIeObjectWithMetadataSetALL,
			licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL, ...IE_OBJECT_INTRA_CP_LICENSES],
			accessThrough: [IeObjectAccessThrough.SECTOR, IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('Test case 2 - user ziet uitgebreide metadataset en essence op de detailpagina', () => {
		const limitedAccessIeObject = limitAccessToObjectDetails(
			// ADVN (sector: culture) - INTRA LICENSES + VIAA-PUBLIEK_METADATA_LTD
			{
				...mockIeObject,
				sector: IeObjectSector.CULTURE,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD, ...IE_OBJECT_INTRA_CP_LICENSES],
			},
			// CP admin works for ADVN - hasVisitorSpace - Culture sector
			{
				...mockUserInfo,
				groupId: Group.CP_ADMIN,
				isKeyUser: true,
				sector: IeObjectSector.CULTURE,
			}
		);

		expect(limitedAccessIeObject).toEqual({
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
		const limitedAccessIeObject = limitAccessToObjectDetails(
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
				...mockUserInfo,
				groupId: Group.VISITOR,
				isKeyUser: true,
				sector: IeObjectSector.CULTURE,
			}
		);

		expect(limitedAccessIeObject).toEqual({
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
		const limitedAccessIeObject = limitAccessToObjectDetails(
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
				...mockUserInfo,
				groupId: Group.VISITOR,
				isKeyUser: false,
				sector: IeObjectSector.CULTURE,
				accessibleVisitorSpaceIds: [],
				accessibleObjectIdsThroughFolders: [
					'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
				],
			}
		);

		expect(limitedAccessIeObject).toEqual({
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

	it('Test case 5 - user ziet uitgebreide metadataset op de detailpagina', () => {
		const limitedAccessIeObject = limitAccessToObjectDetails(
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
				...mockUserInfo,
				groupId: Group.MEEMOO_ADMIN,
				isKeyUser: false,
				sector: null,
				maintainerId: 'OR-rf4kf25',
				accessibleVisitorSpaceIds: [],
				accessibleObjectIdsThroughFolders: [],
			}
		);

		expect(limitedAccessIeObject).toEqual({
			...mockIeObjectWithMetadataSetALL,
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.INTRA_CP_CONTENT,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
			],
			accessThrough: [IeObjectAccessThrough.SECTOR, IeObjectAccessThrough.PUBLIC_INFO],
		});
	});

	it('Test case 6 - user ziet object niet', () => {
		const limitedAccessIeObject = limitAccessToObjectDetails(
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
				...mockUserInfo,
				groupId: Group.KIOSK_VISITOR,
				isKeyUser: false,
				sector: IeObjectSector.CULTURE,
				accessibleVisitorSpaceIds: [],
				accessibleObjectIdsThroughFolders: [],
			}
		);

		expect(limitedAccessIeObject).toEqual(null);
	});

	it('Test case 7 - user ziet gelimiteerde metadataset op de detailpagina', () => {
		const limitedAccessIeObject = limitAccessToObjectDetails(
			// SBS Belgium (Rural)
			{
				...mockIeObject,
				sector: IeObjectSector.RURAL,
				licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			},
			// CP admin - isKeyUser - AVS (Regional sector)
			{
				...mockUserInfo,
				groupId: Group.CP_ADMIN,
				isKeyUser: true,
				sector: IeObjectSector.REGIONAL,
				accessibleVisitorSpaceIds: [],
				accessibleObjectIdsThroughFolders: [],
			}
		);

		expect(limitedAccessIeObject).toEqual({
			...mockIeObjectWithMetadataSetLTD,
			licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			accessThrough: [IeObjectAccessThrough.SECTOR],
		});
	});

	it('Test case 8 - user ziet uitgebreide metadataset en essence op de detailpagina', () => {
		const limitedAccessIeObject = limitAccessToObjectDetails(
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
				...mockUserInfo,
				groupId: Group.VISITOR,
				isKeyUser: true,
				sector: IeObjectSector.RURAL,
				accessibleObjectIdsThroughFolders: [],
			}
		);

		expect(limitedAccessIeObject).toEqual({
			...mockIeObjectWithMetadataSetALLWithEssence,
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				IeObjectLicense.INTRA_CP_METADATA_ALL,
				IeObjectLicense.INTRA_CP_CONTENT,
			],
			accessThrough: [
				IeObjectAccessThrough.SECTOR,
				IeObjectAccessThrough.VISITOR_SPACE_FULL,
				IeObjectAccessThrough.PUBLIC_INFO,
			],
		});
	});

	// -------------------------------------------------------------------------
});
