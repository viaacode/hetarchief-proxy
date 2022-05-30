import {
	ForbiddenException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { DocumentNode } from 'graphql';
import { print } from 'graphql/language/printer';

import { getConfig } from '~config';

import { DuplicateKeyException } from '../../../shared/exceptions/duplicate-key.exception';
import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { GraphQlResponse, QueryOrigin } from '../types';

import { DataPermissionsService } from './data-permissions.service';

import { User } from '~modules/users/types';

@Injectable()
export class DataService {
	private logger: Logger = new Logger(DataService.name, { timestamp: true });
	private gotInstance: Got;

	constructor(
		private configService: ConfigService,
		@Inject(forwardRef(() => DataPermissionsService))
		private dataPermissionsService: DataPermissionsService
	) {
		this.gotInstance = got.extend({
			prefixUrl: getConfig(this.configService, 'graphQlUrl'),
			headers: {
				'x-hasura-admin-secret': getConfig(this.configService, 'graphQlSecret'),
			},
			resolveBodyOnly: true,
			responseType: 'json',
		});
	}

	/**
	 * Execute an incoming query from the client
	 * @param user
	 * @param queryDto the query to be executed
	 * @returns the query result
	 */
	public async executeClientQuery(
		user: User,
		queryDto: GraphQlQueryDto
	): Promise<GraphQlResponse> {
		// check if query can be executed
		if (
			!(await this.dataPermissionsService.isAllowedToExecuteQuery(
				user,
				queryDto,
				QueryOrigin.ADMIN_CORE
			))
		) {
			const queryName = this.dataPermissionsService.getQueryName(queryDto.query);
			throw new ForbiddenException(
				'You are not authorized to execute this query: ' + queryName
			);
		}
		return this.execute(
			this.dataPermissionsService.getWhitelistedQuery(queryDto.query, QueryOrigin.ADMIN_CORE),
			queryDto.variables
		);
	}

	/**
	 * execute a (GraphQl) query
	 */
	public async execute<T>(
		query: string | DocumentNode,
		variables: { [varName: string]: any } = {}
	): Promise<GraphQlResponse<T>> {
		try {
			const queryData = {
				query: typeof query === 'string' ? query : print(query),
				variables,
			};
			const data = await this.gotInstance.post<GraphQlResponse>({
				json: queryData,
				resolveBodyOnly: true, // this is duplicate but fixes a typing error
			});
			if (data.errors) {
				this.logger.error(`GraphQl query failed: ${JSON.stringify(data.errors)}`);
				if (data.errors[0]?.extensions?.code === 'constraint-violation') {
					throw new DuplicateKeyException({
						message: data.errors[0].message,
						path: data.errors[0].extensions.path,
					});
				}
				throw new InternalServerErrorException(data);
			}
			return data;
		} catch (err) {
			if (err instanceof DuplicateKeyException) {
				throw err;
			}
			this.logger.error('Failed to get data from database', err.stack);
			throw new InternalServerErrorException();
		}
	}
}
