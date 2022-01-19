import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HetArchiefService } from '../services/het-archief.service';

import { HetArchiefController } from './het-archief.controller';

import { UsersService } from '~modules/users/services/users.service';

const hetArchiefLoginUrl = 'http://hetarchief.be/login';

const ldapUser = {
	attributes: {
		givenName: ['Tom'],
		sn: ['Testerom'],
		mail: ['test@studiohyperdrive.be'],
		name_id: 'test@studiohyperdrive.be',
		entryUUID: ['291585e9-0541-4498-83cc-8c526e3762cb'],
		apps: ['hetarchief'],
	},
};

const archiefUser = {
	id: '1',
	firstName: 'Tom',
	lastName: 'Testerom',
	email: 'test@studiohyperdrive.be',
};

const samlResponse = {
	RelayState: `{ "returnToUrl": "${hetArchiefLoginUrl}" }`,
	SAMLResponse: 'dummy',
};

const mockArchiefService = {
	createLoginRequestUrl: jest.fn(),
	assertSamlResponse: jest.fn(),
};

const mockUsersService = {
	getUserByIdentityId: jest.fn(),
	createUserWithIdp: jest.fn(),
	updateUser: jest.fn(),
};

describe('HetArchiefController', () => {
	let hetArchiefController: HetArchiefController;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [HetArchiefController],
			providers: [
				{
					provide: HetArchiefService,
					useValue: mockArchiefService,
				},
				{
					provide: UsersService,
					useValue: mockUsersService,
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
			mockArchiefService.createLoginRequestUrl.mockReturnValueOnce(hetArchiefLoginUrl);
			const result = await hetArchiefController.getAuth({}, 'http://hetarchief.be/start');
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
		});

		it('should catch an exception when generating the login url', async () => {
			mockArchiefService.createLoginRequestUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await hetArchiefController.getAuth({}, 'http://hetarchief.be/start');
			expect(result).toBeUndefined();
		});
	});

	describe('login-callback', () => {
		it('should redirect after succesful login with a known user', async () => {
			mockArchiefService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce(archiefUser);

			const result = await hetArchiefController.loginCallback({}, samlResponse);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).not.toBeCalled();
			expect(mockUsersService.updateUser).not.toBeCalled();
		});

		it('should create an authorized user that is not yet in the database', async () => {
			mockArchiefService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce(null);
			mockUsersService.createUserWithIdp.mockReturnValueOnce(archiefUser);

			const result = await hetArchiefController.loginCallback({}, samlResponse);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).toBeCalled();
			expect(mockUsersService.updateUser).not.toBeCalled();
			mockUsersService.createUserWithIdp.mockClear();
		});

		it('should update an authorized user that is was changed in ldap', async () => {
			mockArchiefService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce({
				...archiefUser,
				firstName: 'Tom2',
			});
			mockUsersService.updateUser.mockReturnValueOnce(archiefUser);

			const result = await hetArchiefController.loginCallback({}, samlResponse);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).not.toBeCalled();
			expect(mockUsersService.updateUser).toBeCalled();
			mockUsersService.updateUser.mockClear();
		});

		it('should catch an exception when handling the saml response', async () => {
			mockArchiefService.assertSamlResponse.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await hetArchiefController.loginCallback({}, samlResponse);
			expect(result).toBeUndefined();
		});
	});
});
