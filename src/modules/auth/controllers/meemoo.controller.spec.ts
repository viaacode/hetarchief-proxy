import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MeemooService } from '../services/meemoo.service';
import { Idp } from '../types';

import { MeemooController } from './meemoo.controller';

import { UsersService } from '~modules/users/services/users.service';

const meemooLoginUrl = 'http://meemoo.be/login';
const meemooLogoutUrl = 'http://meemoo.be/logout';

const ldapUser = {
	attributes: {
		givenName: ['Tom'],
		sn: ['Testerom'],
		mail: ['test@studiohyperdrive.be'],
		name_id: 'test@studiohyperdrive.be',
		entryUUID: ['6033dcab-bcc9-4fb5-aa59-d21dcd893150'],
		apps: ['bezoekertool'],
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

const samlLogoutResponse = {
	RelayState: `{ "returnToUrl": "${meemooLogoutUrl}" }`,
	SAMLResponse: 'dummy',
};

const mockMeemooService = {
	createLoginRequestUrl: jest.fn(),
	assertSamlResponse: jest.fn(),
	createLogoutRequestUrl: jest.fn(),
	createLogoutResponseUrl: jest.fn(),
};

const mockUsersService = {
	getUserByIdentityId: jest.fn(),
	createUserWithIdp: jest.fn(),
	updateUser: jest.fn(),
};

const getNewMockSession = () => ({
	idp: Idp.MEEMOO,
	idpUserInfo: {
		session_not_on_or_after: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // one hour from now
	},
	archiefUserInfo: {},
});

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
			const result = await meemooController.getAuth({}, 'http://hetarchief.be/start');
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: meemooLoginUrl,
			});
		});

		it('should immediatly redirect to the returnUrl if there is a valid session', async () => {
			const result = await meemooController.getAuth(
				getNewMockSession(),
				'http://hetarchief.be/start'
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: 'http://hetarchief.be/start',
			});
		});

		it('should catch an exception when generating the login url', async () => {
			mockMeemooService.createLoginRequestUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await meemooController.getAuth({}, 'http://hetarchief.be/start');
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

		it('should throw an exception on invalid saml response', async () => {
			mockMeemooService.assertSamlResponse.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			let error;
			try {
				await meemooController.loginCallback({}, samlResponse);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Test error handling');
		});

		it('should throw an unauthorized exception if the user has no access to the archief app', async () => {
			const ldapNoAccess = {
				attributes: {
					...ldapUser.attributes,
				},
			};
			ldapNoAccess.attributes.apps = [];
			mockMeemooService.assertSamlResponse.mockResolvedValueOnce(ldapNoAccess);
			let error;
			try {
				await meemooController.loginCallback({}, samlResponse);
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				statusCode: HttpStatus.UNAUTHORIZED,
				error: 'Unauthorized',
				message: 'User has no access to hetarchief/bezoekertool',
			});
		});

		it('should redirect to the login route if the idp response is no longer valid', async () => {
			const ldapNoAccess = {
				attributes: {
					...ldapUser.attributes,
				},
			};
			ldapNoAccess.attributes.apps = [];
			mockMeemooService.assertSamlResponse.mockRejectedValueOnce({
				message: 'SAML Response is no longer valid',
			});
			const response = await meemooController.loginCallback({}, samlResponse);
			expect(response).toEqual({
				url: `${process.env.HOST}/auth/meemoo/login&returnToUrl=${meemooLoginUrl}`,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			});
		});
	});

	describe('logout', () => {
		it('should logout and redirect to the IDP logout url', async () => {
			mockMeemooService.createLogoutRequestUrl.mockReturnValueOnce(meemooLogoutUrl);
			const mockSession = getNewMockSession();
			const result = await meemooController.logout(mockSession, 'http://hetarchief.be/start');
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: meemooLogoutUrl,
			});
			expect(mockSession.idp).toBeNull();
		});

		it('should immediatly redirect to the returnUrl if the IDP is invalid', async () => {
			const mockSession = getNewMockSession();
			mockSession.idp = null;
			const result = await meemooController.logout(mockSession, 'http://hetarchief.be/start');
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: 'http://hetarchief.be/start',
			});
		});

		it('should catch an exception when generating the logout url', async () => {
			mockMeemooService.createLogoutRequestUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await meemooController.logout(
				getNewMockSession(),
				'http://hetarchief.be/start'
			);
			expect(result).toBeUndefined();
		});
	});

	describe('logout-callback', () => {
		it('should redirect after succesful logout callback', async () => {
			mockMeemooService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce(archiefUser);

			const result = await meemooController.logoutCallbackPost(
				getNewMockSession(),
				samlLogoutResponse
			);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: meemooLogoutUrl,
			});
			expect(mockMeemooService.createLogoutResponseUrl).not.toBeCalled();
		});

		it('should catch an exception when handling the saml response', async () => {
			const result = await meemooController.logoutCallbackPost(
				{},
				{
					RelayState: 'invalidjson',
					SAMLResponse: 'dummy',
				}
			);
			expect(result).toEqual({
				url: undefined,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			});
		});

		it('should redirect to the generated logout response url', async () => {
			mockMeemooService.createLogoutResponseUrl.mockResolvedValueOnce('logout-response-url');
			const result = await meemooController.logoutCallbackPost(
				{},
				{
					RelayState: `{ "returnToUrl": "${meemooLogoutUrl}" }`,
					SAMLResponse: null,
				}
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: 'logout-response-url',
			});
		});

		it('should catch an exception when generationg the logout response url', async () => {
			mockMeemooService.createLogoutResponseUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await meemooController.logoutCallbackPost(
				{},
				{
					RelayState: null,
					SAMLResponse: null,
				}
			);
			expect(result).toBeUndefined();
		});
	});
});
