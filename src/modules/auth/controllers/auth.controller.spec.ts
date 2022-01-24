import { Test, TestingModule } from '@nestjs/testing';
import { isFuture } from 'date-fns';

import { Idp, LoginMessage, LoginResponse } from '../types';

import { AuthController } from './auth.controller';

const mockSession = {
	idp: Idp.HETARCHIEF,
	idpUserInfo: {
		session_not_on_or_after: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // one hour from now
	},
	archiefUserInfo: {
		email: 'test@studiohypderdrive.be',
	},
};

describe('AuthController', () => {
	let authController: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
		}).compile();

		authController = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(authController).toBeDefined();
	});

	describe('checkLogin', () => {
		it('should return login info for a valid session', async () => {
			const checkLogin: LoginResponse = await authController.checkLogin(mockSession);

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
});
