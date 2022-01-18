import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MeemooService } from '../services/meemoo.service';

import { MeemooController } from './meemoo.controller';

import { UsersService } from '~modules/users/services/users.service';

const meemooLoginUrl = 'http://meemoo.be/login';

const ldapUser = {
	attributes: {
		givenName: ['Tom'],
		sn: ['Testerom'],
		mail: ['test@studiohyperdrive.be'],
		name_id: 'test@studiohyperdrive.be',
		entryUUID: ['6033dcab-bcc9-4fb5-aa59-d21dcd893150'],
		apps: ['meemoo'],
	},
};

const archiefUser = {
	id: '2',
	firstName: 'Tom',
	lastName: 'Testerom',
	email: 'test@studiohyperdrive.be',
};

const samlResponse = {
	RelayState: `{ "returnToUrl": "${meemooLoginUrl}" }`,
	SAMLResponse: 'dummy',
};

const mockMeemooService = {
	createLoginRequestUrl: jest.fn(),
	assertSamlResponse: jest.fn(),
};

const mockUsersService = {
	getUserByIdentityId: jest.fn(),
	createUserWithIdp: jest.fn(),
	updateUser: jest.fn(),
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
				{
					provide: UsersService,
					useValue: mockUsersService,
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
		it('should redirect after succesful login with a known user', async () => {
			mockMeemooService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce(archiefUser);

			const result = await meemooController.loginCallback({}, samlResponse);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: meemooLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).not.toBeCalled();
			expect(mockUsersService.updateUser).not.toBeCalled();
		});

		it('should create an authorized user that is not yet in the database', async () => {
			mockMeemooService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce(null);
			mockUsersService.createUserWithIdp.mockReturnValueOnce(archiefUser);

			const result = await meemooController.loginCallback({}, samlResponse);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: meemooLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).toBeCalled();
			expect(mockUsersService.updateUser).not.toBeCalled();
			mockUsersService.createUserWithIdp.mockClear();
		});

		it('should update an authorized user that is was changed in ldap', async () => {
			mockMeemooService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce({
				...archiefUser,
				firstName: 'Tom2',
			});
			mockUsersService.updateUser.mockReturnValueOnce(archiefUser);

			const result = await meemooController.loginCallback({}, samlResponse);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: meemooLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).not.toBeCalled();
			expect(mockUsersService.updateUser).toBeCalled();
			mockUsersService.updateUser.mockClear();
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
