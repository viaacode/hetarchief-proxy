import { TranslationsService } from '@meemoo/admin-core-api';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { type Request, type Response } from 'express';
import { noop } from 'lodash';

import { type Configuration } from '~config';

import { HetArchiefService } from '../services/het-archief.service';
import { IdpService } from '../services/idp.service';

import { HetArchiefController } from './het-archief.controller';

import { type CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { EventsService } from '~modules/events/services/events.service';
import { FoldersService } from '~modules/folders/services/folders.service';
import { mockOrganisations } from '~modules/organisations/mocks/organisations.mocks';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { UsersService } from '~modules/users/services/users.service';
import { GroupId } from '~modules/users/types';
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
		o: ['OR-1v5bc86'],
		sector: ['Overheid'],
	},
};

const archiefUser = {
	id: '1',
	firstName: 'Tom',
	lastName: 'Testerom',
	email: 'test@studiohyperdrive.be',
	groupId: GroupId.CP_ADMIN,
	permissions: [],
	isKeyUser: false,
	organisationId: 'OR-1v5bc86',
	organisationName: 'VRT',
	sector: 'Overheid',
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
};

const mockFoldersService: Partial<Record<keyof FoldersService, jest.SpyInstance>> = {
	create: jest.fn(),
};

const mockIdpService: Partial<Record<keyof IdpService, jest.SpyInstance>> = {
	determineUserGroup: jest.fn(),
	userGroupRequiresMaintainerLink: jest.fn(),
};

const mockConfigGetFunction = jest.fn((key: keyof Configuration): string | boolean => {
	if (key === 'CLIENT_HOST') {
		return hetArchiefLoginUrl;
	}
	if (key === 'HOST') {
		return 'http://localhost:3100';
	}
	if (key === 'SSUM_REGISTRATION_PAGE') {
		return hetArchiefRegisterUrl;
	}
	return key;
});

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: mockConfigGetFunction,
};

const mockEventsService: Partial<Record<keyof EventsService, jest.SpyInstance>> = {
	insertEvents: jest.fn(),
};

const mockOrganisationsService: Partial<Record<keyof OrganisationsService, jest.SpyInstance>> = {
	findOrganisationsBySchemaIdentifiers: jest.fn(),
};

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, jest.SpyInstance>> =
	{
		updateNewsletterPreferences: jest.fn(),
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
					provide: FoldersService,
					useValue: mockFoldersService,
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
				{
					provide: OrganisationsService,
					useValue: mockOrganisationsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		hetArchiefController = module.get<HetArchiefController>(HetArchiefController);
	});

	afterEach(() => {
		(mockResponseObject.redirect as jest.Mock).mockRestore();
		mockArchiefService.createLogoutResponseUrl.mockRestore();
		mockUsersService.getUserByIdentityId.mockRestore();
		mockUsersService.createUserWithIdp.mockRestore();
		mockUsersService.updateUser.mockRestore();
		mockIdpService.determineUserGroup.mockRestore();
		mockCampaignMonitorService.updateNewsletterPreferences.mockRestore();
		mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockRestore();
		mockArchiefService.assertSamlResponse.mockRestore();
		mockIdpService.userGroupRequiresMaintainerLink.mockRestore();
		mockArchiefService.createLoginRequestUrl.mockRestore();
		mockConfigService.get = mockConfigGetFunction;
	});

	it('should be defined', () => {
		expect(hetArchiefController).toBeDefined();
	});

	describe('register', () => {
		it('should redirect to the register url', async () => {
			const result = await hetArchiefController.registerRoute({}, hetArchiefLoginUrl);
			expect(result.statusCode).toEqual(HttpStatus.TEMPORARY_REDIRECT);
			expect(result.url.split('?')[0]).toEqual(hetArchiefRegisterUrl);
		});

		// This test somehow causes a maximum callstack exceeded error down the line
		// it('should catch an exception when generating the register url', async () => {
		// 	const clientHost = hetArchiefLoginUrl;
		// 	mockConfigService.get.mockImplementation(() => {
		// 		throw new Error('Test error handling');
		// 	});
		// 	const result = await hetArchiefController.registerRoute({}, clientHost);
		// 	expect(result).toBeUndefined();
		//
		// 	mockConfigService.get.mockRestore();
		// 	mockConfigService.get.mockImplementation(mockConfigGetFunction);
		// });
	});

	describe('login', () => {
		it('should redirect to the login url', async () => {
			mockArchiefService.createLoginRequestUrl.mockResolvedValue(hetArchiefLoginUrl);
			const result = await hetArchiefController.loginRoute({}, hetArchiefLoginUrl);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
		});

		it('should immediately redirect to the returnUrl if there is a valid session', async () => {
			const result = await hetArchiefController.loginRoute(
				getNewMockSession(),
				hetArchiefLoginUrl
			);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
		});

		it('should catch an exception when generating the login url', async () => {
			mockArchiefService.createLoginRequestUrl.mockImplementation(() => {
				throw new Error('Test error handling');
			});
			const result = await hetArchiefController.loginRoute({}, hetArchiefLoginUrl);
			expect(result).toBeUndefined();
		});
	});

	describe('login-callback', () => {
		it('should redirect after successful login with a known user', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			mockArchiefService.assertSamlResponse.mockResolvedValue(ldapUser);
			mockUsersService.getUserByIdentityId.mockResolvedValue(archiefUser);
			mockIdpService.determineUserGroup.mockReturnValue(GroupId.CP_ADMIN);
			mockIdpService.userGroupRequiresMaintainerLink.mockReturnValue(true);
			mockUsersService.updateUser.mockResolvedValue(archiefUser);
			mockCampaignMonitorService.updateNewsletterPreferences.mockResolvedValue(
				Promise.resolve()
			);

			const result = await hetArchiefController.loginCallback(mockRequest, {}, samlResponse, {
				redirect: noop,
			} as Response);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).not.toBeCalled();
			expect(mockUsersService.updateUser).not.toBeCalled();
		});

		it('should use fallback relaystate', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			const samlResponseWithNullRelayState = {
				...samlResponse,
				RelayState: null,
			};
			mockArchiefService.assertSamlResponse.mockResolvedValue(ldapUser);
			mockUsersService.getUserByIdentityId.mockResolvedValue(archiefUser);
			mockUsersService.createUserWithIdp.mockResolvedValue(archiefUser);
			mockUsersService.updateUser.mockResolvedValue(archiefUser);
			mockIdpService.determineUserGroup.mockReturnValue(GroupId.CP_ADMIN);
			mockConfigService.get = mockConfigGetFunction;
			mockCampaignMonitorService.updateNewsletterPreferences.mockResolvedValue(undefined);

			const result = await hetArchiefController.loginCallback(
				mockRequest,
				{},
				samlResponseWithNullRelayState,
				{ redirect: noop } as Response
			);
			expect(result.url).toBeUndefined();
		});

		it('should create an authorized user that is not yet in the database', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			mockArchiefService.assertSamlResponse.mockResolvedValue(ldapUser);
			mockUsersService.getUserByIdentityId.mockResolvedValue(null);
			mockIdpService.determineUserGroup.mockReturnValue(GroupId.CP_ADMIN);
			mockUsersService.createUserWithIdp.mockResolvedValue(archiefUser);

			const result = await hetArchiefController.loginCallback(mockRequest, {}, samlResponse, {
				redirect: noop,
			} as Response);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).toBeCalled();
			expect(mockUsersService.updateUser).not.toBeCalled();
		});

		it('should update an authorized user that was changed in ldap', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			mockArchiefService.assertSamlResponse.mockResolvedValue(ldapUser);
			mockUsersService.getUserByIdentityId.mockResolvedValue({
				...archiefUser,
				firstName: 'Tom2',
				isKeyUser: false,
				organisationId: null,
			});
			mockUsersService.updateUser.mockResolvedValue(archiefUser);

			const result = await hetArchiefController.loginCallback(mockRequest, {}, samlResponse, {
				redirect: noop,
			} as Response);

			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
			expect(mockUsersService.createUserWithIdp).not.toBeCalled();
			expect(mockUsersService.updateUser).toBeCalled();
		});

		it('should throw an exception on invalid saml response', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			mockArchiefService.assertSamlResponse.mockImplementation(() => {
				throw new Error('Test error handling');
			});
			let error;
			try {
				await hetArchiefController.loginCallback(mockRequest, {}, samlResponse, {
					redirect: noop,
				} as Response);
			} catch (e) {
				error = e;
			}
			expect(error.response.error).toEqual('Test error handling');
		});

		it('should redirect to the login route if the idp response is no longer valid', async () => {
			mockOrganisationsService.findOrganisationsBySchemaIdentifiers.mockResolvedValue(
				mockOrganisations
			);
			const ldapNoAccess = {
				attributes: {
					...ldapUser.attributes,
				},
			};
			ldapNoAccess.attributes.apps = [];
			mockArchiefService.assertSamlResponse.mockRejectedValue({
				message: 'SAML Response is no longer valid',
			});
			const response = await hetArchiefController.loginCallback(
				mockRequest,
				{},
				samlResponse,
				{ redirect: noop } as Response
			);
			expect(response).toEqual({
				url: `http://localhost:3100/auth/hetarchief/login&returnToUrl=${hetArchiefLoginUrl}`,
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
			});
		});
	});

	describe('logout', () => {
		it('should logout and redirect to the IDP logout url', async () => {
			mockArchiefService.createLogoutRequestUrl.mockResolvedValue(hetArchiefLogoutUrl);
			const mockSession = getNewMockSession();
			const result = await hetArchiefController.logout(mockSession, hetArchiefLoginUrl);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLogoutUrl,
			});
			expect(mockSession.idp).toBeNull();
		});

		it('should immediately redirect to the returnUrl if the IDP is invalid', async () => {
			const mockSession = getNewMockSession();
			mockSession.idp = null;
			const result = await hetArchiefController.logout(mockSession, hetArchiefLoginUrl);
			expect(result).toEqual({
				statusCode: HttpStatus.TEMPORARY_REDIRECT,
				url: hetArchiefLoginUrl,
			});
		});

		it('should catch an exception when generating the logout url', async () => {
			mockArchiefService.createLogoutRequestUrl.mockImplementation(() => {
				throw new Error('Test error handling');
			});
			const result = await hetArchiefController.logout(
				getNewMockSession(),
				hetArchiefLoginUrl
			);
			expect(result).toBeUndefined();
		});
	});

	describe('logout-callback', () => {
		it('should redirect after successful logout callback', async () => {
			mockArchiefService.assertSamlResponse.mockResolvedValue(ldapUser);
			mockUsersService.getUserByIdentityId.mockResolvedValue(archiefUser);

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
			mockArchiefService.createLogoutResponseUrl.mockResolvedValue('logout-response-url');
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
			mockArchiefService.createLogoutResponseUrl.mockImplementation(() => {
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
