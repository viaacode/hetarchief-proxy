import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';

import { Configuration } from '~config';

import { HetArchiefService } from '../services/het-archief.service';
import { IdpService } from '../services/idp.service';

import { HetArchiefController } from './het-archief.controller';

import { CollectionsService } from '~modules/collections/services/collections.service';
import { EventsService } from '~modules/events/services/events.service';
import { TranslationsService } from '~modules/translations/services/translations.service';
import { UsersService } from '~modules/users/services/users.service';
import { Group } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { TestingLogger } from '~shared/logging/test-logger';

const hetArchiefLoginUrl = 'http://localhost:3200';
const hetArchiefLogoutUrl = 'http://localhost:3200';
const hetArchiefRegisterUrl = 'http://meemoo.be/dummy-ssum-registration-page';

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
	groupId: Group.CP_ADMIN,
	permissions: [],
};

const samlResponse = {
	RelayState: `{ "returnToUrl": "${hetArchiefLoginUrl}" }`,
	SAMLResponse: 'dummy',
};

const samlLogoutResponse = {
	RelayState: `{ "returnToUrl": "${hetArchiefLogoutUrl}" }`,
	SAMLResponse: 'dummy',
};

const mockResponseObject = {
	redirect: jest.fn(),
} as unknown as Response;

const mockArchiefService: Partial<Record<keyof HetArchiefService, jest.SpyInstance>> = {
	createLoginRequestUrl: jest.fn(),
	assertSamlResponse: jest.fn(),
	createLogoutRequestUrl: jest.fn(),
	createLogoutResponseUrl: jest.fn(),
};

const mockUsersService: Partial<Record<keyof UsersService, jest.SpyInstance>> = {
	getUserByIdentityId: jest.fn(),
	createUserWithIdp: jest.fn(),
	updateUser: jest.fn(),
	linkUserToMaintainer: jest.fn(),
};

const mockCollectionsService: Partial<Record<keyof CollectionsService, jest.SpyInstance>> = {
	create: jest.fn(),
};

const mockIdpService: Partial<Record<keyof IdpService, jest.SpyInstance>> = {
	determineUserGroup: jest.fn(),
	userGroupRequiresMaintainerLink: jest.fn(),
};

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'clientHost') {
			return hetArchiefLoginUrl;
		}
		if (key === 'host') {
			return 'http://localhost:3100';
		}
		if (key === 'ssumRegistrationPage') {
			return hetArchiefRegisterUrl;
		}
		return key;
	}),
};

const mockEventsService: Partial<Record<keyof EventsService, jest.SpyInstance>> = {
	insertEvents: jest.fn(),
};

const mockRequest = { path: '/auth/hetarchief', headers: {} } as unknown as Request;

const getNewMockSession = () => ({
	idp: Idp.HETARCHIEF,
	idpUserInfo: {
		session_not_on_or_after: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // one hour from now
	},
	archiefUserInfo: {},
});

describe('HetArchiefController', () => {
	let hetArchiefController: HetArchiefController;
	let configService: ConfigService;

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
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		hetArchiefController = module.get<HetArchiefController>(HetArchiefController);
		configService = module.get<ConfigService>(ConfigService);
	});

	afterEach(() => {
		(mockResponseObject.redirect as jest.Mock).mockRestore();
		mockArchiefService.createLogoutResponseUrl.mockRestore();
		mockUsersService.getUserByIdentityId.mockRestore();
	});

	it('should be defined', () => {
		expect(hetArchiefController).toBeDefined();
	});

	describe('register', () => {
		it('should redirect to the register url', async () => {
			const result = await hetArchiefController.registerRoute(
				{},
				configService.get('clientHost')
			);
			expect(result.statusCode).toEqual(HttpStatus.TEMPORARY_REDIRECT);
			expect(result.url.split('?')[0]).toEqual(hetArchiefRegisterUrl);
		});

		it('should catch an exception when generating the register url', async () => {
			const clientHost = configService.get('clientHost');
			mockConfigService.get.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await hetArchiefController.registerRoute({}, clientHost);
			expect(result).toBeUndefined();
		});
	});

	describe('login', () => {
		it('should redirect to the login url', async () => {
			mockArchiefService.createLoginRequestUrl.mockReturnValueOnce(hetArchiefLoginUrl);
			const result = await hetArchiefController.loginRoute(
				{},
				configService.get('clientHost')
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
		});

		it('should immediately redirect to the returnUrl if there is a valid session', async () => {
			const result = await hetArchiefController.loginRoute(
				getNewMockSession(),
				configService.get('clientHost')
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: configService.get('clientHost'),
			});
		});

		it('should catch an exception when generating the login url', async () => {
			mockArchiefService.createLoginRequestUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await hetArchiefController.loginRoute(
				{},
				configService.get('clientHost')
			);
			expect(result).toBeUndefined();
		});
	});

	describe('login-callback', () => {
		it('should redirect after successful login with a known user', async () => {
			mockArchiefService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValue(archiefUser);
			mockIdpService.determineUserGroup.mockReturnValueOnce(Group.CP_ADMIN);
			mockIdpService.userGroupRequiresMaintainerLink.mockReturnValueOnce(true);

			const result = await hetArchiefController.loginCallback(
				mockRequest,
				{},
				samlResponse,
				{}
			);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).not.toBeCalled();
			expect(mockUsersService.updateUser).not.toBeCalled();
		});

		it('should use fallback relaystate', async () => {
			const samlResponseWithNullRelayState = {
				...samlResponse,
				RelayState: null,
			};
			mockArchiefService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.createUserWithIdp.mockResolvedValueOnce(archiefUser);
			mockIdpService.determineUserGroup.mockReturnValueOnce(Group.CP_ADMIN);

			const result = await hetArchiefController.loginCallback(
				mockRequest,
				{},
				samlResponseWithNullRelayState,
				{}
			);
			expect(result.url).toBeUndefined();
		});

		it('should create an authorized user that is not yet in the database', async () => {
			mockArchiefService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce(null);
			mockIdpService.determineUserGroup.mockReturnValueOnce(Group.CP_ADMIN);
			mockUsersService.createUserWithIdp.mockReturnValueOnce(archiefUser);

			const result = await hetArchiefController.loginCallback(
				mockRequest,
				{},
				samlResponse,
				{}
			);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).toBeCalled();
			expect(mockUsersService.updateUser).not.toBeCalled();
			mockUsersService.createUserWithIdp.mockClear();
		});

		it('should update an authorized user that was changed in ldap', async () => {
			mockArchiefService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce({
				...archiefUser,
				firstName: 'Tom2',
			});
			mockUsersService.updateUser.mockReturnValueOnce(archiefUser);

			const result = await hetArchiefController.loginCallback(
				mockRequest,
				{},
				samlResponse,
				{}
			);

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
				await hetArchiefController.loginCallback(mockRequest, {}, samlResponse, {});
			} catch (e) {
				error = e;
			}
			expect(error.response.error).toEqual('Test error handling');
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
			const response = await hetArchiefController.loginCallback(
				mockRequest,
				{},
				samlResponse,
				{}
			);
			expect(response).toEqual({
				url: `${configService.get(
					'host'
				)}/auth/hetarchief/login&returnToUrl=${hetArchiefLoginUrl}`,
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
				configService.get('clientHost')
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
				configService.get('clientHost')
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: configService.get('clientHost'),
			});
		});

		it('should catch an exception when generating the logout url', async () => {
			mockArchiefService.createLogoutRequestUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			const result = await hetArchiefController.logout(
				getNewMockSession(),
				configService.get('clientHost')
			);
			expect(result).toBeUndefined();
		});
	});

	describe('logout-callback', () => {
		it('should redirect after successful logout callback', async () => {
			mockArchiefService.assertSamlResponse.mockResolvedValueOnce(ldapUser);
			mockUsersService.getUserByIdentityId.mockReturnValueOnce(archiefUser);

			await hetArchiefController.logoutCallbackPost(
				getNewMockSession(),
				samlLogoutResponse,
				mockResponseObject
			);

			expect(mockResponseObject.redirect).toBeCalledWith(hetArchiefLogoutUrl);
			expect(mockArchiefService.createLogoutResponseUrl).not.toBeCalled();
		});

		it('should catch an exception when handling the saml response', async () => {
			await hetArchiefController.logoutCallbackPost(
				{},
				{
					RelayState: 'invalidjson',
					SAMLResponse: 'dummy',
				},
				mockResponseObject
			);
			expect(mockResponseObject.redirect).toBeCalledWith(undefined);
		});

		it('should redirect to the generated logout response url', async () => {
			mockArchiefService.createLogoutResponseUrl.mockResolvedValueOnce('logout-response-url');
			await hetArchiefController.logoutCallbackPost(
				{},
				{
					RelayState: `{ "returnToUrl": "${hetArchiefLogoutUrl}" }`,
					SAMLResponse: null,
				},
				mockResponseObject
			);
			expect(mockResponseObject.redirect).toBeCalledWith('logout-response-url');
		});

		it('should catch an exception when generating the logout response url', async () => {
			mockArchiefService.createLogoutResponseUrl.mockImplementationOnce(() => {
				throw new Error('Test error handling');
			});
			await hetArchiefController.logoutCallbackPost(
				{},
				{
					RelayState: null,
					SAMLResponse: null,
				},
				mockResponseObject
			);
			expect(mockResponseObject.redirect).toBeCalledTimes(0);
		});
	});
});
