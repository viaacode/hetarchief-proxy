import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HetArchiefService } from '../services/het-archief.service';

import { HetArchiefController } from './het-archief.controller';

const hetArchiefLoginUrl = 'http://hetarchief.be/login';
const ldapUser = {
	name_id: 'test@studiohyperdrive.be',
	entryUUID: ['291585e9-0541-4498-83cc-8c526e3762cb'],
};

const mockArchiefService = {
	createLoginRequestUrl: () => hetArchiefLoginUrl,
	assertSamlResponse: async () => ldapUser,
};

describe('AuthController', () => {
	let hetArchiefController: HetArchiefController;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [HetArchiefController],
			providers: [
				{
					provide: HetArchiefService,
					useValue: mockArchiefService,
				},
			],
		}).compile();

		hetArchiefController = module.get<HetArchiefController>(HetArchiefController);
	});

	it('should be defined', () => {
		expect(hetArchiefController).toBeDefined();
	});

	describe('login', () => {
		it('should redirect to the login url', async () => {
			const result = await hetArchiefController.getAuth('http://hetarchief.be/start');
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
		});
	});

	describe('login-callback', () => {
		it('Returns ldap user info on succesful login', async () => {
			const response = {
				RelayState: `{ "returnToUrl": "${hetArchiefLoginUrl}" }`,
				SAMLResponse: 'dummy',
			};
			const result = await hetArchiefController.loginCallback({}, response);
			expect(result).toEqual({
				ldapUser,
				info: hetArchiefLoginUrl,
			});
		});
	});
});
