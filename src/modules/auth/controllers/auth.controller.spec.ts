import { TranslationsService } from '@meemoo/admin-core-api';
import { HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { AvoAuthIdpType, PermissionName } from '@viaa/avo2-types';
import { isFuture } from 'date-fns';

import { IdpService } from '../services/idp.service';
import { LoginMessage, type LoginResponse } from '../types';

import { AuthController } from './auth.controller';

import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { SpacesModule } from '~modules/spaces';
import { UsersModule } from '~modules/users';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName, type User } from '~modules/users/types';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { sleep } from '~shared/helpers/sleep';
import { TestingLogger } from '~shared/logging/test-logger';
import { SessionService } from '~shared/services/session.service';
import { mockConfigService } from '~shared/test/mock-config-service';
import { Locale } from '~shared/types/types';

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	language: Locale.Nl,
	idp: AvoAuthIdpType.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [PermissionName.EDIT_ANY_CONTENT_PAGES],
	isKeyUser: false,
	lastAccessAt: undefined,
};

const getNewMockSession = () => ({
	idp: AvoAuthIdpType.HETARCHIEF,
	idpUserInfo: {
		session_not_on_or_after: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // one hour from now
	},
	archiefUserInfo: {
		email: 'test@studiohypderdrive.be',
	},
});

const mockSessionService: Partial<Record<keyof SessionService, jest.SpyInstance>> = {
	clearRedis: jest.fn(),
	getSessionConfig: jest.fn(),
};

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, jest.SpyInstance>> =
	{
		updateNewsletterPreferences: jest.fn(),
	};

describe('AuthController', () => {
	let authController: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			imports: [ConfigModule, SpacesModule, UsersModule, CampaignMonitorModule],
			providers: [
				IdpService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: SessionService,
					useValue: mockSessionService,
				},
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
				{
					provide: CampaignMonitorService,
					useValue: mockCampaignMonitorService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		authController = module.get<AuthController>(AuthController);
	});

	afterEach(() => {
		mockCampaignMonitorService.updateNewsletterPreferences.mockClear();
	});

	it('should be defined', () => {
		expect(authController).toBeDefined();
	});

	describe('checkLogin', () => {
		it('should return login info for a valid session and failed campaign monitor call', async () => {
			mockCampaignMonitorService.updateNewsletterPreferences.mockClear();
			mockCampaignMonitorService.updateNewsletterPreferences.mockRejectedValueOnce('');

			const checkLogin: LoginResponse = await authController.checkLogin(
				getNewMockSession(),
				new SessionUserEntity(mockUser)
			);

			expect(isFuture(new Date(checkLogin.sessionExpiresAt))).toBeTruthy();
			expect(checkLogin.userInfo).toEqual(mockUser);
			expect(checkLogin.message).toEqual('LOGGED_IN');

			await sleep(1000); // Wait for async campaign monitor call
		});

		it('should return login info for a valid session and successful campaign monitor call', async () => {
			mockCampaignMonitorService.updateNewsletterPreferences.mockClear();
			mockCampaignMonitorService.updateNewsletterPreferences.mockResolvedValueOnce({});

			const checkLogin: LoginResponse = await authController.checkLogin(
				getNewMockSession(),
				new SessionUserEntity(mockUser)
			);

			await sleep(1000); // Wait for async campaign monitor call

			expect(isFuture(new Date(checkLogin.sessionExpiresAt))).toBeTruthy();
			expect(checkLogin.userInfo).toEqual(mockUser);
			expect(checkLogin.message).toEqual('LOGGED_IN');
		});

		it('should return login info for a valid session and not call campaign monitor if lastAccessAt is today', async () => {
			mockCampaignMonitorService.updateNewsletterPreferences.mockClear();
			mockCampaignMonitorService.updateNewsletterPreferences.mockResolvedValueOnce({});

			const testUser = {
				...mockUser,
				lastAccessAt: new Date().toISOString(),
			};
			const checkLogin: LoginResponse = await authController.checkLogin(
				getNewMockSession(),
				new SessionUserEntity(testUser)
			);

			await sleep(1000); // Wait for async campaign monitor call

			expect(isFuture(new Date(checkLogin.sessionExpiresAt))).toBeTruthy();
			expect(checkLogin.userInfo).toEqual(testUser);
			expect(checkLogin.message).toEqual('LOGGED_IN');
			expect(mockCampaignMonitorService.updateNewsletterPreferences).toBeCalledTimes(0);
		});

		it('should return the logged out message for an invalid session', async () => {
			expect(await authController.checkLogin({}, new SessionUserEntity({} as any))).toEqual({
				message: LoginMessage.LOGGED_OUT,
			});
		});
	});

	describe('global-logout', () => {
		it('should return to an IDP-specific logout page if possible', async () => {
			const result = await authController.globalLogout(
				getNewMockSession(),
				'http://hetarchief.be/start'
			);
			expect(result).toEqual({
				url: `${mockConfigService.get(
					'HOST'
				)}/auth/hetarchief/logout?returnToUrl=http%3A%2F%2Fhetarchief.be%2Fstart`,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			});
		});

		it('should logout and return to the returnUrl if no specific logout page is set', async () => {
			const session = getNewMockSession();
			session.idp = null;

			const result = await authController.globalLogout(session, 'http://hetarchief.be/start');
			expect(result).toEqual({
				url: 'http://hetarchief.be/start',
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			});
			expect(session.idpUserInfo).toBeNull();
			expect(session.archiefUserInfo).toBeNull();
		});
	});
});
