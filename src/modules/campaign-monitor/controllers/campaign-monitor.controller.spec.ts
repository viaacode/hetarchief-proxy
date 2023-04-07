import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { Configuration } from '~config';

import {
	mockNewsletterUpdatePreferencesQueryDto,
	mockSendMailQueryDto,
	mockUser,
} from '../mocks/campaign-monitor.mocks';
import { CampaignMonitorService } from '../services/campaign-monitor.service';

import { CampaignMonitorController } from './campaign-monitor.controller';

import { EventsService } from '~modules/events/services/events.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { TestingLogger } from '~shared/logging/test-logger';

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, jest.SpyInstance>> =
	{
		sendTransactionalMail: jest.fn(),
		fetchNewsletterPreferences: jest.fn(),
		updateNewsletterPreferences: jest.fn(),
		sendConfirmationMail: jest.fn(),
		confirmEmail: jest.fn(),
	};

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => key),
};

const mockEventsService: Partial<Record<keyof EventsService, jest.SpyInstance>> = {
	insertEvents: jest.fn(),
};

const mockRequest = { path: '/campaign-monitor/preferences', headers: {} } as unknown as Request;

describe('CampaignMonitorController', () => {
	let campaignMonitorController: CampaignMonitorController;
	const env = process.env;

	beforeEach(async () => {
		process.env.CLIENT_HOST = 'fakeClientHost';

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
				{
					provide: EventsService,
					useValue: mockEventsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		campaignMonitorController =
			module.get<CampaignMonitorController>(CampaignMonitorController);
	});

	afterEach(() => {
		process.env = env;
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

			expect(sent).toEqual({ message: 'success' });
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
	describe('updatePreferences', () => {
		it('update user newsletter preferences with logged in user', async () => {
			mockCampaignMonitorService.updateNewsletterPreferences.mockResolvedValueOnce({});

			const sent = await campaignMonitorController.updatePreferences(
				mockRequest,
				mockNewsletterUpdatePreferencesQueryDto,
				new SessionUserEntity({
					...mockUser,
				})
			);

			expect(sent).toEqual({ message: 'success' });
		});
		it('sent confirmation mail when no user is logged in', async () => {
			mockCampaignMonitorService.sendConfirmationMail.mockResolvedValueOnce({});

			const sent = await campaignMonitorController.updatePreferences(
				mockRequest,
				mockNewsletterUpdatePreferencesQueryDto
			);

			expect(sent).toEqual({ message: 'success' });
		});
	});

	describe('confirmMail', () => {
		it('redirect to nieuwsbrief/bevestiging when the token is valid', async () => {
			mockCampaignMonitorService.confirmEmail.mockResolvedValueOnce({});

			const result = await campaignMonitorController.confirmMail(mockSendMailQueryDto);

			expect(result).toEqual({
				url: `${process.env.CLIENT_HOST}/nieuwsbrief/bevestiging`,
			});
		});
		it('redirect to nieuwsbrief/mislukt when the token is invalid', async () => {
			mockCampaignMonitorService.confirmEmail.mockRejectedValueOnce({});

			const mockData = mockSendMailQueryDto;
			mockData.mail = 'invalid@mail.com';
			const result = await campaignMonitorController.confirmMail(mockData);

			expect(result).toEqual({
				url: `${process.env.CLIENT_HOST}/nieuwsbrief/mislukt`,
			});
			mockData.mail = 'test@example.com';
		});
	});
});
