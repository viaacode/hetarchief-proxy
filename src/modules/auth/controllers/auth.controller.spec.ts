import { HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { IdpService } from '../services/idp.service';
import { Idp } from '../types';

import { AuthController } from './auth.controller';

const getNewMockSession = () => ({
	idp: Idp.HETARCHIEF,
	idpUserInfo: {
		session_not_on_or_after: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // one hour from now
	},
	archiefUserInfo: {},
});

describe('AuthController', () => {
	let authController: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			imports: [ConfigModule],
			providers: [IdpService],
		}).compile();

		authController = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(authController).toBeDefined();
	});

	describe('checkLogin', () => {
		it('should return a message on checkLogin', async () => {
			expect(await authController.checkLogin()).toEqual({ message: 'LOGGED_OUT' });
		});
	});

	describe('global-logout', () => {
		it('should return to an IDP-specific logout page if possible', async () => {
			const result = await authController.globalLogout(
				getNewMockSession(),
				'http://hetarchief.be/start'
			);
			expect(result).toEqual({
				url: 'undefined/auth/hetarchief/logout?returnToUrl=http%3A%2F%2Fhetarchief.be%2Fstart',
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
