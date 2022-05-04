import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { addMinutes, isBefore, parseISO } from 'date-fns';
import { find, isArray, isEmpty, set } from 'lodash';

import { CreateVisitDto, UpdateVisitDto, VisitsQueryDto } from '../dto/visits.dto';
import {
	GqlNote,
	GqlUpdateVisit,
	GqlVisit,
	GqlVisitWithNotes,
	Note,
	Visit,
	VisitSpaceCount,
	VisitStatus,
	VisitTimeframe,
} from '../types';

import {
	FindActiveVisitByUserAndSpaceDocument,
	FindActiveVisitByUserAndSpaceQuery,
	FindActualVisitByUserAndSpaceDocument,
	FindActualVisitByUserAndSpaceQuery,
	FindApprovedAlmostEndedVisitsWithoutNotificationDocument,
	FindApprovedAlmostEndedVisitsWithoutNotificationQuery,
	FindApprovedEndedVisitsWithoutNotificationDocument,
	FindApprovedEndedVisitsWithoutNotificationQuery,
	FindApprovedStartedVisitsWithoutNotificationDocument,
	FindApprovedStartedVisitsWithoutNotificationQuery,
	FindVisitByIdDocument,
	FindVisitByIdQuery,
	FindVisitsDocument,
	FindVisitsQuery,
	FindVisitsQueryVariables,
	GetVisitRequestForAccessDocument,
	GetVisitRequestForAccessQuery,
	InsertNoteDocument,
	InsertNoteMutation,
	InsertVisitDocument,
	InsertVisitMutation,
	PendingVisitCountForUserBySlugDocument,
	PendingVisitCountForUserBySlugQuery,
	UpdateVisitDocument,
	UpdateVisitMutation,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { ORDER_PROP_TO_DB_PROP } from '~modules/visits/consts';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

@Injectable()
export class VisitsService {
	private logger: Logger = new Logger(VisitsService.name, { timestamp: true });

	private statusTransitions = {
		[VisitStatus.PENDING]: [
			VisitStatus.APPROVED,
			VisitStatus.CANCELLED_BY_VISITOR,
			VisitStatus.DENIED,
			VisitStatus.PENDING,
		],
		[VisitStatus.CANCELLED_BY_VISITOR]: [VisitStatus.CANCELLED_BY_VISITOR],
		[VisitStatus.APPROVED]: [
			VisitStatus.APPROVED,
			VisitStatus.CANCELLED_BY_VISITOR,
			VisitStatus.DENIED,
		],
		[VisitStatus.DENIED]: [VisitStatus.DENIED],
	};

	constructor(private dataService: DataService) {}

	public statusTransitionAllowed(from: VisitStatus, to: VisitStatus): boolean {
		return this.statusTransitions[from].includes(to);
	}

	public validateDates(startAt: string, endAt: string): boolean {
		if ((!startAt && endAt) || (startAt && !endAt)) {
			throw new InternalServerErrorException(
				'Both startAt end endAt must be specified when updating any of these'
			);
		}
		if (startAt && endAt && !isBefore(parseISO(startAt), parseISO(endAt))) {
			throw new InternalServerErrorException('startAt must precede endAt');
		}
		// both empty -- ok
		return true;
	}

	/* istanbul ignore next */
	public adaptSpaceAddress(graphQlAddress: any): string {
		const locality = graphQlAddress?.locality || '';
		const postalCode = graphQlAddress?.postal_code || '';
		const street = graphQlAddress?.street || '';

		if (locality || postalCode || street) {
			return `${street}, ${postalCode} ${locality}`;
		}
		return '';
	}

	public adaptEmail(graphQlInfo: any): string {
		const contactPoint = find(graphQlInfo?.contactPoint, { contact_type: 'ontsluiting' });
		return contactPoint?.email || null;
	}

	public adapt(graphQlVisit: GqlVisit): Visit | null {
		if (!graphQlVisit) {
			return null;
		}
		/* istanbul ignore next */
		return {
			createdAt: graphQlVisit?.created_at,
			endAt: graphQlVisit?.end_date,
			id: graphQlVisit?.id,
			note: this.adaptNotes((graphQlVisit as GqlVisitWithNotes)?.visitor_space_request_notes),
			reason: graphQlVisit?.user_reason,
			spaceAddress: this.adaptSpaceAddress(
				graphQlVisit?.visitor_space?.content_partner?.information[0]?.primary_site?.address
			),
			spaceId: graphQlVisit?.cp_space_id,
			spaceMail: this.adaptEmail(
				graphQlVisit?.visitor_space?.content_partner?.information?.[0]
			),
			spaceName: graphQlVisit?.visitor_space?.content_partner?.schema_name,
			spaceSlug: graphQlVisit?.visitor_space?.slug,
			spaceColor: graphQlVisit?.visitor_space?.schema_color,
			spaceImage: graphQlVisit?.visitor_space?.schema_image,
			spaceLogo: graphQlVisit?.visitor_space?.content_partner?.information[0]?.logo?.iri,
			spaceInfo: graphQlVisit?.visitor_space?.content_partner?.information[0]?.description,
			spaceDescription: graphQlVisit?.visitor_space?.schema_description,
			spaceServiceDescription: graphQlVisit?.visitor_space?.schema_service_description,
			startAt: graphQlVisit?.start_date,
			status: graphQlVisit?.status as VisitStatus,
			timeframe: graphQlVisit?.user_timeframe,
			updatedAt: graphQlVisit?.updated_at,
			updatedById: graphQlVisit?.last_updated_by?.id,
			updatedByName: graphQlVisit?.last_updated_by?.full_name,
			userProfileId: graphQlVisit?.user_profile_id,
			visitorId: graphQlVisit?.requested_by?.id,
			visitorMail: graphQlVisit?.requested_by?.mail,
			visitorName: graphQlVisit?.requested_by?.full_name,
			visitorFirstName: graphQlVisit?.requested_by?.first_name,
			visitorLastName: graphQlVisit?.requested_by?.last_name,
		};
	}

	public adaptNotes(graphQlNotes: GqlNote[]): Note {
		if (isEmpty(graphQlNotes)) {
			return null;
		}
		/* istanbul ignore next */
		return {
			id: graphQlNotes[0].id,
			authorName: graphQlNotes[0].profile?.full_name || null,
			note: graphQlNotes[0].note,
			createdAt: graphQlNotes[0].created_at,
		};
	}

	public async create(
		createVisitDto: CreateVisitDto & { visitorSpaceId: string },
		userProfileId: string
	): Promise<Visit> {
		const newVisit = {
			cp_space_id: createVisitDto.visitorSpaceId,
			user_profile_id: userProfileId,
			user_reason: createVisitDto.reason,
			user_timeframe: createVisitDto.timeframe,
			user_accepted_tos: createVisitDto.acceptedTos,
		};

		const {
			data: { insert_maintainer_visitor_space_request_one: createdVisit },
		} = await this.dataService.execute<InsertVisitMutation>(InsertVisitDocument, { newVisit });

		this.logger.debug(`Visit ${createdVisit.id} created`);

		return this.adapt(createdVisit);
	}

	public async update(
		id: string,
		updateVisitDto: UpdateVisitDto,
		userProfileId: string
	): Promise<Visit> {
		const { startAt, endAt } = updateVisitDto;
		// if any of these is set, both must be set (db constraint)
		this.validateDates(startAt, endAt);

		const updateVisit: Partial<GqlUpdateVisit> = {
			...(startAt ? { start_date: startAt } : {}),
			...(endAt ? { end_date: endAt } : {}),
			...(updateVisitDto.status ? { status: updateVisitDto.status } : {}),
			updated_by: userProfileId,
		};

		const currentVisit = await this.findById(id); // Get current visit status
		if (!currentVisit) {
			throw new NotFoundException(`Visit with id '${id}' not found`);
		}

		// Check status transition is valid
		if (updateVisit.status) {
			if (
				!this.statusTransitionAllowed(
					currentVisit.status,
					updateVisit.status as VisitStatus
				)
			) {
				throw new UnauthorizedException(
					`Status transition '${currentVisit.status}' -> '${updateVisit.status}' is not allowed`
				);
			}
		}

		await this.dataService.execute<UpdateVisitMutation>(UpdateVisitDocument, {
			id,
			updateVisit,
		});

		if (updateVisitDto.note) {
			await this.insertNote(id, updateVisitDto.note, userProfileId);
		}

		return this.findById(id);
	}

	public async insertNote(
		visitId: string,
		note: string,
		userProfileId: string
	): Promise<boolean> {
		const {
			data: { insert_maintainer_visitor_space_request_note_one: insertNote },
		} = await this.dataService.execute<InsertNoteMutation>(InsertNoteDocument, {
			visitId,
			note,
			userProfileId,
		});

		return !!insertNote;
	}

	public async findAll(
		inputQuery: VisitsQueryDto,
		parameters: {
			cpSpaceId?: string | null; // Meemoo admins should pass null, CP admins need to pass their own cpSpaceId
			userProfileId?: string;
		}
	): Promise<IPagination<Visit>> {
		const { query, status, timeframe, page, size, orderProp, orderDirection } = inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		/** Dynamically build the where object  */
		const where: FindVisitsQueryVariables['where'] = {};

		if (!isEmpty(query) && query !== '%' && query !== '%%') {
			// If we are searching inside one cpSpace, we should not search the name of the cpSpace
			const visitorSpaceFilter: FindVisitsQueryVariables['where'] = {
				visitor_space: { content_partner: { schema_name: { _ilike: query } } },
			};
			const filterBySpaceName = parameters.cpSpaceId ? [] : [visitorSpaceFilter];

			where._or = [
				{ requested_by: { full_name: { _ilike: query } } },
				{ requested_by: { mail: { _ilike: query } } },
				...filterBySpaceName,
			];
		}

		if (!isEmpty(status)) {
			where.status = {
				_in: isArray(status) ? status : [status],
			};
		}

		if (!isEmpty(parameters.cpSpaceId)) {
			where.cp_space_id = {
				_eq: parameters.cpSpaceId,
			};
		}

		if (!isEmpty(timeframe)) {
			switch (timeframe) {
				case VisitTimeframe.FUTURE:
					where.start_date = {
						_gt: new Date().toISOString(),
					};
					break;

				case VisitTimeframe.ACTIVE:
					where.start_date = {
						_lte: new Date().toISOString(),
					};
					where.end_date = {
						_gte: new Date().toISOString(),
					};
					break;

				case VisitTimeframe.PAST:
					where.end_date = {
						_lt: new Date().toISOString(),
					};
					break;
			}
		}

		if (!isEmpty(parameters.userProfileId)) {
			where.user_profile_id = { _eq: parameters.userProfileId };
		}

		const visitsResponse = await this.dataService.execute<FindVisitsQuery>(FindVisitsDocument, {
			where,
			offset,
			limit,
			orderBy: set(
				{},
				ORDER_PROP_TO_DB_PROP[orderProp] || ORDER_PROP_TO_DB_PROP['startAt'],
				orderDirection || SortDirection.desc
			),
		});

		return Pagination<Visit>({
			items: visitsResponse.data.maintainer_visitor_space_request.map((visit: any) =>
				this.adapt(visit)
			),
			page,
			size,
			total: visitsResponse.data.maintainer_visitor_space_request_aggregate.aggregate.count,
		});
	}

	public async findById(id: string): Promise<Visit> {
		const visitResponse = await this.dataService.execute<FindVisitByIdQuery>(
			FindVisitByIdDocument,
			{ id }
		);

		if (!visitResponse.data.maintainer_visitor_space_request[0]) {
			throw new NotFoundException(`Visit with id '${id}' not found`);
		}

		return this.adapt(visitResponse.data.maintainer_visitor_space_request[0]);
	}

	public async getActiveVisitForUserAndSpace(
		userProfileId: string,
		visitorSpaceSlug: string
	): Promise<Visit | null> {
		const visitResponse = await this.dataService.execute<FindActiveVisitByUserAndSpaceQuery>(
			FindActiveVisitByUserAndSpaceDocument,
			{
				userProfileId,
				visitorSpaceSlug,
				now: new Date().toISOString(),
			}
		);

		if (!visitResponse.data.maintainer_visitor_space_request[0]) {
			return null;
		}

		return this.adapt(visitResponse.data.maintainer_visitor_space_request[0]);
	}

	public async getPendingVisitCountForUserBySlug(
		userProfileId: string,
		slug: string
	): Promise<VisitSpaceCount> {
		const result = await this.dataService.execute<PendingVisitCountForUserBySlugQuery>(
			PendingVisitCountForUserBySlugDocument,
			{
				user: userProfileId,
				slug,
			}
		);

		/* istanbul ignore next */
		return {
			count: result?.data?.maintainer_visitor_space_request_aggregate?.aggregate?.count || 0,
			id: result?.data?.maintainer_visitor_space_request_aggregate?.nodes?.[0]?.cp_space_id,
		};
	}

	public async getApprovedAndStartedVisitsWithoutNotification(): Promise<Visit[]> {
		const visitsResponse =
			await this.dataService.execute<FindApprovedStartedVisitsWithoutNotificationQuery>(
				FindApprovedStartedVisitsWithoutNotificationDocument,
				{ now: new Date().toISOString() }
			);
		return visitsResponse.data.maintainer_visitor_space_request.map((visit: any) =>
			this.adapt(visit)
		);
	}

	public async getApprovedAndAlmostEndedVisitsWithoutNotification() {
		const visitsResponse =
			await this.dataService.execute<FindApprovedAlmostEndedVisitsWithoutNotificationQuery>(
				FindApprovedAlmostEndedVisitsWithoutNotificationDocument,
				{
					now: new Date().toISOString(),
					warningDate: addMinutes(new Date(), 15).toISOString(),
				}
			);
		return visitsResponse.data.maintainer_visitor_space_request.map((visit: any) =>
			this.adapt(visit)
		);
	}

	public async getApprovedAndEndedVisitsWithoutNotification() {
		const visitsResponse =
			await this.dataService.execute<FindApprovedEndedVisitsWithoutNotificationQuery>(
				FindApprovedEndedVisitsWithoutNotificationDocument,
				{ now: new Date().toISOString() }
			);
		return visitsResponse.data.maintainer_visitor_space_request.map((visit: any) =>
			this.adapt(visit)
		);
	}

	/**
	 * Checks if the user has access to a maintainer's space because he has an approved visit request for the current date
	 * @param userProfileId: UUID of a user
	 * @param maintainerOrId: OR-id of a maintainer
	 */
	async hasAccess(userProfileId: string, maintainerOrId: string): Promise<boolean> {
		const visitsResponse = await this.dataService.execute<GetVisitRequestForAccessQuery>(
			GetVisitRequestForAccessDocument,
			{
				userProfileId,
				maintainerOrId,
				now: new Date().toISOString(),
			}
		);

		return visitsResponse.data.maintainer_visitor_space_request.length > 0;
	}

	public async getAccessStatus(spaceId: string, userProfileId: string): Promise<VisitStatus> {
		const visitResponse = await this.dataService.execute<FindActualVisitByUserAndSpaceQuery>(
			FindActualVisitByUserAndSpaceDocument,
			{
				userProfileId,
				spaceId,
				now: new Date().toISOString(),
			}
		);

		if (!visitResponse.data.maintainer_visitor_space_request[0]) {
			return VisitStatus.DENIED;
		}

		return visitResponse.data.maintainer_visitor_space_request[0].status as VisitStatus;
	}
}
