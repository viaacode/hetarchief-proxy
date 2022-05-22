import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { QueryOrigin } from '../types';

import { DataPermissionsService } from './data-permissions.service';

import { ContentPagesService } from '~modules/admin/content-pages/services/content-pages.service';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

const mockQuery = { query: 'query testQuery { username }' };

const mockUser: User = {
	id: 'd285a546-b42b-4fb3-bfa7-ef8be9208bc0',
	firstName: 'Meemoo',
	lastName: 'Admin',
	fullName: 'Meemoo Admin',
	email: 'meemoo.admin@example.com',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: Group.MEEMOO_ADMIN,
	groupName: GroupIdToName[Group.MEEMOO_ADMIN],
	permissions: Object.values(Permission),
};

const mockContentPagesService = jest.fn();

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'graphQlUrl') {
			return 'http://localhost/v1/graphql/';
		}
		if (key === 'graphQlSecret') {
			return 'graphQl-$ecret';
		}
		if (key == 'graphQlEnableWhitelist') {
			return false; // For testing we disable the whitelist by default
		}
		return key;
	}),
};

describe('DataPermissionsService', () => {
	let dataPermissionsService: DataPermissionsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DataPermissionsService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: ContentPagesService,
					useValue: mockContentPagesService,
				},
			],
		}).compile();

		dataPermissionsService = module.get<DataPermissionsService>(DataPermissionsService);
	});

	it('services should be defined', () => {
		expect(dataPermissionsService).toBeDefined();
	});

	describe('isAllowedToExecuteQuery', () => {
		it('should allow a query when permissions are verified', async () => {
			const verifySpy = jest
				.spyOn(dataPermissionsService, 'verify')
				.mockResolvedValueOnce(true);

			const result = await dataPermissionsService.isAllowedToExecuteQuery(
				mockUser,
				mockQuery,
				QueryOrigin.ADMIN_CORE
			);

			expect(result).toEqual(true);
			expect(verifySpy).toHaveBeenCalled();
			verifySpy.mockRestore();
		});

		it('should NOT allow a query when permissions are not verified', async () => {
			const verifySpy = jest
				.spyOn(dataPermissionsService, 'verify')
				.mockResolvedValueOnce(false);

			const result = await dataPermissionsService.isAllowedToExecuteQuery(
				mockUser,
				mockQuery,
				QueryOrigin.ADMIN_CORE
			);

			expect(result).toEqual(false);
			expect(verifySpy).toHaveBeenCalled();
		});
	});

	describe('isWhitelist', () => {
		it('should return the setting variable from the ConfigService', () => {
			expect(dataPermissionsService.isWhitelistEnabled()).toEqual(false);
		});

		it('should be able to update the whitelist setting', () => {
			dataPermissionsService.setWhitelistEnabled(true);
			expect(dataPermissionsService.isWhitelistEnabled()).toEqual(true);
		});
	});

	// Test need to be updated as current permissions implementation is a dummy
	describe('isAllowedToExecuteQuery', () => {
		it('should verify a query', async () => {
			const verified = await dataPermissionsService.verify(
				mockUser,
				'TEST_QUERY',
				QueryOrigin.ADMIN_CORE,
				mockQuery
			);
			expect(verified).toEqual(true);
		});

		it('should allow a query without specific permissions configured', async () => {
			const verified = await dataPermissionsService.verify(
				mockUser,
				'UNKNOWN_QUERY',
				QueryOrigin.ADMIN_CORE,
				{
					query: 'mutation testUpdate',
				}
			);
			expect(verified).toEqual(true);
		});
	});
});
