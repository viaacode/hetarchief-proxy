import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { Configuration } from '~config';

import { IdpService } from '../services/idp.service';
import { MeemooService } from '../services/meemoo.service';

import { MeemooController } from './meemoo.controller';

import { CollectionsService } from '~modules/collections/services/collections.service';
import { EventsService } from '~modules/events/services/events.service';
import { UsersService } from '~modules/users/services/users.service';
import { Group } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { TestingLogger } from '~shared/logging/test-logger';

const meemooLoginUrl = 'http://localhost:3200';
const meemooLogoutUrl = 'http://localhost:3200';

const ldapUser = {
	attributes: {
		givenName: ['Tom'],
		sn: ['Testerom'],
		mail: ['test@studiohyperdrive.be'],
		name_id: 'test@studiohyperdrive.be',
		entryUUID: ['6033dcab-bcc9-4fb5-aa59-d21dcd893150'],
		apps: ['hetarchief'],
	},
};

const archiefUser = {
	id: '2',
	firstName: 'Tom',
	lastName: 'Testerom',
	email: 'test@studiohyperdrive.be',
	groupId: Group.CP_ADMIN,
};

const samlResponse = {
	RelayState: `{ "returnToUrl": "${meemooLoginUrl}" }`,
	SAMLResponse: 'dummy',
};

const samlLogoutResponse = {
	RelayState: `{ "returnToUrl": "${meemooLogoutUrl}" }`,
	SAMLResponse: 'dummy',
};

const mockMeemooService: Partial<Record<keyof MeemooService, jest.SpyInstance>> = {
	createLoginRequestUrl: jest.fn(),
	assertSamlResponse: jest.fn(),
	createLogoutRequestUrl: jest.fn(),
	createLogoutResponseUrl: jest.fn(),
};

const mockUsersService: Partial<Record<keyof UsersService, jest.SpyInstance>> = {
	getUserByIdentityId: jest.fn(),
	createUserWithIdp: jest.fn(),
	updateUser: jest.fn(),
	linkCpAdminToMaintainer: jest.fn(),
};

const mockCollectionsService: Partial<Record<keyof CollectionsService, jest.SpyInstance>> = {
	create: jest.fn(),
};

const mockIdpService: Partial<Record<keyof IdpService, jest.SpyInstance>> = {
	determineUserGroup: jest.fn(),
};

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'clientHost') {
			return meemooLoginUrl;
		}
		if (key === 'host') {
			return 'http://localhost:3100';
		}
		return key;
	}),
};

const mockEventsService: Partial<Record<keyof EventsService, jest.SpyInstance>> = {
	insertEvents: jest.fn(),
};

const mockRequest = { path: '/auth/meemoo', headers: {} } as unknown as Request;

const getNewMockSession = () => ({
	idp: Idp.MEEMOO,
	idpUserInfo: {
		session_not_on_or_after: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // one hour from now
	},
	archiefUserInfo: {},
});

describe('MeemooController', () => {
	let meemooController: MeemooController;
	let configService: ConfigService;

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
				{
					provide: CollectionsService,
					useValue: mockCollectionsService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: IdpService,
					useValue: mockIdpService,
				},
				{
					provide: EventsService,
					useValue: mockEventsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		meemooController = module.get<MeemooController>(MeemooController);
		configService = module.get<ConfigService>(ConfigService);
	});

	it('should be defined', () => {
		expect(meemooController).toBeDefined();
	});

	describe('login', () => {
		it('should redirect to the login url', async () => {
			mockMeemooService.createLoginRequestUrl.mockReturnValueOnce(meemooLoginUrl);
			const result = await meemooController.loginRoute({}, configService.get('clientHost'));
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: meemooLoginUrl,
			});
		});

		it('should immediately redirect to the returnUrl if there is a valid session', async () => {
			const result = await meemooController.loginRoute(
				getNewMockSession(),
				configService.get('clientHost')
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: configService.get('clientHost'),
			});
		});

		it('should catch an exception when generating the login url', async () => {
			mockMeemooService.createLoginRequestUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await meemooController.loginRoute({}, configService.get('clientHost'));
			expect(result).toBeUndefined();
		});
	});

	describe('login-callback', () => {
		it('should redirect after successful login with a known user', async () => {
			mockMeemooService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce(archiefUser);
			mockIdpService.determineUserGroup.mockReturnValueOnce(Group.CP_ADMIN);

			const result = await meemooController.loginCallback(mockRequest, {}, samlResponse);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: meemooLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).not.toBeCalled();
			expect(mockUsersService.updateUser).not.toBeCalled();
		});

		it('should use fallback relaystate', async () => {
			const samlResponseWithNullRelayState = {
				...samlResponse,
				RelayState: null,
			};
			mockMeemooService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce(archiefUser);
			mockIdpService.determineUserGroup.mockReturnValueOnce(Group.CP_ADMIN);

			const result = await meemooController.loginCallback(
				mockRequest,
				{},
				samlResponseWithNullRelayState
			);
			expect(result.url).toBeUndefined();
		});

		it('should create an authorized user that is not yet in the database', async () => {
			mockMeemooService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce(null);
			mockIdpService.determineUserGroup.mockReturnValueOnce(Group.CP_ADMIN);
			mockUsersService.createUserWithIdp.mockReturnValueOnce(archiefUser);

			const result = await meemooController.loginCallback(mockRequest, {}, samlResponse);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: meemooLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).toBeCalled();
			expect(mockUsersService.updateUser).not.toBeCalled();
			mockUsersService.createUserWithIdp.mockClear();
		});

		it('should update an authorized user that was changed in ldap', async () => {
			mockMeemooService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce({
				...archiefUser,
				firstName: 'Tom2',
			});
			mockIdpService.determineUserGroup.mockReturnValueOnce(Group.CP_ADMIN);
			mockUsersService.updateUser.mockReturnValueOnce(archiefUser);

			const result = await meemooController.loginCallback(mockRequest, {}, samlResponse);

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
				await meemooController.loginCallback(mockRequest, {}, samlResponse);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Test error handling');
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
			const response = await meemooController.loginCallback(mockRequest, {}, samlResponse);
			expect(response).toEqual({
				url: `${configService.get('host')}/auth/meemoo/login&returnToUrl=${meemooLoginUrl}`,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			});
		});
	});

	describe('logout', () => {
		it('should logout and redirect to the IDP logout url', async () => {
			mockMeemooService.createLogoutRequestUrl.mockReturnValueOnce(meemooLogoutUrl);
			const mockSession = getNewMockSession();
			const result = await meemooController.logout(
				mockSession,
				configService.get('clientHost')
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: meemooLogoutUrl,
			});
			expect(mockSession.idp).toBeNull();
		});

		it('should immediately redirect to the returnUrl if the IDP is invalid', async () => {
			const mockSession = getNewMockSession();
			mockSession.idp = null;
			const result = await meemooController.logout(
				mockSession,
				configService.get('clientHost')
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: configService.get('clientHost'),
			});
		});

		it('should catch an exception when generating the logout url', async () => {
			mockMeemooService.createLogoutRequestUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await meemooController.logout(
				getNewMockSession(),
				configService.get('clientHost')
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

		it('should catch an exception when generating the logout response url', async () => {
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
