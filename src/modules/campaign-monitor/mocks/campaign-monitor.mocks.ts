import { MaterialRequestEmailInfo, Template } from '../campaign-monitor.types';

import { SendRequestListDto } from '~modules/material-requests/dto/material-requests.dto';
import { MaterialRequestListType } from '~modules/material-requests/material-requests.types';
import { mockMaterialRequest1 } from '~modules/material-requests/mocks/material-requests.mocks';

export const mockSendRequestListDto: SendRequestListDto = {
	type: MaterialRequestListType.OTHER,
	organisation: 'Test Organisation',
};

export const mockMaterialRequestEmailInfo: MaterialRequestEmailInfo = {
	to: 'testUser@domain.com',
	template: Template.MATERIAL_REQUEST_MAINTAINER,
	materialRequests: [mockMaterialRequest1],
	sendRequestListDto: mockSendRequestListDto,
	firstName: 'mockFirstName',
	lastName: 'mockLastName',
};
