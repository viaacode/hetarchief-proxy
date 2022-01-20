import {
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { GraphQlResponse, QueryOrigin } from '../types';

import { DataPermissionsService } from './data-permissions.service';

@Injectable()
export class DataService {
	private gotInstance: Got;
	private logger: Logger = new Logger('DataService', { timestamp: true });

	constructor(
		private configService: ConfigService,
		private dataPermissionsService: DataPermissionsService
	) {
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('GRAPHQL_URL'),
			headers: {
				'x-hasura-admin-secret': this.configService.get('GRAPHQL_SECRET'),
			},
			resolveBodyOnly: true,
			responseType: 'json',
		});
	}

	public async isAllowedToExecuteQuery(
		queryDto: GraphQlQueryDto,
		origin: QueryOrigin
	): Promise<boolean> {
		if (this.isWhitelistEnabled() && !this.isQueryWhitelisted(queryDto, origin)) {
			return false;
		}
		return this.dataPermissionsService.verify(origin, queryDto);
	}

	public isWhitelistEnabled(): boolean {
		return this.configService.get('GRAPHQL_ENABLE_WHITELIST');
	}

	private isQueryWhitelisted(queryDto: GraphQlQueryDto, origin: QueryOrigin): boolean {
		// TODO will be further implemented in ARC-255
		return true;
	}

	private getWhitelistedQuery(query: string): string {
		// TODO will be further implemented in ARC-255
		return query;
	}

	/**
	 * Execute an incoming query from the client
	 * @param queryDto the query to be executed
	 * @returns the query result
	 */
	public async executeClientQuery(queryDto: GraphQlQueryDto): Promise<GraphQlResponse> {
		// check if query can be executed
		if (!(await this.isAllowedToExecuteQuery(queryDto, QueryOrigin.CLIENT))) {
			throw new UnauthorizedException('You are not authorized to execute this query');
		}
		return this.execute(this.getWhitelistedQuery(queryDto.query), queryDto.variables);
	}

	/**
	 * execute a (GraphQl) query
	 */
	public async execute(
		query: string,
		variables: { [varName: string]: any } = {}
	): Promise<GraphQlResponse> {
		try {
			const queryData = {
				query,
				variables,
			};
			const { data } = await this.gotInstance.post<GraphQlResponse>({
				json: queryData,
				resolveBodyOnly: true, // this is duplicate but fixes a typing error
			});
			if (data.errors) {
				this.logger.error(`GraphQl query failed: ${JSON.stringify(data.errors)}`);
				throw new InternalServerErrorException();
			}
			return {
				data: data,
			};
		} catch (err) {
			this.logger.error('Failed to get data from database', err.stack);
			throw new InternalServerErrorException();
		}
	}
}
