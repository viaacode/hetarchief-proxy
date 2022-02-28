import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HetArchiefService } from '../services/het-archief.service';
import { Idp } from '../types';

import { HetArchiefController } from './het-archief.controller';

import { UsersService } from '~modules/users/services/users.service';

const hetArchiefLoginUrl = 'http://hetarchief.be/login';
const hetArchiefLogoutUrl = 'http://hetarchief.be/logout';

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

const samlLogoutResponse = {
	RelayState: `{ "returnToUrl": "${hetArchiefLogoutUrl}" }`,
	SAMLResponse: 'dummy',
};

const mockArchiefService = {
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
	idp: Idp.HETARCHIEF,
	idpUserInfo: {
		session_not_on_or_after: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // one hour from now
	},
	archiefUserInfo: {},
});

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

		it('should immediately redirect to the returnUrl if there is a valid session', async () => {
			const result = await hetArchiefController.getAuth(
				getNewMockSession(),
				'http://hetarchief.be/start'
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: 'http://hetarchief.be/start',
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
		it('should redirect after successful login with a known user', async () => {
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

		it('should use fallback relaystate', async () => {
			const originalRelayState = samlResponse.RelayState;
			samlResponse.RelayState = null;
			mockArchiefService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			const result = await hetArchiefController.loginCallback({}, samlResponse);
			expect(result.url).toBeUndefined();
			// reset
			samlResponse.RelayState = originalRelayState;
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

		it('should throw an exception on invalid saml response', async () => {
			mockArchiefService.assertSamlResponse.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			let error;
			try {
				await hetArchiefController.loginCallback({}, samlResponse);
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
			mockArchiefService.assertSamlResponse.mockResolvedValueOnce(ldapNoAccess);
			let error;
			try {
				await hetArchiefController.loginCallback({}, samlResponse);
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
			mockArchiefService.assertSamlResponse.mockRejectedValueOnce({
				message: 'SAML Response is no longer valid',
			});
			const response = await hetArchiefController.loginCallback({}, samlResponse);
			expect(response).toEqual({
				url: `${process.env.HOST}/auth/hetarchief/login&returnToUrl=${hetArchiefLoginUrl}`,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			});
		});
	});

	describe('logout', () => {
		it('should logout and redirect to the IDP logout url', async () => {
			mockArchiefService.createLogoutRequestUrl.mockReturnValueOnce(hetArchiefLogoutUrl);
			const mockSession = getNewMockSession();
			const result = await hetArchiefController.logout(
				mockSession,
				'http://hetarchief.be/start'
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLogoutUrl,
			});
			expect(mockSession.idp).toBeNull();
		});

		it('should immediately redirect to the returnUrl if the IDP is invalid', async () => {
			const mockSession = getNewMockSession();
			mockSession.idp = null;
			const result = await hetArchiefController.logout(
				mockSession,
				'http://hetarchief.be/start'
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: 'http://hetarchief.be/start',
			});
		});

		it('should catch an exception when generating the logout url', async () => {
			mockArchiefService.createLogoutRequestUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await hetArchiefController.logout(
				getNewMockSession(),
				'http://hetarchief.be/start'
			);
			expect(result).toBeUndefined();
		});
	});

	describe('logout-callback', () => {
		it('should redirect after successful logout callback', async () => {
			mockArchiefService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce(archiefUser);

			const result = await hetArchiefController.logoutCallbackPost(
				getNewMockSession(),
				samlLogoutResponse
			);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLogoutUrl,
			});
			expect(mockArchiefService.createLogoutResponseUrl).not.toBeCalled();
		});

		it('should catch an exception when handling the saml response', async () => {
			const result = await hetArchiefController.logoutCallbackPost(
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
			mockArchiefService.createLogoutResponseUrl.mockResolvedValueOnce('logout-response-url');
			const result = await hetArchiefController.logoutCallbackPost(
				{},
				{
					RelayState: `{ "returnToUrl": "${hetArchiefLogoutUrl}" }`,
					SAMLResponse: null,
				}
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: 'logout-response-url',
			});
		});

		it('should catch an exception when generationg the logout response url', async () => {
			mockArchiefService.createLogoutResponseUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await hetArchiefController.logoutCallbackPost(
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
