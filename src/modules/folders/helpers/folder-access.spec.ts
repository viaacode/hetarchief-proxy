import { AvoAuthIdpType, PermissionName } from '@viaa/avo2-types';
import { describe, expect, it } from 'vitest';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName, type User } from '~modules/users/types';
import { Locale } from '~shared/types/types';
import { canWriteToFolder, getFolderOrganisationId, getFolderOwnerFilter } from './folder-access';

const organisationId = 'OR-rf5kf25';

const visitor: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	language: Locale.Nl,
	idp: AvoAuthIdpType.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: GroupId.VISITOR,
	groupName: GroupName.VISITOR,
	permissions: [PermissionName.MANAGE_FOLDERS],
	isKeyUser: true,
	isEvaluator: false,
	organisationId,
};

const cpAdmin: User = {
	...visitor,
	id: '7c4e1b4e-0a5c-4b6e-9a43-0d2a0e7f2b11',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [PermissionName.MANAGE_FOLDERS, PermissionName.MANAGE_ORGANISATION_FOLDERS],
};

const personalFolder = { userProfileId: visitor.id, ownerOrganisationId: null };
const organisationFolder = { userProfileId: null, ownerOrganisationId: organisationId };

describe('folder-access', () => {
	describe('canWriteToFolder', () => {
		it('allows the owner of a personal folder', () => {
			expect(canWriteToFolder(personalFolder, new SessionUserEntity(visitor))).toBe(true);
		});

		it('refuses a personal folder of someone else', () => {
			expect(canWriteToFolder(personalFolder, new SessionUserEntity(cpAdmin))).toBe(false);
		});

		it('allows a cp admin on an organisation folder of their own organisation', () => {
			expect(canWriteToFolder(organisationFolder, new SessionUserEntity(cpAdmin))).toBe(true);
		});

		it('refuses a cp admin on an organisation folder of another organisation', () => {
			expect(
				canWriteToFolder(
					{ ...organisationFolder, ownerOrganisationId: 'OR-other' },
					new SessionUserEntity(cpAdmin)
				)
			).toBe(false);
		});

		it('refuses a user of the same organisation without the MANAGE_ORGANISATION_FOLDERS permission', () => {
			expect(canWriteToFolder(organisationFolder, new SessionUserEntity(visitor))).toBe(false);
		});

		it('refuses a cp admin without organisation', () => {
			expect(
				canWriteToFolder(
					organisationFolder,
					new SessionUserEntity({ ...cpAdmin, organisationId: null })
				)
			).toBe(false);
		});

		it('refuses missing folders and anonymous users', () => {
			expect(canWriteToFolder(undefined, new SessionUserEntity(visitor))).toBe(false);
			expect(canWriteToFolder(personalFolder, undefined)).toBe(false);
		});
	});

	describe('getFolderOrganisationId', () => {
		it('returns the organisation for users that can manage organisation folders', () => {
			expect(getFolderOrganisationId(new SessionUserEntity(cpAdmin))).toBe(organisationId);
		});

		it('returns null for other users', () => {
			expect(getFolderOrganisationId(new SessionUserEntity(visitor))).toBeNull();
			expect(getFolderOrganisationId(undefined)).toBeNull();
		});
	});

	describe('getFolderOwnerFilter', () => {
		it('only filters on the profile when no organisation is passed', () => {
			expect(getFolderOwnerFilter(visitor.id, null)).toEqual({
				_or: [{ user_profile_id: { _eq: visitor.id } }],
			});
		});

		it('also matches organisation folders when an organisation is passed', () => {
			expect(getFolderOwnerFilter(cpAdmin.id, organisationId)).toEqual({
				_or: [
					{ user_profile_id: { _eq: cpAdmin.id } },
					{ owner_organisation_id: { _eq: organisationId } },
				],
			});
		});

		it('throws without a profile id, so it can never match all folders', () => {
			expect(() => getFolderOwnerFilter('', organisationId)).toThrow();
		});
	});
});
