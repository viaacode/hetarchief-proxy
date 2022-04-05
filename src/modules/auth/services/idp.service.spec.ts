import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { IdpService } from './idp.service';

import { SpacesService } from '~modules/spaces/services/spaces.service';
import { Group } from '~modules/users/types';

const mockSpacesService: Partial<Record<keyof SpacesService, jest.SpyInstance>> = {
	findBySlug: jest.fn(),
};

const getLdapUser = () => ({
	attributes: {
		entryUUID: ['ec9dab01-6b43-4657-95e5-9808061904fc'],
		mail: ['test@studiohyperdrive.be'],
		givenName: ['Test'],
		cn: ['Tom Testerom'],
		sn: ['Testerom'],
		oNickname: ['Testbeeld'],
		apps: ['hetarchief', 'admin'], // TODO replace by a single value 'hetarchief-beheer' once archief 2.0 is launched
		organizationalstatus: [''],
		o: [IdpService.MEEMOO_ORGANISATION_ID],
	},
	name_id: 'test@studiohyperdrive.be',
	session_index: 'session-index',
	session_not_on_or_after: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // one hour from now
});

describe('IdpService', () => {
	let idpService: IdpService;
	let configService: ConfigService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				IdpService,
				ConfigService,
				{
					provide: SpacesService,
					useValue: mockSpacesService,
				},
			],
		}).compile();

		idpService = module.get<IdpService>(IdpService);
		configService = module.get<ConfigService>(ConfigService);
	});

	it('services should be defined', () => {
		expect(idpService).toBeDefined();
		expect(configService).toBeDefined();
	});

	describe('determineUserGroup', () => {
		it('should assign the Visitor group if user has no archief-beheer and no kiosk', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.apps = [];

			const group = await idpService.determineUserGroup(ldapUser);
			expect(group).toEqual(Group.VISITOR);
		});

		it('should assign the Visitor group if user has no archief-beheer, but kiosk and an org id without space', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.apps = [];
			ldapUser.attributes.organizationalstatus = ['kiosk'];

			const group = await idpService.determineUserGroup(ldapUser);
			expect(group).toEqual(Group.VISITOR);
		});

		it('should assign the Kiosk group if user has no archief-beheer, but kiosk and an org id with a space', async () => {
			mockSpacesService.findBySlug.mockResolvedValueOnce({ id: 'space-1' });
			const ldapUser = getLdapUser();
			ldapUser.attributes.apps = [];
			ldapUser.attributes.organizationalstatus = ['kiosk'];

			const group = await idpService.determineUserGroup(ldapUser);
			expect(group).toEqual(Group.KIOSK_VISITOR);
		});

		// Bottom section of the flowchart
		it('should assign the Visitor group if user has archief-beheer but no organization', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.o = [];

			const group = await idpService.determineUserGroup(ldapUser);
			expect(group).toEqual(Group.VISITOR);
		});

		it('should assign the Visitor group if user has archief-beheer but no valid organization', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.o = ['unknown'];
			mockSpacesService.findBySlug.mockResolvedValueOnce(null);

			const group = await idpService.determineUserGroup(ldapUser);
			expect(group).toEqual(Group.VISITOR);
		});

		it('should assign the Meemoo Admin group if user has archief-beheer and the Meemoo Organization', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.o = [IdpService.MEEMOO_ORGANISATION_ID];
			mockSpacesService.findBySlug.mockResolvedValueOnce(null);

			const group = await idpService.determineUserGroup(ldapUser);
			expect(group).toEqual(Group.MEEMOO_ADMIN);
		});

		it('should assign the CP Admin group if user has archief-beheer and a valid organization with space', async () => {
			const ldapUser = getLdapUser();
			ldapUser.attributes.o = ['OR-rf5kf25'];
			mockSpacesService.findBySlug.mockResolvedValueOnce({ id: 'space-1' });

			const group = await idpService.determineUserGroup(ldapUser);
			expect(group).toEqual(Group.CP_ADMIN);
		});
	});
});
