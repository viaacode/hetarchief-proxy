import { Injectable, Logger } from '@nestjs/common';

import { PermissionResponse } from '../types';

import {
	GetPermissionsDocument,
	GetPermissionsQuery,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class PermissionsService {
	private logger: Logger = new Logger(PermissionsService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	public async getPermissions(): Promise<PermissionResponse[]> {
		const {
			data: { users_permission: permissions },
		} = await this.dataService.execute<GetPermissionsQuery>(GetPermissionsDocument);

		return permissions;
	}
}
