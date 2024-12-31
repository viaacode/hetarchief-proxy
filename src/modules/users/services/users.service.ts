import { convertUserInfoToCommonUser, DataService, UserInfoType } from '@meemoo/admin-core-api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { type Avo, type Idp } from '@viaa/avo2-types';

import {
	type CreateUserDto,
	type UpdateAcceptedTosDto,
	type UpdateUserDto,
	type UpdateUserLangDto,
} from '../dto/users.dto';
import {
	type GqlPermissionData,
	type GqlUser,
	GroupIdToName,
	type GroupName,
	type Permission,
	type User,
} from '../types';

import {
	GetUserByEmailDocument,
	type GetUserByEmailQuery,
	type GetUserByEmailQueryVariables,
	GetUserByIdDocument,
	GetUserByIdentityIdDocument,
	type GetUserByIdentityIdQuery,
	type GetUserByIdentityIdQueryVariables,
	type GetUserByIdQuery,
	type GetUserByIdQueryVariables,
	InsertUserDocument,
	InsertUserIdentityDocument,
	type InsertUserIdentityMutation,
	type InsertUserIdentityMutationVariables,
	type InsertUserMutation,
	type InsertUserMutationVariables,
	UpdateUserLanguageDocument,
	type UpdateUserLanguageMutation,
	type UpdateUserLanguageMutationVariables,
	UpdateUserLastAccessDateDocument,
	type UpdateUserLastAccessDateMutation,
	type UpdateUserLastAccessDateMutationVariables,
	UpdateUserProfileDocument,
	type UpdateUserProfileMutation,
	type UpdateUserProfileMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import { type IeObjectSector } from '~modules/ie-objects/ie-objects.types';
import { customError } from '~shared/helpers/custom-error';
import { type UpdateResponse } from '~shared/types/types';

@Injectable()
export class UsersService {
	private logger: Logger = new Logger(UsersService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	public adapt(graphQlUser: GqlUser): User | null {
		if (!graphQlUser) {
			return null;
		}

		let adaptedUser: User = {
			id: graphQlUser?.id,
			fullName: graphQlUser?.full_name,
			firstName: graphQlUser?.first_name,
			lastName: graphQlUser?.last_name,
			email: graphQlUser?.mail,
			language: graphQlUser?.language,
			acceptedTosAt: graphQlUser?.accepted_tos_at,
			groupId: graphQlUser?.group_id,
			groupName: this.groupIdToName(graphQlUser?.group_id) as GroupName,
			permissions: (graphQlUser?.group?.permissions || []).map(
				(permData: GqlPermissionData) => permData.permission.name as Permission
			),
			idp: graphQlUser?.identities?.[0]?.identity_provider_name as Idp,
			isKeyUser: graphQlUser?.is_key_user,
			lastAccessAt:
				(graphQlUser as GetUserByIdentityIdQuery['users_profile'][0])?.last_access_at ||
				null,
			createdAt:
				(graphQlUser as GetUserByIdentityIdQuery['users_profile'][0])?.created_at || null,
		};

		if (graphQlUser?.organisation) {
			adaptedUser = {
				...adaptedUser,
				organisationId: graphQlUser?.organisation?.org_identifier || null,
				organisationName: graphQlUser?.organisation?.skos_pref_label || null,
				sector: (graphQlUser?.organisation?.ha_org_sector || null) as IeObjectSector | null,
			};
		}

		if (graphQlUser?.visitor_space?.slug) {
			adaptedUser = {
				...adaptedUser,
				visitorSpaceSlug: graphQlUser?.visitor_space?.slug,
			};
		}

		/* istanbul ignore next */
		return adaptedUser;
	}

	public groupIdToName(groupId: keyof typeof GroupIdToName): GroupName | null {
		return (GroupIdToName[groupId] || null) as GroupName | null;
	}

	public async getUserByEmail(email: string): Promise<User | null> {
		const userResponse = await this.dataService.execute<
			GetUserByEmailQuery,
			GetUserByEmailQueryVariables
		>(GetUserByEmailDocument, {
			email,
		});
		if (!userResponse.users_profile[0]) {
			return null;
		}

		return this.adapt(userResponse.users_profile[0]);
	}

	public async getById(profileId: string): Promise<Avo.User.CommonUser> {
		try {
			const response = await this.dataService.execute<
				GetUserByIdQuery,
				GetUserByIdQueryVariables
			>(GetUserByIdDocument, { id: profileId });

			if (!response || !response.users_profile[0]) {
				throw customError('Could not fetch user', null, {
					response,
				});
			}

			return convertUserInfoToCommonUser(
				this.adapt(response.users_profile[0]) as Avo.User.HetArchiefUser,
				UserInfoType.HetArchiefUser
			);
		} catch (err: any) {
			throw customError('Failed to get profiles from the database', err, {
				variables: { id: profileId },
				query: 'GetUserById',
			});
		}
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
		const newUser: InsertUserMutationVariables['newUser'] = {
			first_name: createUserDto.firstName,
			last_name: createUserDto.lastName,
			mail: createUserDto.email,
			group_id: createUserDto.groupId,
			is_key_user: createUserDto.isKeyUser,
			organisation_schema_identifier: createUserDto.organisationId,
		};
		const { insert_users_profile_one: createdUser } = await this.dataService.execute<
			InsertUserMutation,
			InsertUserMutationVariables
		>(InsertUserDocument, { newUser });
		this.logger.debug(`user ${createdUser.id} created`);

		// Link the user with the identity
		const newUserIdentity: InsertUserIdentityMutationVariables['newUserIdentity'] = {
			identity_id: idpId,
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

		const { update_users_profile: updatedUser } = await this.dataService.execute<
			UpdateUserProfileMutation,
			UpdateUserProfileMutationVariables
		>(UpdateUserProfileDocument, {
			id,
			updateUser,
		});

		if (updatedUser?.returning.length === 0) {
			throw new NotFoundException(`User with id "${id}" was not found`);
		}

		return this.adapt(updatedUser?.returning[0]);
	}

	public async updateUserLanguage(id: string, updateLanguage: UpdateUserLangDto): Promise<any> {
		await this.dataService.execute<
			UpdateUserLanguageMutation,
			UpdateUserLanguageMutationVariables
		>(UpdateUserLanguageDocument, {
			lang: updateLanguage.language,
			id: id,
		});
	}

	public async updateAcceptedTos(
		id: string,
		updateAcceptedTos: UpdateAcceptedTosDto
	): Promise<User> {
		const updateUser = {
			accepted_tos_at: updateAcceptedTos.acceptedTosAt,
		};

		const { update_users_profile: updatedUser } = await this.dataService.execute<
			UpdateUserProfileMutation,
			UpdateUserProfileMutationVariables
		>(UpdateUserProfileDocument, {
			id,
			updateUser,
		});

		if (updatedUser?.returning.length === 0) {
			throw new NotFoundException(`User with id "${id}" was not found`);
		}

		return this.adapt(updatedUser?.returning[0]);
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
