import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { get, isArray, set } from 'lodash';

import { CreateVisitDto, VisitsQueryDto } from '../dto/visits.dto';
import { Visit } from '../types';

import { FIND_VISIT_BY_ID, FIND_VISITS, INSERT_VISIT } from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
import { ORDER_PROP_TO_DB_PROP } from '~modules/visits/consts';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

@Injectable()
export class VisitsService {
	private logger: Logger = new Logger(VisitsService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	public adapt(graphQlVisit: any): Visit {
		return {
			id: get(graphQlVisit, 'id'),
			spaceId: get(graphQlVisit, 'cp_space_id'),
			userProfileId: get(graphQlVisit, 'user_profile_id'),
			timeframe: get(graphQlVisit, 'user_timeframe'),
			reason: get(graphQlVisit, 'user_reason'),
			status: get(graphQlVisit, 'status'),
			startAt: get(graphQlVisit, 'start_date'),
			endAt: get(graphQlVisit, 'end_date'),
			createdAt: get(graphQlVisit, 'created_at'),
			updatedAt: get(graphQlVisit, 'updated_at'),
			visitorName: (
				get(graphQlVisit, 'user_profile.first_name', '') +
				' ' +
				get(graphQlVisit, 'user_profile.last_name', '')
			).trim(),
			visitorMail: get(graphQlVisit, 'user_profile.mail'),
			visitorId: get(graphQlVisit, 'user_profile.id'),
		};
	}

	public async create(createVisitDto: CreateVisitDto): Promise<Visit> {
		const newVisit = {
			cp_space_id: createVisitDto.spaceId,
			user_profile_id: createVisitDto.userProfileId,
			user_reason: createVisitDto.reason,
			user_timeframe: createVisitDto.timeframe,
			user_accepted_tos_at: createVisitDto.acceptedTosAt,
		};
		const {
			data: { insert_cp_visit_one: createdVisit },
		} = await this.dataService.execute(INSERT_VISIT, { newVisit });
		this.logger.debug(`Visit ${createdVisit.id} created`);

		return this.adapt(createdVisit);
	}

	public async findAll(inputQuery: VisitsQueryDto): Promise<IPagination<Visit>> {
		const { query, status, page, size, orderProp, orderDirection } = inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const visitsResponse = await this.dataService.execute(FIND_VISITS, {
			query,
			statuses: isArray(status) ? status : [status],
			offset,
			limit,
			orderBy: set(
				{},
				ORDER_PROP_TO_DB_PROP[orderProp || 'startAt'],
				orderDirection || SortDirection.desc
			),
		});

		return Pagination<Visit>({
			items: visitsResponse.data.cp_visit.map((visit: any) => this.adapt(visit)),
			page,
			size,
			total: visitsResponse.data.cp_visit_aggregate.aggregate.count,
		});
	}

	public async findById(id: string): Promise<Visit> {
		const visitResponse = await this.dataService.execute(FIND_VISIT_BY_ID, { id });
		if (!visitResponse.data.cp_visit[0]) {
			throw new NotFoundException();
		}
		return this.adapt(visitResponse.data.cp_visit[0]);
	}
}
