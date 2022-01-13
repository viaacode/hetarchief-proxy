import { Injectable, Logger } from '@nestjs/common';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { QueryOrigin } from '../types';

type IsAllowed = (query: string, variables: any) => Promise<boolean>;

@Injectable()
export class DataPermissionsService {
	private logger = new Logger('DataPermissionsService', { timestamp: true });
	private static QUERY_PERMISSIONS: {
		CLIENT: { [queryName: string]: IsAllowed };
		PROXY: { [queryName: string]: IsAllowed };
	} = {
		CLIENT: {
			TEST_QUERY: async (query: string, variables: any) => {
				return query.includes('query test');
			},
		},
		PROXY: {},
	};

	public async verify(origin: QueryOrigin, queryDto: GraphQlQueryDto): Promise<boolean> {
		const queryStart = queryDto.query.replace(/[\s]+/gm, ' ').split(/[{(]/)[0].trim();
		this.logger.log(`Veryfing... ${queryStart}`);
		return DataPermissionsService.QUERY_PERMISSIONS[origin]['TEST_QUERY'](
			queryDto.query,
			queryDto.variables
		);
	}
}
