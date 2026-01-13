import { Lookup_App_Material_Request_Requester_Capacity_Enum } from '@meemoo/admin-core-api/dist/src/modules/shared/generated/graphql-db-types-hetarchief';
import { AvoAuthIdpType, PermissionName } from '@viaa/avo2-types';

import {
	CampaignMonitorCustomFieldName,
	type CampaignMonitorUserInfo,
	EmailTemplate,
	type MaterialRequestEmailInfo,
} from '../campaign-monitor.types';

import {
	CampaignMonitorConfirmMailQueryDto,
	CampaignMonitorConfirmationData,
	CampaignMonitorMaterialRequestData,
	CampaignMonitorNewsletterUpdatePreferencesQueryDto,
	RequestListItem,
} from '../dto/campaign-monitor.dto';

import type { SendRequestListDto } from '~modules/material-requests/dto/material-requests.dto';
import { mockMaterialRequest1 } from '~modules/material-requests/mocks/material-requests.mocks';
import { GroupId, GroupName, type User } from '~modules/users/types';
import { mockConfigService } from '~shared/test/mock-config-service';
import { Locale } from '~shared/types/types';

export const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	language: Locale.Nl,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [PermissionName.MANAGE_ALL_VISIT_REQUESTS, PermissionName.CREATE_VISIT_REQUEST],
	idp: AvoAuthIdpType.HETARCHIEF,
	isKeyUser: false,
	isEvaluator: false,
	createdAt: '2023-10-01T12:00:00.000Z',
	lastAccessAt: '2023-10-01T12:00:00.000Z',
	organisationName: 'Test Organisation',
};

export const mockUserInfo: CampaignMonitorUserInfo = {
	firstName: mockUser.firstName,
	lastName: mockUser.lastName,
	language: Locale.Nl,
	email: mockUser.email,
	is_key_user: mockUser.isKeyUser,
	usergroup: mockUser.groupName,
	created_date: mockUser.createdAt,
	last_access_date: mockUser.lastAccessAt,
	organisation: mockUser.organisationName,
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
	activation_url: `${mockConfigService.get(
		'HOST'
	)}/campaign-monitor/confirm-email?token=MjMyMjAwMGJkNmNiYjhiNTc0NmUwZDhmYjBhYWQxNmZmZTAwMWZkNWNhZWNjOWMyNmJhYzc1ODhkYWE2Mzk2Yw==&mail=test%40example.com&firstName=mockFirstName&lastName=mockLastName`,
};

export const mockSendRequestListDto: SendRequestListDto = {
	type: Lookup_App_Material_Request_Requester_Capacity_Enum.Other,
	organisation: 'Test Organisation',
};

export const mockMaterialRequestEmailInfo: MaterialRequestEmailInfo = {
	to: 'test@example.com',
	replyTo: 'test-cp@maintainer.be',
	template: EmailTemplate.MATERIAL_REQUEST_MAINTAINER,
	materialRequests: [mockMaterialRequest1],
	sendRequestListDto: mockSendRequestListDto,
	firstName: 'mockFirstName',
	lastName: 'mockLastName',
	language: Locale.Nl,
};

export const mockRequestListItemToMaintainer: RequestListItem = {
	title: mockMaterialRequest1.objectSchemaName,
	local_cp_id: mockMaterialRequest1.objectMeemooLocalId,
	pid: mockMaterialRequest1.objectSchemaIdentifier,
	page_url: `${mockConfigService.get('CLIENT_HOST')}/zoeken/${
		mockMaterialRequest1.maintainerSlug
	}/${mockMaterialRequest1.objectSchemaIdentifier}`,
	request_type: 'Ik wil dit object hergebruiken',
	request_description: mockMaterialRequest1.reason,
};

export const mockRequestListItemToRequester: RequestListItem = {
	title: mockMaterialRequest1.objectSchemaName,
	local_cp_id: mockMaterialRequest1.objectMeemooLocalId,
	cp_name: mockMaterialRequest1.maintainerName,
	pid: mockMaterialRequest1.objectSchemaIdentifier,
	page_url: `${mockConfigService.get('CLIENT_HOST')}/zoeken/${
		mockMaterialRequest1.maintainerSlug
	}/${mockMaterialRequest1.objectSchemaIdentifier}`,
	request_type: 'Ik wil dit object hergebruiken',
	request_description: mockMaterialRequest1.reason,
};

export const mockCampaignMonitorMaterialRequestDataToMaintainer: CampaignMonitorMaterialRequestData =
	{
		user_firstname: mockMaterialRequestEmailInfo.firstName,
		user_lastname: mockMaterialRequestEmailInfo.lastName,
		cp_name: mockMaterialRequestEmailInfo.materialRequests[0].maintainerName,
		request_list: [mockRequestListItemToMaintainer],
		user_request_context: 'Andere',
		user_organisation: mockMaterialRequestEmailInfo.sendRequestListDto.organisation,
		user_email: mockMaterialRequestEmailInfo.materialRequests[0].requesterMail,
	};

export const mockCampaignMonitorMaterialRequestDataToRequester: CampaignMonitorMaterialRequestData =
	{
		user_firstname: mockMaterialRequestEmailInfo.firstName,
		user_lastname: mockMaterialRequestEmailInfo.lastName,
		request_list: [mockRequestListItemToRequester],
		user_request_context: 'Andere',
		user_organisation: mockMaterialRequestEmailInfo.sendRequestListDto.organisation,
		user_email: mockMaterialRequestEmailInfo.materialRequests[0].requesterMail,
	};

export const mockNewsletterTemplateDataWithNewsletter = {
	EmailAddress: mockUserInfo.email,
	Name: `${mockUserInfo.firstName} ${mockUserInfo.lastName}`,
	Resubscribe: true,
	ConsentToTrack: 'Yes',
	CustomFields: [
		{
			Key: CampaignMonitorCustomFieldName.usergroup,
			Value: mockUserInfo.usergroup,
		},
		{
			Key: CampaignMonitorCustomFieldName.is_key_user,
			Value: mockUserInfo.is_key_user,
		},
		{
			Key: CampaignMonitorCustomFieldName.firstname,
			Value: mockUserInfo.firstName,
		},
		{
			Key: CampaignMonitorCustomFieldName.lastname,
			Value: mockUserInfo.lastName,
		},
		{
			Key: CampaignMonitorCustomFieldName.created_date,
			Value: '2023-10-01T12:00:00.000Z',
		},
		{
			Key: CampaignMonitorCustomFieldName.last_access_date,
			Value: '2023-10-01T12:00:00.000Z',
		},
		{
			Key: CampaignMonitorCustomFieldName.organisation,
			Value: 'Test Organisation',
		},
		{
			Key: CampaignMonitorCustomFieldName.language,
			Value: mockUserInfo.language,
		},
	],
};
