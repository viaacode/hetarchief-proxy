import { TranslationsService } from '@meemoo/admin-core-api';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { IdpService } from './idp.service';

import { Organisation } from '~modules/organisations/organisations.types';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { GroupId } from '~modules/users/types';
import { LdapApp } from '~shared/auth/auth.types';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { Locale } from '~shared/types/types';

const mockSpacesService: Partial<Record<keyof SpacesService, jest.SpyInstance>> = {
	findByMaintainerId: jest.fn(),
};

const meemooAdminOrganizationIds = 'OR-w66976m';
const mockOrganisation: Organisation = {
	schemaIdentifier: 'OR-w66976m',
	contactPoint: null,
	primarySite: null,
	description: null,
	logo: null,
	sector: null,
	schemaName: 'VRT',
	slug: 'vrt',
	createdAt: null,
	updatedAt: null,
	formUrl: null,
};

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): any => {
		if (key === 'MEEMOO_ADMIN_ORGANIZATION_IDS') {
			return meemooAdminOrganizationIds;
		}
		return key;
	}),
};

const getLdapUser = () => ({
	attributes: {
		entryUUID: ['ec9dab01-6b43-4657-95e5-9808061904fc'],
		mail: ['test@studiohyperdrive.be'],
		givenName: ['Test'],
		cn: ['Tom Testerom'],
		sn: ['Testerom'],
		oNickname: ['Testbeeld'],
		apps: [LdapApp.HETARCHIEF_BEHEER],
		organizationalStatus: [''],
		o: meemooAdminOrganizationIds.split(','),
	},
	name_id: 'test@studiohyperdrive.be',
	session_index: 'session-index',
	session_not_on_or_after: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // one hour from now
});

describe('IdpService', () => {
	let idpService: IdpService;
	let configService: ConfigService<Configuration>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				IdpService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: SpacesService,
					useValue: mockSpacesService,
				},
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		}).compile();

		idpService = module.get<IdpService>(IdpService);
		configService = module.get<ConfigService<Configuration>>(ConfigService);
	});

	it('services should be defined', () => {
		expect(idpService).toBeDefined();
		expect(configService).toBeDefined();
	});

	describe('userGroupRequiresMaintainerLink', () => {
		it('can determine if a userGroup requires a link to a maintainer', () => {
			expect(idpService.userGroupRequiresMaintainerLink(GroupId.CP_ADMIN)).toBeTruthy();
			expect(idpService.userGroupRequiresMaintainerLink(GroupId.KIOSK_VISITOR)).toBeTruthy();
			expect(idpService.userGroupRequiresMaintainerLink(GroupId.VISITOR)).toBeFalsy();
			expect(idpService.userGroupRequiresMaintainerLink(GroupId.MEEMOO_ADMIN)).toBeFalsy();
		});
	});

	describe('determineUserGroup', () => {
		it('should assign the Visitor group if user has no archief-beheer and no kiosk', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.apps = [];

			const group = await idpService.determineUserGroup(ldapUser, null, Locale.Nl);
			expect(group).toEqual(GroupId.VISITOR);
		});

		it('should assign the Visitor group if user has no archief-beheer, but kiosk and an org id without space', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.apps = [];
			ldapUser.attributes.organizationalStatus = ['kiosk'];

			const group = await idpService.determineUserGroup(ldapUser, null, Locale.Nl);
			expect(group).toEqual(GroupId.VISITOR);
		});

		it('should assign the Kiosk group if user has no archief-beheer, but kiosk and an org id with a space', async () => {
			mockSpacesService.findByMaintainerId.mockResolvedValueOnce({ id: 'space-1' });
			const ldapUser = getLdapUser();
			ldapUser.attributes.apps = [];
			ldapUser.attributes.organizationalStatus = ['kiosk'];

			const group = await idpService.determineUserGroup(ldapUser, null, Locale.Nl);
			expect(group).toEqual(GroupId.KIOSK_VISITOR);
		});

		// Bottom section of the flowchart
		it('should throw an error if user has archief-beheer but no organization', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.o = [];

			let err;

			try {
				await idpService.determineUserGroup(ldapUser, null, Locale.Nl);
			} catch (error) {
				err = error;
			}

			expect(err).toBeDefined();
		});

		it('should assign the Visitor group if user has archief-beheer but no valid organization', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.o = ['unknown'];
			mockSpacesService.findByMaintainerId.mockResolvedValueOnce(null);

			const group = await idpService.determineUserGroup(ldapUser, null, Locale.Nl);
			expect(group).toEqual(GroupId.VISITOR);
		});

		it('should assign the Meemoo Admin group if user has archief-beheer and the Meemoo Organization', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.o = meemooAdminOrganizationIds.split(',');
			mockSpacesService.findByMaintainerId.mockResolvedValueOnce(null);

			const group = await idpService.determineUserGroup(ldapUser, null, Locale.Nl);
			expect(group).toEqual(GroupId.MEEMOO_ADMIN);
		});

		it('should assign the CP Admin group if user has archief-beheer and a valid organization with space', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.o = ['OR-rf5kf25'];
			mockSpacesService.findByMaintainerId.mockResolvedValueOnce({ id: 'space-1' });

			const group = await idpService.determineUserGroup(
				ldapUser,
				mockOrganisation,
				Locale.Nl
			);
			expect(group).toEqual(GroupId.CP_ADMIN);
		});
	});
});
