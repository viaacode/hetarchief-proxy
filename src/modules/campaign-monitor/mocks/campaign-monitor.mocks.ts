import { Group, GroupIdToName } from '@meemoo/admin-core-api';

import { MaterialRequestEmailInfo, Template } from '../campaign-monitor.types';
import { CampaignMonitorMaterialRequestData, RequestListItem } from '../dto/campaign-monitor.dto';

import { SendRequestListDto } from '~modules/material-requests/dto/material-requests.dto';
import { MaterialRequestListType } from '~modules/material-requests/material-requests.types';
import { mockMaterialRequest1 } from '~modules/material-requests/mocks/material-requests.mocks';
import { Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

export const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.READ_ALL_VISIT_REQUESTS, Permission.CREATE_VISIT_REQUEST],
	idp: Idp.HETARCHIEF,
	isKeyUser: false,
};

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

export const mockNewsletterTemplateDataWithNewsletter = {
	EmailAddress: mockUser.email,
	Name: mockUser.fullName,
	Resubscribe: true,
	ConsentToTrack: 'Yes',
	CustomFields: [
		{
			Key: 'optin_mail_lists',
			Value: 'newsletter',
			Clear: false,
		},
		{
			Key: 'gebruikersgroep',
			Value: mockUser.groupId,
			Clear: false,
		},
		{
			Key: 'is_sleutel_gebruiker',
			Value: mockUser.isKeyUser,
			Clear: false,
		},
		{
			Key: 'firstname',
			Value: mockUser.firstName,
			Clear: false,
		},
		{
			Key: 'lastname',
			Value: mockUser.lastName,
			Clear: false,
		},
		{
			Key: 'aangemaakt_op',
			Value: null,
			Clear: true,
		},
		{
			Key: 'laatst_ingelogd_op',
			Value: null,
			Clear: true,
		},
		{
			Key: 'organisatie',
			Value: null,
			Clear: true,
		},
	],
};

// export const mockNewsletterTemplateDataWithoutNewsletter = {
// 	EmailAddress: mockUser.email,
// 	Name: mockUser.fullName,
// 	Resubscribe: true,
// 	ConsentToTrack: 'Yes',
// 	CustomFields: [
// 		{
// 			Key: 'optin_mail_lists',
// 			Value: null,
// 			Clear: false,
// 		},
// 		{
// 			Key: 'gebruikersgroep',
// 			Value: mockUser.groupId,
// 			Clear: false,
// 		},
// 		{
// 			Key: 'is_sleutel_gebruiker',
// 			Value: mockUser.isKeyUser,
// 			Clear: false,
// 		},
// 		{
// 			Key: 'firstname',
// 			Value: mockUser.firstName,
// 			Clear: false,
// 		},
// 		{
// 			Key: 'lastname',
// 			Value: mockUser.lastName,
// 			Clear: false,
// 		},
// 		{
// 			Key: 'aangemaakt_op',
// 			Value: null,
// 			Clear: true,
// 		},
// 		{
// 			Key: 'laatst_ingelogd_op',
// 			Value: null,
// 			Clear: true,
// 		},
// 		{
// 			Key: 'organisatie',
// 			Value: null,
// 			Clear: true,
// 		},
// 	],
// };
