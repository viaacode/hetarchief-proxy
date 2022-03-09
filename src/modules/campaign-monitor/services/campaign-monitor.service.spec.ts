import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';

import { Configuration } from '~config';

import { Template } from '../types';

import { CampaignMonitorService } from './campaign-monitor.service';

import { Visit, VisitStatus } from '~modules/visits/types';

const mockConfigService = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'campaignMonitorApiEndpoint') {
			return 'http://campaignmonitor';
		}
		if (key === 'campaignMonitorTemplateVisitDenied') {
			return null;
		}

		return key;
	}),
};

const mockVisit: Visit = {
	id: '1',
	spaceId: 'space-1',
	spaceName: 'VRT',
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
	visitorName: 'Tom Testerom',
};

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

	describe('send', () => {
		it('should send an email using campaign monitor', async () => {
			nock('http://campaignmonitor/')
				.post('/campaignMonitorTemplateVisitApproved/send')
				.reply(201, {});
			const result = await campaignMonitorService.send({
				to: 'test@studiohyperdrive.be',
				template: Template.VISIT_APPROVED,
				data: mockVisit,
			});
			expect(result).toBeTruthy();
		});

		it('should NOT call the campaign monitor if the template was not found', async () => {
			const result = await campaignMonitorService.send({
				to: 'test@studiohyperdrive.be',
				template: Template.VISIT_DENIED, // Denied template is null and triggers the error
				data: mockVisit,
			});
			expect(result).toBeFalsy();
		});

		it('should NOT call the campaign monitor api if email sendig is disabled', async () => {
			campaignMonitorService.setIsEnabled(false);
			const result = await campaignMonitorService.send({
				to: 'test@studiohyperdrive.be',
				template: Template.VISIT_APPROVED,
				data: mockVisit,
			});
			expect(result).toBeFalsy();
			campaignMonitorService.setIsEnabled(true);
		});
	});
});
