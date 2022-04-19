import { Injectable, Logger } from '@nestjs/common';

import { CreateUserDto, UpdateAcceptedTosDto, UpdateUserDto } from '../dto/users.dto';
import { GqlPermissionData, GqlUser, GroupIdToName, Permission, User } from '../types';

import {
	GetUserByIdentityIdDocument,
	GetUserByIdentityIdQuery,
	InsertUserDocument,
	InsertUserIdentityDocument,
	InsertUserIdentityMutation,
	InsertUserMutation,
	UpdateUserProfileDocument,
	UpdateUserProfileMutation,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { Idp } from '~shared/auth/auth.types';

@Injectable()
export class UsersService {
	private logger: Logger = new Logger(UsersService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	public adapt(graphQlUser: GqlUser): User | null {
		if (!graphQlUser) {
			return null;
		}

		/* istanbul ignore next */
		return {
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
			maintainerId: graphQlUser?.maintainer_users_profiles[0]?.maintainer_identifier,
			visitorSpaceSlug:
				graphQlUser?.maintainer_users_profiles[0]?.maintainer?.visitor_space?.id,
		};
	}

	public groupIdToName(groupId: keyof typeof GroupIdToName): string {
		return GroupIdToName[groupId] || null;
	}

	public async getUserByIdentityId(identityId: string): Promise<User | null> {
		const userResponse = await this.dataService.execute<GetUserByIdentityIdQuery>(
			GetUserByIdentityIdDocument,
			{
				identityId,
			}
		);
		if (!userResponse.data.users_profile[0]) {
			return null;
		}
		return this.adapt(userResponse.data.users_profile[0]);
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
		};
		const {
			data: { insert_users_profile_one: createdUser },
		} = await this.dataService.execute<InsertUserMutation>(InsertUserDocument, { newUser });
		this.logger.debug(`user ${createdUser.id} created`);

		// Link the user with the identity
		const newUserIdentity = {
			id: idpId,
			identity_id: idp,
			identity_provider_name: idp,
			profile_id: createdUser.id,
		};
		await this.dataService.execute<InsertUserIdentityMutation>(InsertUserIdentityDocument, {
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
		};

		const {
			data: { update_users_profile_by_pk: updatedUser },
		} = await this.dataService.execute<UpdateUserProfileMutation>(UpdateUserProfileDocument, {
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

		const {
			data: { update_users_profile_by_pk: updatedUser },
		} = await this.dataService.execute<UpdateUserProfileMutation>(UpdateUserProfileDocument, {
			id,
			updateUser,
		});

		return this.adapt(updatedUser);
	}
}
