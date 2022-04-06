import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';

import { Configuration } from '~config';

import { Template } from '../types';

import { CampaignMonitorService } from './campaign-monitor.service';

import { Visit, VisitStatus } from '~modules/visits/types';

const mockConfigService = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'clientHost') {
			return 'http://bezoekerstool';
		}
		if (key === 'campaignMonitorApiEndpoint') {
			return 'http://campaignmonitor';
		}
		if (key === 'campaignMonitorTemplateVisitDenied') {
			return null;
		}

		return key;
	}),
};

const getMockVisit = (): Visit => ({
	id: '1',
	spaceId: 'space-1',
	spaceSlug: 'or-rf5kf25',
	spaceName: 'VRT',
	spaceMail: 'cp-VRT@studiohyperdrive.be',
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
		updatedAt: '2022-03-01T16:00:00',
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
		}).compile();

		campaignMonitorService = module.get<CampaignMonitorService>(CampaignMonitorService);
	});

	it('services should be defined', () => {
		expect(campaignMonitorService).toBeDefined();
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
		it('should send an email using campaign monitor', async () => {
			nock('http://campaignmonitor/')
				.post('/campaignMonitorTemplateVisitApproved/send')
				.reply(201, {});
			const visit = getMockVisit();
			const result = await campaignMonitorService.sendForVisit({
				to: [{ id: visit.visitorId, email: visit.visitorMail }],
				template: Template.VISIT_APPROVED,
				visit: getMockVisit(),
			});
			expect(result).toBeTruthy();
		});

		it('should log and not send to an empty recipients email adres', async () => {
			const visit = getMockVisit();
			const result = await campaignMonitorService.sendForVisit({
				to: [{ id: visit.visitorId, email: null }],
				template: Template.VISIT_APPROVED,
				visit: getMockVisit(),
			});
			expect(result).toBeFalsy();
		});

		it('should NOT call the campaign monitor if the template was not found', async () => {
			const visit = getMockVisit();
			const result = await campaignMonitorService.sendForVisit({
				template: Template.VISIT_DENIED, // Denied template is null and triggers the error
				visit,
				to: [{ id: visit.visitorId, email: visit.visitorMail }],
			});
			expect(result).toBeFalsy();
		});

		it('should NOT call the campaign monitor api if email sendig is disabled', async () => {
			campaignMonitorService.setIsEnabled(false);
			const visit = getMockVisit();
			const result = await campaignMonitorService.sendForVisit({
				template: Template.VISIT_APPROVED,
				visit,
				to: [{ id: visit.visitorId, email: visit.visitorMail }],
			});
			expect(result).toBeFalsy();
			campaignMonitorService.setIsEnabled(true);
		});

		it('should return false if there is no email adres', async () => {
			const result = await campaignMonitorService.sendForVisit({
				template: Template.VISIT_APPROVED,
				visit: getMockVisit(),
				to: [],
			});
			expect(result).toBeFalsy();
		});
	});
});
