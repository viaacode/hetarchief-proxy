import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { mockUser } from '../mocks/campaign-monitor.mocks';
import { CampaignMonitorService } from '../services/campaign-monitor.service';

import { CampaignMonitorController } from './campaign-monitor.controller';

import { TestingLogger } from '~shared/logging/test-logger';

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, jest.SpyInstance>> =
	{
		sendTransactionalMail: jest.fn(),
		fetchNewsletterPreferences: jest.fn(),
		updateNewsletterPreferences: jest.fn(),
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

	describe('sendTransactionalMail', () => {
		it('should send an email', async () => {
			mockCampaignMonitorService.sendTransactionalMail.mockResolvedValueOnce(true);

			const sent = await campaignMonitorController.sendTransactionalMail({
				template: 'template-id-1',
				data: {
					to: 'test@studiohyperdrive.be',
					consentToTrack: 'unchanged',
					data: {},
				},
			});

			expect(sent).toBeTruthy();
		});
	});
	describe('getPreferences', () => {
		it('get user newsletter preferences', async () => {
			mockCampaignMonitorService.fetchNewsletterPreferences.mockResolvedValueOnce({
				newsletter: true,
			});

			const sent = await campaignMonitorController.getPreferences({
				email: 'test@studiohyperdrive.be',
			});

			expect(sent).toEqual({ newsletter: true });
		});
	});
	describe('getPreferences', () => {
		it('get user newsletter preferences', async () => {
			mockCampaignMonitorService.updateNewsletterPreferences.mockResolvedValueOnce({
				newsletter: true,
			});

			const sent = await campaignMonitorController.updatePreferences(
				{ newsletter: true },
				mockUser
			);

			// expect(sent).toEqual({ newsletter: true });
		});
	});
});
