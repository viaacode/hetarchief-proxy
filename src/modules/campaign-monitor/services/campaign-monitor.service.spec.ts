import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { CampaignMonitorService } from './campaign-monitor.service';

import { TestingLogger } from '~shared/logging/test-logger';

const mockConfigService = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'CLIENT_HOST') {
			return 'http://bezoekerstool';
		}
		if (key === 'CAMPAIGN_MONITOR_API_ENDPOINT') {
			return 'http://campaignmonitor';
		}

		return key;
	}),
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
		})
			.setLogger(new TestingLogger())
			.compile();

		campaignMonitorService = module.get<CampaignMonitorService>(CampaignMonitorService);
	});

	it('services should be defined', () => {
		expect(campaignMonitorService).toBeDefined();
	});

	//TODO: add test for send mail
});
