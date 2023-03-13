import { TranslationsService } from '@meemoo/admin-core-api';
import { HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { isFuture } from 'date-fns';

import { Configuration } from '~config';

import { IdpService } from '../services/idp.service';
import { LoginMessage, LoginResponse } from '../types';

import { AuthController } from './auth.controller';

import { SpacesModule } from '~modules/spaces';
import { UsersModule } from '~modules/users';
import { Idp } from '~shared/auth/auth.types';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { TestingLogger } from '~shared/logging/test-logger';
import { SessionService } from '~shared/services/session.service';

const getNewMockSession = () => ({
	idp: Idp.HETARCHIEF,
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

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'MEEMOO_ADMIN_ORGANIZATION_IDS') {
			return '1,2';
		}
		if (key === 'HOST') {
			return 'http://bezoek.test';
		}
		return key;
	}),
};

describe('AuthController', () => {
	let authController: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			imports: [ConfigModule, SpacesModule, UsersModule],
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
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		authController = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(authController).toBeDefined();
	});

	describe('checkLogin', () => {
		it('should return login info for a valid session', async () => {
			const checkLogin: LoginResponse = await authController.checkLogin(getNewMockSession());

			expect(isFuture(new Date(checkLogin.sessionExpiresAt))).toBeTruthy();
			expect(checkLogin.userInfo).toEqual({
				email: 'test@studiohypderdrive.be',
			});
			expect(checkLogin.message).toEqual('LOGGED_IN');
		});

		it('should return the logged out message for an invalid session', async () => {
			expect(await authController.checkLogin({})).toEqual({
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
				url: 'http://bezoek.test/auth/hetarchief/logout?returnToUrl=http%3A%2F%2Fhetarchief.be%2Fstart',
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
