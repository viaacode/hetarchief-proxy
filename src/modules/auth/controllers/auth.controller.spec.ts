import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';

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

	describe('logout', () => {
		it('should return OK on logout', async () => {
			expect(await authController.logout()).toBe('OK');
		});
	});
});
