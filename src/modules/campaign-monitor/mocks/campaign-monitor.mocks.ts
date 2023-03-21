import { MaterialRequestEmailInfo, Template } from '../campaign-monitor.types';
import { CampaignMonitorMaterialRequestData, RequestListItem } from '../dto/campaign-monitor.dto';

import { SendRequestListDto } from '~modules/material-requests/dto/material-requests.dto';
import { MaterialRequestListType } from '~modules/material-requests/material-requests.types';
import { mockMaterialRequest1 } from '~modules/material-requests/mocks/material-requests.mocks';

export const mockSendRequestListDto: SendRequestListDto = {
	type: MaterialRequestListType.OTHER,
	organisation: 'Test Organisation',
};

export const mockMaterialRequestEmailInfo: MaterialRequestEmailInfo = {
	to: 'test@example.com',
	template: Template.MATERIAL_REQUEST_MAINTAINER,
	materialRequests: [mockMaterialRequest1],
	sendRequestListDto: mockSendRequestListDto,
	firstName: 'mockFirstName',
	lastName: 'mockLastName',
};

export const mockRequestListItemToMaintainer: RequestListItem = {
	title: mockMaterialRequest1.objectSchemaName,
	local_cp_id: mockMaterialRequest1.objectMeemooLocalId,
	pid: mockMaterialRequest1.objectMeemooIdentifier,
	page_url: `${process.env.CLIENT_HOST}/zoeken/${mockMaterialRequest1.maintainerSlug}/${mockMaterialRequest1.objectSchemaIdentifier}`,
	request_type: mockMaterialRequest1.type,
	request_description: mockMaterialRequest1.reason,
};

export const mockRequestListItemToRequester: RequestListItem = {
	title: mockMaterialRequest1.objectSchemaName,
	local_cp_id: mockMaterialRequest1.objectMeemooLocalId,
	cp_name: mockMaterialRequest1.maintainerName,
	pid: mockMaterialRequest1.objectMeemooIdentifier,
	page_url: `${process.env.CLIENT_HOST}/zoeken/${mockMaterialRequest1.maintainerSlug}/${mockMaterialRequest1.objectSchemaIdentifier}`,
	request_type: mockMaterialRequest1.type,
	request_description: mockMaterialRequest1.reason,
};

export const mockCampaignMonitorMaterialRequestDataToMaintainer: CampaignMonitorMaterialRequestData =
	{
		user_firstname: mockMaterialRequestEmailInfo.firstName,
		user_lastname: mockMaterialRequestEmailInfo.lastName,
		cp_name: mockMaterialRequestEmailInfo.materialRequests[0].maintainerName,
		request_list: [mockRequestListItemToMaintainer],
		user_request_context: mockMaterialRequestEmailInfo.sendRequestListDto.type,
		user_organisation: mockMaterialRequestEmailInfo.sendRequestListDto.organisation,
		user_email: mockMaterialRequestEmailInfo.materialRequests[0].requesterMail,
	};

export const mockCampaignMonitorMaterialRequestDataToRequester: CampaignMonitorMaterialRequestData =
	{
		user_firstname: mockMaterialRequestEmailInfo.firstName,
		user_lastname: mockMaterialRequestEmailInfo.lastName,
		request_list: [mockRequestListItemToRequester],
		user_request_context: mockMaterialRequestEmailInfo.sendRequestListDto.type,
		user_organisation: mockMaterialRequestEmailInfo.sendRequestListDto.organisation,
		user_email: mockMaterialRequestEmailInfo.materialRequests[0].requesterMail,
	};
