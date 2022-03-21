import { Injectable, Logger } from '@nestjs/common';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { QueryOrigin } from '../types';

type IsAllowed = (query: string, variables: any) => Promise<boolean>;

@Injectable()
export class DataPermissionsService {
	private logger = new Logger(DataPermissionsService.name, { timestamp: true });

	private static QUERY_PERMISSIONS: {
		CLIENT: { [queryName: string]: IsAllowed };
		PROXY: { [queryName: string]: IsAllowed };
	} = {
		CLIENT: {
			TEST_QUERY: async (query: string) => {
				return query.includes('query test');
			},
		},
		PROXY: {},
	};

	public async verify(
		queryName: string,
		origin: QueryOrigin,
		queryDto: GraphQlQueryDto
	): Promise<boolean> {
		this.logger.log(`Verifying... ${queryName}`);
		if (DataPermissionsService.QUERY_PERMISSIONS[origin][queryName]) {
			this.logger.log(`Permissions set for query ${queryName}`);
			return DataPermissionsService.QUERY_PERMISSIONS[origin]['TEST_QUERY'](
				queryDto.query,
				queryDto.variables
			);
		}

		// no specific permissions specified, allow query
		return true;
	}
}
