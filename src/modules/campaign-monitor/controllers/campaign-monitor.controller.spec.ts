import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { CampaignMonitorService } from '../services/campaign-monitor.service';

import { CampaignMonitorController } from './campaign-monitor.controller';

import { TestingLogger } from '~shared/logging/test-logger';

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, jest.SpyInstance>> =
	{
		sendMail: jest.fn(),
	};

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => key),
};

describe('CampaignMonitorController', () => {
	let campaignMonitorController: CampaignMonitorController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CampaignMonitorController],
			imports: [],
			providers: [
				{
					provide: CampaignMonitorService,
					useValue: mockCampaignMonitorService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		campaignMonitorController =
			module.get<CampaignMonitorController>(CampaignMonitorController);
	});

	it('should be defined', () => {
		expect(campaignMonitorController).toBeDefined();
	});

	describe('sendMail', () => {
		it('should send an email', async () => {
			mockCampaignMonitorService.sendMail.mockResolvedValueOnce(true);

			const sent = await campaignMonitorController.sendMail({
				templateId: 'template-id-1',
				data: {
					to: 'test@studiohyperdrive.be',
					consentToTrack: 'unchanged',
					data: {},
				},
			});

			expect(sent).toBeTruthy();
		});
	});
});
