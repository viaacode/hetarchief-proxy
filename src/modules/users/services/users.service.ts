import { DataService } from '@meemoo/admin-core-api';
import { Injectable, Logger } from '@nestjs/common';

import { CreateUserDto, UpdateAcceptedTosDto, UpdateUserDto } from '../dto/users.dto';
import { GqlPermissionData, GqlUser, GroupIdToName, Permission, User } from '../types';

import {
	DeleteLinkUserToMaintainerDocument,
	DeleteLinkUserToMaintainerMutation,
	DeleteLinkUserToMaintainerMutationVariables,
	GetLinkUserToMaintainerDocument,
	GetLinkUserToMaintainerQuery,
	GetLinkUserToMaintainerQueryVariables,
	GetUserByIdentityIdDocument,
	GetUserByIdentityIdQuery,
	GetUserByIdentityIdQueryVariables,
	InsertLinkUserToMaintainerDocument,
	InsertLinkUserToMaintainerMutation,
	InsertLinkUserToMaintainerMutationVariables,
	InsertUserDocument,
	InsertUserIdentityDocument,
	InsertUserIdentityMutation,
	InsertUserIdentityMutationVariables,
	InsertUserMutation,
	InsertUserMutationVariables,
	UpdateUserLastAccessDateDocument,
	UpdateUserLastAccessDateMutation,
	UpdateUserLastAccessDateMutationVariables,
	UpdateUserProfileDocument,
	UpdateUserProfileMutation,
	UpdateUserProfileMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import { Organisation } from '~modules/organisations/organisations.types';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { Idp } from '~shared/auth/auth.types';
import { UpdateResponse } from '~shared/types/types';

@Injectable()
export class UsersService {
	private logger: Logger = new Logger(UsersService.name, { timestamp: true });

	constructor(
		protected dataService: DataService,
		protected organisationService: OrganisationsService
	) {}

	public adapt(graphQlUser: GqlUser): User | null {
		if (!graphQlUser) {
			return null;
		}

		let adpatedUser: User = {
			id: graphQlUser?.id,
			fullName: graphQlUser?.full_name,
			firstName: graphQlUser?.first_name,
			lastName: graphQlUser?.last_name,
			email: graphQlUser?.mail,
			acceptedTosAt: graphQlUser?.accepted_tos_at,
			groupId: graphQlUser?.group_id,
			groupName: this.groupIdToName(graphQlUser?.group_id),
			permissions: (graphQlUser?.group?.permissions || []).map(
				(permData: GqlPermissionData) => permData.permission.name as Permission
			),
			idp: graphQlUser?.identities?.[0]?.identity_provider_name as Idp,
			isKeyUser: graphQlUser?.is_key_user,
		};

		if (graphQlUser?.maintainer_users_profiles[0]?.maintainer_identifier) {
			adpatedUser = {
				...adpatedUser,
				maintainerId: graphQlUser?.maintainer_users_profiles[0]?.maintainer_identifier,
			};
		}

		if (graphQlUser?.maintainer_users_profiles[0]?.maintainer?.visitor_space?.slug) {
			adpatedUser = {
				...adpatedUser,
				visitorSpaceSlug:
					graphQlUser?.maintainer_users_profiles[0]?.maintainer?.visitor_space?.slug,
			};
		}

		/* istanbul ignore next */
		return adpatedUser;
	}

	public groupIdToName(groupId: keyof typeof GroupIdToName): string {
		return GroupIdToName[groupId] || null;
	}

	public async getUserByIdentityId(identityId: string): Promise<User | null> {
		const userResponse = await this.dataService.execute<
			GetUserByIdentityIdQuery,
			GetUserByIdentityIdQueryVariables
		>(GetUserByIdentityIdDocument, {
			identityId,
		});
		if (!userResponse.users_profile[0]) {
			return null;
		}

		return this.adapt(userResponse.users_profile[0]);
	}

	public async createUserWithIdp(
		createUserDto: CreateUserDto,
		idp: Idp,
		idpId: string
	): Promise<User> {
		// TODO duplicate user handling
		const newUser = {
			first_name: createUserDto.firstName,
			last_name: createUserDto.lastName,
			mail: createUserDto.email,
			group_id: createUserDto.groupId,
			is_key_user: createUserDto.isKeyUser,
		};
		const { insert_users_profile_one: createdUser } = await this.dataService.execute<
			InsertUserMutation,
			InsertUserMutationVariables
		>(InsertUserDocument, { newUser });
		this.logger.debug(`user ${createdUser.id} created`);

		// Link the user with the identity
		const newUserIdentity = {
			id: idpId,
			identity_id: idp,
			identity_provider_name: idp,
			profile_id: createdUser.id,
		};
		await this.dataService.execute<
			InsertUserIdentityMutation,
			InsertUserIdentityMutationVariables
		>(InsertUserIdentityDocument, {
			newUserIdentity,
		});
		this.logger.debug(`user ${createdUser.id} linked with idp '${idp}'`);

		return this.adapt({
			...createdUser,
			identities: [
				{
					identity_provider_name: idp,
				},
			],
		});
	}

	public async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const updateUser = {
			first_name: updateUserDto.firstName,
			last_name: updateUserDto.lastName,
			mail: updateUserDto.email,
			group_id: updateUserDto.groupId,
			is_key_user: updateUserDto.isKeyUser,
			organisation_schema_identifier: updateUserDto.organisationId,
		};

		const { update_users_profile_by_pk: updatedUser } = await this.dataService.execute<
			UpdateUserProfileMutation,
			UpdateUserProfileMutationVariables
		>(UpdateUserProfileDocument, {
			id,
			updateUser,
		});

		return this.adapt(updatedUser);
	}

	public async updateAcceptedTos(
		id: string,
		updateAcceptedTos: UpdateAcceptedTosDto
	): Promise<User> {
		const updateUser = {
			accepted_tos_at: updateAcceptedTos.acceptedTosAt,
		};

		const { update_users_profile_by_pk: updatedUser } = await this.dataService.execute<
			UpdateUserProfileMutation,
			UpdateUserProfileMutationVariables
		>(UpdateUserProfileDocument, {
			id,
			updateUser,
		});

		return this.adapt(updatedUser);
	}

	/**
	 * Link a user profile to a visitor space. This can be for a CP Admin or a Kiosk user
	 * @param userProfileId
	 * @param maintainerId
	 */
	public async linkUserToMaintainer(
		userProfileId: string,
		maintainerId: string
	): Promise<boolean> {
		// Get current link
		const response = await this.dataService.execute<
			GetLinkUserToMaintainerQuery,
			GetLinkUserToMaintainerQueryVariables
		>(GetLinkUserToMaintainerDocument, {
			userProfileId,
		});
		const maintainerUserProfiles = response?.maintainer_users_profile || [];

		// Delete existing links if
		// - More than one link exists
		// - The existing link doesn't match the current maintainer id
		if (
			maintainerUserProfiles.length > 1 ||
			(maintainerUserProfiles.length === 1 &&
				maintainerUserProfiles[0]?.maintainer_identifier !== maintainerId)
		) {
			// We need to delete the existing link(s)
			await this.dataService.execute<
				DeleteLinkUserToMaintainerMutation,
				DeleteLinkUserToMaintainerMutationVariables
			>(DeleteLinkUserToMaintainerDocument, {
				userProfileId,
			});
		}

		// Insert a new link if
		// - No link exists
		// - The existing link is not for the current maintainerId
		// - There is more than one link
		if (
			maintainerUserProfiles.length === 0 ||
			(maintainerUserProfiles.length === 1 &&
				maintainerUserProfiles[0]?.maintainer_identifier !== maintainerId) ||
			maintainerUserProfiles.length > 1
		) {
			// We need to insert a new link
			const response = await this.dataService.execute<
				InsertLinkUserToMaintainerMutation,
				InsertLinkUserToMaintainerMutationVariables
			>(InsertLinkUserToMaintainerDocument, {
				userProfileId,
				maintainerId,
			});

			// Insert succeeded if we get a link id back
			return !!response?.insert_maintainer_users_profile_one?.id;
		}

		// Return false if the user was already linked to the visitor space
		return false;
	}

	public async updateLastAccessDate(id: string): Promise<UpdateResponse> {
		try {
			const response = await this.dataService.execute<
				UpdateUserLastAccessDateMutation,
				UpdateUserLastAccessDateMutationVariables
			>(UpdateUserLastAccessDateDocument, {
				userProfileId: id,
				date: new Date().toISOString(),
			});

			return {
				affectedRows: response.update_users_profile.affected_rows,
			};
		} catch (err) {
			this.logger.error('Failed to update user last access date', { id });
		}
	}
}
