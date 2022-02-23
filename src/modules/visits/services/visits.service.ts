import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { get, isArray, isEmpty, set } from 'lodash';

import {
	CreateVisitDto,
	UpdateVisitDto,
	UpdateVisitStatusDto,
	VisitsQueryDto,
} from '../dto/visits.dto';
import { Visit, VisitStatus } from '../types';

import { FIND_VISIT_BY_ID, FIND_VISITS, INSERT_VISIT, UPDATE_VISIT } from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
import { ORDER_PROP_TO_DB_PROP } from '~modules/visits/consts';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

@Injectable()
export class VisitsService {
	private logger: Logger = new Logger(VisitsService.name, { timestamp: true });

	private statusTransitions = {
		[VisitStatus.PENDING]: [
			VisitStatus.CANCELLED_BY_VISITOR,
			VisitStatus.APPROVED,
			VisitStatus.DENIED,
		],
		[VisitStatus.CANCELLED_BY_VISITOR]: [],
		[VisitStatus.APPROVED]: [VisitStatus.DENIED],
		[VisitStatus.DENIED]: [],
	};

	constructor(private dataService: DataService) {}

	public statusTransitionAllowed(from: VisitStatus, to: VisitStatus): boolean {
		return this.statusTransitions[from].includes(to);
	}

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

	public async update(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit> {
		const { startAt, endAt } = updateVisitDto;
		const updateVisit = {
			...(startAt ? { start_date: startAt } : {}),
			...(endAt ? { end_date: endAt } : {}),
		};
		const {
			data: { update_cp_visit_by_pk: updatedVisit },
		} = await this.dataService.execute(UPDATE_VISIT, {
			id,
			updateVisit,
		});
		return this.adapt(updatedVisit);
	}

	public async updateStatus(id: string, updateStatusDto: UpdateVisitStatusDto): Promise<Visit> {
		// Get current visit status
		const currentVisit = await this.findById(id);
		if (!this.statusTransitionAllowed(currentVisit.status, updateStatusDto.status)) {
			throw new UnauthorizedException(
				`Status transition '${currentVisit.status}' -> '${updateStatusDto.status}' is not allowed`
			);
		}
		const {
			data: { update_cp_visit_by_pk: updatedVisit },
		} = await this.dataService.execute(UPDATE_VISIT, {
			id,
			updateVisit: { status: updateStatusDto.status },
		});
		return this.adapt(updatedVisit);
	}

	public async findAll(inputQuery: VisitsQueryDto): Promise<IPagination<Visit>> {
		const { query, status, userProfileId, spaceId, page, size, orderProp, orderDirection } =
			inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		/** Dynamically build the where object  */
		const where: any = {};
		if (!isEmpty(query)) {
			where._or = [
				{ user_profile: { first_name: { _ilike: query } } },
				{ user_profile: { last_name: { _ilike: query } } },
				{ user_profile: { mail: { _ilike: query } } },
			];
		}

		if (!isEmpty(status)) {
			where.status = {
				_in: isArray(status) ? status : [status],
			};
		}

		if (!isEmpty(userProfileId)) {
			where.user_profile_id = {
				_eq: userProfileId,
			};
		}

		if (!isEmpty(spaceId)) {
			where.cp_space_id = {
				_eq: spaceId,
			};
		}

		const visitsResponse = await this.dataService.execute(FIND_VISITS, {
			where,
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
