import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { type Request } from 'express';

import {
	mockNewsletterUpdatePreferencesQueryDto,
	mockSendMailQueryDto,
	mockUser,
} from '../mocks/campaign-monitor.mocks';
import { CampaignMonitorService } from '../services/campaign-monitor.service';

import { CampaignMonitorController } from './campaign-monitor.controller';

import { EmailTemplate } from '~modules/campaign-monitor/campaign-monitor.types';
import { EventsService } from '~modules/events/services/events.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { UsersService } from '~modules/users/services/users.service';
import { TestingLogger } from '~shared/logging/test-logger';
import { mockConfigService } from '~shared/test/mock-config-service';

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, jest.SpyInstance>> =
	{
		sendTransactionalMail: jest.fn(),
		fetchNewsletterPreferences: jest.fn(),
		updateNewsletterPreferences: jest.fn(),
		sendConfirmationMail: jest.fn(),
		confirmEmail: jest.fn(),
	};

const mockEventsService: Partial<Record<keyof EventsService, jest.SpyInstance>> = {
	insertEvents: jest.fn(),
};

const mockUsersService: Partial<Record<keyof UsersService, jest.SpyInstance>> = {
	getById: jest.fn(),
};

const mockRequest = { path: '/campaign-monitor/preferences', headers: {} } as unknown as Request;

describe('CampaignMonitorController', () => {
	let campaignMonitorController: CampaignMonitorController;
	const env = process.env;

	beforeEach(async () => {
		process.env.CLIENT_HOST = 'fakeClientHost';

		const module: TestingModule = await Test.createTestingModule({
			controllers: [CampaignMonitorController],
			imports: [ConfigModule],
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
				{
					provide: UsersService,
					useValue: mockUsersService,
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
				template: EmailTemplate.VISIT_REQUEST_CP,
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
			mockUsersService.getById.mockResolvedValueOnce(mockUser);

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
			mockUsersService.getById.mockResolvedValueOnce(null);

			const sent = await campaignMonitorController.updatePreferences(
				mockRequest,
				mockNewsletterUpdatePreferencesQueryDto,
				null
			);

			expect(sent).toEqual({ message: 'success' });
		});
	});

	describe('confirmMail', () => {
		it('redirect to nieuwsbrief/bevestiging when the token is valid', async () => {
			mockCampaignMonitorService.confirmEmail.mockResolvedValueOnce({});

			const result = await campaignMonitorController.confirmMail(mockSendMailQueryDto, {
				path: 'campaign-monitor/confirm-email',
				headers: { ['x-viaa-request-id']: 'test-meemoo-request-id' },
			} as unknown as Request);

			expect(result).toEqual({
				url: `${process.env.CLIENT_HOST}/nieuwsbrief/bevestiging`,
			});
		});
		it('redirect to nieuwsbrief/mislukt when the token is invalid', async () => {
			mockCampaignMonitorService.confirmEmail.mockRejectedValueOnce({});

			const mockData = mockSendMailQueryDto;
			mockData.mail = 'invalid@mail.com';
			const result = await campaignMonitorController.confirmMail(mockData, {
				path: 'campaign-monitor/confirm-email',
				headers: { ['x-viaa-request-id']: 'test-meemoo-request-id' },
			} as unknown as Request);

			expect(result).toEqual({
				url: `${process.env.CLIENT_HOST}/nieuwsbrief/mislukt`,
			});
			mockData.mail = 'test@example.com';
		});
	});
});
