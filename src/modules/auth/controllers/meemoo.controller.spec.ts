import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MeemooService } from '../services/meemoo.service';

import { MeemooController } from './meemoo.controller';

const meemooLoginUrl = 'http://meemoo.be/login';

const ldapUser = {
	name_id: 'test@studiohyperdrive.be',
	entryUUID: ['291585e9-0541-4498-83cc-8c526e3762cb'],
};

const samlResponse = {
	RelayState: `{ "returnToUrl": "${meemooLoginUrl}" }`,
	SAMLResponse: 'dummy',
};

const mockMeemooService = {
	createLoginRequestUrl: jest.fn(),
	assertSamlResponse: jest.fn(),
};

describe('MeemooController', () => {
	let meemooController: MeemooController;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MeemooController],
			providers: [
				{
					provide: MeemooService,
					useValue: mockMeemooService,
				},
			],
		}).compile();

		meemooController = module.get<MeemooController>(MeemooController);
	});

	it('should be defined', () => {
		expect(meemooController).toBeDefined();
	});

	describe('login', () => {
		it('should redirect to the login url', async () => {
			mockMeemooService.createLoginRequestUrl.mockReturnValueOnce(meemooLoginUrl);
			const result = await meemooController.getAuth('http://hetarchief.be/start');
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: meemooLoginUrl,
			});
		});

		it('should catch an exception when generating the login url', async () => {
			mockMeemooService.createLoginRequestUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await meemooController.getAuth('http://hetarchief.be/start');
			expect(result).toBeUndefined();
		});
	});

	describe('login-callback', () => {
		it('Returns ldap user info on succesful login', async () => {
			mockMeemooService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			const result = await meemooController.loginCallback({}, samlResponse);
			expect(result).toEqual({
				ldapUser,
				info: meemooLoginUrl,
			});
		});

		it('should catch an exception when handling the saml response', async () => {
			mockMeemooService.assertSamlResponse.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await meemooController.loginCallback({}, samlResponse);
			expect(result).toBeUndefined();
		});
	});
});
