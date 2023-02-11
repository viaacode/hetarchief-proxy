import { Group } from '../../users/types';
import { IeObjectLicense } from '../ie-objects.types';
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
});
