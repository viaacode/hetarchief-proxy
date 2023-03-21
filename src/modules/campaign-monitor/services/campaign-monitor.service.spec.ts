import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';

import { Configuration } from '~config';

import { templateIds } from '../campaign-monitor.consts';
import { Template } from '../campaign-monitor.types';
import {
	mockCampaignMonitorMaterialRequestDataToMaintainer,
	mockCampaignMonitorMaterialRequestDataToRequester,
	mockMaterialRequestEmailInfo,
} from '../mocks/campaign-monitor.mocks';

import { CampaignMonitorService } from './campaign-monitor.service';

import { Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum } from '~generated/graphql-db-types-hetarchief';
import { Visit, VisitStatus } from '~modules/visits/types';
import { TestingLogger } from '~shared/logging/test-logger';

const mockConfigService = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'CLIENT_HOST') {
			return 'http://bezoekerstool';
		}
		if (key === 'CAMPAIGN_MONITOR_API_ENDPOINT') {
			return 'http://campaignmonitor';
		}
		if (key === 'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_VERSION') {
			return 'v3.2';
		}
		if (key === 'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_ENDPOINT') {
			return 'transactional/smartemail';
		}
		if (key === 'CAMPAIGN_MONITOR_TEMPLATE_VISIT_DENIED') {
			return null;
		}
		if (key === 'REROUTE_EMAILS_TO') {
			return '';
		}

		if (key === 'ENABLE_SEND_EMAIL') {
			return true;
		}

		return key;
	}),
};

const getMockVisit = (): Visit => ({
	id: '1',
	spaceId: 'space-1',
	spaceSlug: 'vrt',
	spaceMaintainerId: 'or-rf5kf25',
	spaceName: 'VRT',
	spaceMail: 'cp-VRT@studiohyperdrive.be',
	spaceTelephone: '0412 34 56 78',
	userProfileId: 'user-1',
	timeframe: 'july 2022',
	reason: 'fake news investigation',
	startAt: '2022-07-01T10:00:00',
	endAt: '2022-07-31T18:00:00',
	status: VisitStatus.APPROVED,
	note: {
		id: '7c672f64-287e-4598-befb-0cd0190124f7',
		note: 'Visit is limited to max. 2h',
		authorName: 'Ad Ministrator',
		createdAt: '2022-03-01T16:00:00',
	},
	createdAt: '2022-02-01T10:00:00',
	updatedAt: '2022-02-01T10:00:00',
	visitorId: 'user-1',
	visitorMail: 'test@studiohyperdrive.be',
	visitorFirstName: 'Tom',
	visitorLastName: 'Testerom',
	visitorName: 'Tom Testerom',
	updatedById: 'ea3d92ab-0281-4ffe-9e2d-be0e687e7cd1',
	updatedByName: 'CP Admin',
	accessType: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum.Full,
});

describe('CampaignMonitorService', () => {
	let campaignMonitorService: CampaignMonitorService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CampaignMonitorService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		campaignMonitorService = module.get<CampaignMonitorService>(CampaignMonitorService);
	});

	it('services should be defined', () => {
		expect(campaignMonitorService).toBeDefined();
	});

	describe('getAdminEmail', () => {
		it('should return the rerout email address if set', () => {
			campaignMonitorService.setRerouteEmailsTo('overrule@meemoo.be');
			expect(campaignMonitorService.getAdminEmail('me@meemoo.be')).toEqual(
				'overrule@meemoo.be'
			);
		});

		it('should return the rerout email address if set', () => {
			campaignMonitorService.setRerouteEmailsTo(undefined);
			expect(campaignMonitorService.getAdminEmail('me@meemoo.be')).toEqual('me@meemoo.be');
		});
	});

	describe('convertVisitToEmailTemplateData', () => {
		it('should parse visits with empty startAt / endAt', () => {
			const visit = getMockVisit();
			visit.startAt = null;
			visit.endAt = null;
			const result = campaignMonitorService.convertVisitToEmailTemplateData(visit);
			expect(result.start_date).toEqual('');
			expect(result.start_time).toEqual('');
			expect(result.end_date).toEqual('');
			expect(result.end_time).toEqual('');
		});
	});

	describe('sendForVisit', () => {
		// TODO: fix forVisit tests
		// it('should log and not send to an empty recipients email adres', async () => {
		// 	const visit = getMockVisit();
		// 	const result = await campaignMonitorService.sendForVisit({
		// 		to: [{ id: visit.visitorId, email: null }],
		// 		template: Template.VISIT_APPROVED,
		// 		visit: getMockVisit(),
		// 	});
		// 	expect(result).toBeFalsy();
		// });
		// TODO: fix forVisit tests
		// it('should NOT call the campaign monitor if the template was not found', async () => {
		// 	const visit = getMockVisit();
		// 	const result = await campaignMonitorService.sendForVisit({
		// 		template: Template.VISIT_DENIED, // Denied template is null and triggers the error
		// 		visit,
		// 		to: [{ id: visit.visitorId, email: visit.visitorMail }],
		// 	});
		// 	expect(result).toBeFalsy();
		// });
		// TODO: fix forVisit tests
		// it('should NOT call the campaign monitor api if email sendig is disabled', async () => {
		// 	campaignMonitorService.setIsEnabled(false);
		// 	const visit = getMockVisit();
		// 	const result = await campaignMonitorService.sendForVisit({
		// 		template: Template.VISIT_APPROVED,
		// 		visit,
		// 		to: [{ id: visit.visitorId, email: visit.visitorMail }],
		// 	});
		// 	expect(result).toBeFalsy();
		// 	campaignMonitorService.setIsEnabled(true);
		// });
		// TODO: fix forVisit tests
		// it('should return false if there is no email adres', async () => {
		// 	const result = await campaignMonitorService.sendForVisit({
		// 		template: Template.VISIT_APPROVED,
		// 		visit: getMockVisit(),
		// 		to: [],
		// 	});
		// 	expect(result).toBeFalsy();
		// });
	});

	describe('convertMaterialRequestsToEmailTemplateData', () => {
		it('should parse materialRequestEmailInfo with Maintainer Template', () => {
			const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
			const result =
				campaignMonitorService.convertMaterialRequestsToEmailTemplateData(
					materialRequestEmailInfo
				);
			expect(result).toEqual(mockCampaignMonitorMaterialRequestDataToMaintainer);
		});

		it('should parse materialRequestEmailInfo with Requester Template', () => {
			const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
			materialRequestEmailInfo.template = Template.MATERIAL_REQUEST_REQUESTER;
			const result =
				campaignMonitorService.convertMaterialRequestsToEmailTemplateData(
					materialRequestEmailInfo
				);
			expect(result).toEqual(mockCampaignMonitorMaterialRequestDataToRequester);
		});
	});
	describe('sendForMaterialRequest', () => {
		it('should log and not send to an empty recipients email adres, returns false', async () => {
			const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
			materialRequestEmailInfo.template = Template.MATERIAL_REQUEST_REQUESTER;
			materialRequestEmailInfo.to = null;
			const result = await campaignMonitorService.sendForMaterialRequest(
				materialRequestEmailInfo
			);
			expect(result).toBeFalsy();
		});

		it('should log and throw error with invalid template, returns false', async () => {
			const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
			materialRequestEmailInfo.template = Template.VISIT_DENIED;
			materialRequestEmailInfo.to = 'test@example.com';
			const result = await campaignMonitorService.sendForMaterialRequest(
				materialRequestEmailInfo
			);
			expect(result).toBeFalsy();
		});

		it('should NOT call the campaign monitor api if email sendig is disabled', async () => {
			campaignMonitorService.setIsEnabled(false);
			const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
			materialRequestEmailInfo.template = Template.MATERIAL_REQUEST_REQUESTER;
			const result = await campaignMonitorService.sendForMaterialRequest(
				materialRequestEmailInfo
			);
			expect(result).toBeFalsy();
			campaignMonitorService.setIsEnabled(true);
		});

		it('should return true when emailInfo has valid fields', async () => {
			nock(mockConfigService.get('CAMPAIGN_MONITOR_API_ENDPOINT') as string)
				.post(
					`/${mockConfigService.get(
						'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_VERSION'
					)}/${mockConfigService.get(
						'CAMPAIGN_MONITOR_TRANSACTIONAL_SEND_MAIL_API_ENDPOINT'
					)}/${templateIds[Template.MATERIAL_REQUEST_REQUESTER]}/send`
				)
				.reply(202, [
					{
						Status: 'Accepted',
						MessageID: '91206192-c71c-11ed-8c12-c59c777888d7',
						Recipient: 'test@example.com',
					},
				]);

			const materialRequestEmailInfo = mockMaterialRequestEmailInfo;
			materialRequestEmailInfo.template = Template.MATERIAL_REQUEST_REQUESTER;
			materialRequestEmailInfo.to = 'test@example.com';
			const result = await campaignMonitorService.sendForMaterialRequest(
				materialRequestEmailInfo
			);
			expect(result).toBeTruthy();
		});
	});
});
