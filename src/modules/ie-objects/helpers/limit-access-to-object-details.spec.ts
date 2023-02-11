import { Group } from '../../users/types';
import { IeObjectAccessThrough, IeObjectLicense, IeObjectSector } from '../ie-objects.types';
import {
	mockIeObject,
	mockIeObjectWithMetadataSetALL,
	mockIeObjectWithMetadataSetALLWithEssence,
	mockIeObjectWithMetadataSetLTD,
	mockUserInfo,
} from '../mocks/ie-objects.mock';

import { limitAccessToObjectDetails } from './limit-access-to-object-details';

describe('Limit access to object details', () => {
	it('Show object with props according to metadata set (METADATA_LTD)', () => {
		const limitedAccessIeObject = limitAccessToObjectDetails(mockIeObject, mockUserInfo);
		expect(limitedAccessIeObject).toEqual(mockIeObjectWithMetadataSetLTD);
	});

	it('Show object with props according to metadata set (METADATA_ALL)', () => {
		const limitedAccessIeObject = limitAccessToObjectDetails(
			{
				...mockIeObject,
				licenses: [...mockIeObject.licenses, IeObjectLicense.BEZOEKERTOOL_METADATA_ALL],
			},
			mockUserInfo
		);
		expect(limitedAccessIeObject).toEqual(mockIeObjectWithMetadataSetALL);
	});

	it('Show object with props according to metadata set (METADATA_ALL_WITH_ESSENCE)', () => {
		const limitedAccessIeObject = limitAccessToObjectDetails(
			{
				...mockIeObject,
				licenses: [IeObjectLicense.INTRA_CP_CONTENT],
			},
			{
				...mockUserInfo,
				groupId: Group.CP_ADMIN,
				isKeyUser: true,
			}
		);
		expect(limitedAccessIeObject).toEqual(mockIeObjectWithMetadataSetALLWithEssence);
	});

	it('Gebruiker die tot de REGIONALE OMROEP behoord ziet enkel een gelimiteerde dataset', () => {
		const limitedAccessIeObject = limitAccessToObjectDetails(
			{
				...mockIeObject,
				sector: IeObjectSector.RURAL,
				licenses: [
					IeObjectLicense.PUBLIEK_METADATA_LTD,
					IeObjectLicense.PUBLIEK_METADATA_ALL,
					IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
					IeObjectLicense.BEZOEKERTOOL_CONTENT,
					IeObjectLicense.INTRA_CP_METADATA_ALL,
					IeObjectLicense.INTRA_CP_CONTENT,
				],
			},
			{
				...mockUserInfo,
				groupId: Group.CP_ADMIN,
				isKeyUser: true,
				sector: IeObjectSector.REGIONAL,
			}
		);

		expect(limitedAccessIeObject).toEqual({
			...mockIeObjectWithMetadataSetLTD,
			licenses: [
				IeObjectLicense.PUBLIEK_METADATA_LTD,
				IeObjectLicense.PUBLIEK_METADATA_ALL,
				IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
				IeObjectLicense.BEZOEKERTOOL_CONTENT,
				IeObjectLicense.INTRA_CP_METADATA_ALL,
				IeObjectLicense.INTRA_CP_CONTENT,
			],
			accessThrough: IeObjectAccessThrough.SECTOR,
		});
	});
});
