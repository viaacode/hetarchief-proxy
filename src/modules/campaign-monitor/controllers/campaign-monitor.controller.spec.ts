import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { CampaignMonitorService } from '../services/campaign-monitor.service';

import { CampaignMonitorController } from './campaign-monitor.controller';

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, jest.SpyInstance>> =
	{
		send: jest.fn(),
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
		}).compile();

		campaignMonitorController =
			module.get<CampaignMonitorController>(CampaignMonitorController);
	});

	it('should be defined', () => {
		expect(campaignMonitorController).toBeDefined();
	});

	describe('sendMail', () => {
		it('should send an email', async () => {
			mockCampaignMonitorService.send.mockResolvedValueOnce(true);

			const sent = await campaignMonitorController.sendMail({
				templateId: 'template-id-1',
				data: {
					To: 'test@studiohyperdrive.be',
					ConsentToTrack: 'unchanged',
					Data: {},
				},
			});

			expect(sent).toBeTruthy();
		});
	});
});
