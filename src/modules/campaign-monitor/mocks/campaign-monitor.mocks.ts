import {
	CampaignMonitorUserInfo,
	MaterialRequestEmailInfo,
	Template,
} from '../campaign-monitor.types';
import {
	CampaignMonitorConfirmationData,
	CampaignMonitorConfirmMailQueryDto,
	CampaignMonitorMaterialRequestData,
	CampaignMonitorNewsletterUpdatePreferencesQueryDto,
	RequestListItem,
} from '../dto/campaign-monitor.dto';

import { SendRequestListDto } from '~modules/material-requests/dto/material-requests.dto';
import { MaterialRequestRequesterCapacity } from '~modules/material-requests/material-requests.types';
import { mockMaterialRequest1 } from '~modules/material-requests/mocks/material-requests.mocks';
import { GroupId, GroupName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

export const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [Permission.READ_ALL_VISIT_REQUESTS, Permission.CREATE_VISIT_REQUEST],
	idp: Idp.HETARCHIEF,
	isKeyUser: false,
};

export const mockUserInfo: CampaignMonitorUserInfo = {
	firstName: mockUser.firstName,
	lastName: mockUser.lastName,
	email: mockUser.email,
	is_key_user: mockUser.isKeyUser,
	usergroup: mockUser.groupName,
	created_date: mockUser?.createdAt || null,
	last_access_date: mockUser?.lastAccessAt || null,
	organisation: mockUser?.organisationName || null,
};

export const mockNewsletterUpdatePreferencesQueryDto: CampaignMonitorNewsletterUpdatePreferencesQueryDto =
	{
		firstName: 'mockFirstName',
		lastName: 'mockLastName',
		mail: 'test@example.com',
		preferences: {
			newsletter: true,
		},
	};

export const mockSendMailQueryDto: CampaignMonitorConfirmMailQueryDto = {
	token: 'MjMyMjAwMGJkNmNiYjhiNTc0NmUwZDhmYjBhYWQxNmZmZTAwMWZkNWNhZWNjOWMyNmJhYzc1ODhkYWE2Mzk2Yw==',
	firstName: 'mockFirstName',
	lastName: 'mockLastName',
	mail: 'test@example.com',
};

export const mockConfirmationData: CampaignMonitorConfirmationData = {
	firstname: 'mockFirstName',
	activation_url:
		'http://fakeclienthost/campaign-monitor/confirm-email?token=MjMyMjAwMGJkNmNiYjhiNTc0NmUwZDhmYjBhYWQxNmZmZTAwMWZkNWNhZWNjOWMyNmJhYzc1ODhkYWE2Mzk2Yw==&mail=test%40example.com&firstName=mockFirstName&lastName=mockLastName',
};

export const mockSendRequestListDto: SendRequestListDto = {
	type: MaterialRequestRequesterCapacity.OTHER,
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
	page_url: `http://bezoekerstool/zoeken/${mockMaterialRequest1.maintainerSlug}/${mockMaterialRequest1.objectSchemaIdentifier}`,
	request_type: mockMaterialRequest1.type,
	request_description: mockMaterialRequest1.reason,
};

export const mockRequestListItemToRequester: RequestListItem = {
	title: mockMaterialRequest1.objectSchemaName,
	local_cp_id: mockMaterialRequest1.objectMeemooLocalId,
	cp_name: mockMaterialRequest1.maintainerName,
	pid: mockMaterialRequest1.objectMeemooIdentifier,
	page_url: `http://bezoekerstool/zoeken/${mockMaterialRequest1.maintainerSlug}/${mockMaterialRequest1.objectSchemaIdentifier}`,
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
	EmailAddress: mockUserInfo.email,
	Name: mockUserInfo.firstName + ' ' + mockUserInfo.lastName,
	Resubscribe: true,
	ConsentToTrack: 'Yes',
	CustomFields: [
		{
			Key: 'usergroup',
			Value: mockUserInfo.usergroup,
		},
		{
			Key: 'is_key_user',
			Value: mockUserInfo.is_key_user,
		},
		{
			Key: 'firstname',
			Value: mockUserInfo.firstName,
		},
		{
			Key: 'lastname',
			Value: mockUserInfo.lastName,
		},
		{
			Key: 'created_date',
			Value: null,
		},
		{
			Key: 'last_access_date',
			Value: null,
		},
		{
			Key: 'organisation',
			Value: null,
		},
		{
			Key: 'optin_mail_lists',
			Value: 'newsletter',
		},
	],
};
