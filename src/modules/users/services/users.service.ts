import { Injectable, Logger } from '@nestjs/common';
import { get } from 'lodash';

import { CreateUserDto, UpdateAcceptedTosDto, UpdateUserDto } from '../dto/users.dto';
import { User } from '../types';

import {
	GET_USER_BY_IDENTITY_ID,
	INSERT_USER,
	INSERT_USER_IDENTITY,
	UPDATE_USER,
} from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
import { Idp } from '~shared/auth/auth.types';

@Injectable()
export class UsersService {
	private logger: Logger = new Logger(UsersService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	public adapt(graphQlUser: any): User {
		return {
			id: get(graphQlUser, 'id'),
			firstName: get(graphQlUser, 'first_name'),
			lastName: get(graphQlUser, 'last_name'),
			email: get(graphQlUser, 'mail'),
			acceptedTosAt: get(graphQlUser, 'accepted_tos_at'),
		};
	}

	public async getUserByIdentityId(identityId: string): Promise<User | null> {
		const userResponse = await this.dataService.execute(GET_USER_BY_IDENTITY_ID, {
			identityId,
		});
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
		};
		const {
			data: { insert_users_profile_one: createdUser },
		} = await this.dataService.execute(INSERT_USER, { newUser });
		this.logger.debug(`user ${createdUser.id} created`);

		// Link the user with the identity
		const newUserIdentity = {
			id: idpId,
			identity_id: idp,
			identity_provider_name: idp,
			profile_id: createdUser.id,
		};
		await this.dataService.execute(INSERT_USER_IDENTITY, { newUserIdentity });
		this.logger.debug(`user ${createdUser.id} linked with idp '${idp}'`);

		return this.adapt(createdUser);
	}

	public async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const updateUser = {
			first_name: updateUserDto.firstName,
			last_name: updateUserDto.lastName,
			mail: updateUserDto.email,
		};

		const {
			data: { update_users_profile_by_pk: updatedUser },
		} = await this.dataService.execute(UPDATE_USER, { id, updateUser });

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
		} = await this.dataService.execute(UPDATE_USER, { id, updateUser });

		return this.adapt(updatedUser);
	}
}
