import { DataService } from '@meemoo/admin-core-api';
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { addMinutes, isBefore, isFuture, isPast, parseISO } from 'date-fns';
import { find, isArray, isEmpty, set, uniq } from 'lodash';

import { CreateVisitDto, UpdateVisitDto, VisitsQueryDto } from '../dto/visits.dto';
import {
	AccessStatus,
	GqlNote,
	GqlUpdateVisit,
	GqlVisit,
	GqlVisitWithNotes,
	Note,
	VisitAccessType,
	VisitRequest,
	VisitSpaceCount,
	VisitStatus,
	VisitTimeframe,
} from '../types';

import { VisitorSpaceStatus } from '~generated/database-aliases';
import {
	DeleteVisitFolderAccessDocument,
	DeleteVisitFolderAccessMutation,
	DeleteVisitFolderAccessMutationVariables,
	FindActiveVisitByUserAndSpaceDocument,
	FindActiveVisitByUserAndSpaceQuery,
	FindActiveVisitByUserAndSpaceQueryVariables,
	FindApprovedAlmostEndedVisitsWithoutNotificationDocument,
	FindApprovedAlmostEndedVisitsWithoutNotificationQuery,
	FindApprovedAlmostEndedVisitsWithoutNotificationQueryVariables,
	FindApprovedEndedVisitsWithoutNotificationDocument,
	FindApprovedEndedVisitsWithoutNotificationQuery,
	FindApprovedEndedVisitsWithoutNotificationQueryVariables,
	FindApprovedStartedVisitsWithoutNotificationDocument,
	FindApprovedStartedVisitsWithoutNotificationQuery,
	FindApprovedStartedVisitsWithoutNotificationQueryVariables,
	FindPendingOrApprovedVisitRequestsForUserDocument,
	FindPendingOrApprovedVisitRequestsForUserQuery,
	FindPendingOrApprovedVisitRequestsForUserQueryVariables,
	FindVisitByIdDocument,
	FindVisitByIdQuery,
	FindVisitByIdQueryVariables,
	FindVisitEndDatesByFolderIdDocument,
	FindVisitEndDatesByFolderIdQuery,
	FindVisitEndDatesByFolderIdQueryVariables,
	FindVisitsDocument,
	FindVisitsQuery,
	FindVisitsQueryVariables,
	GetVisitRequestForAccessDocument,
	GetVisitRequestForAccessQuery,
	GetVisitRequestForAccessQueryVariables,
	InsertNoteDocument,
	InsertNoteMutation,
	InsertNoteMutationVariables,
	InsertVisitDocument,
	InsertVisitFolderAccessDocument,
	InsertVisitFolderAccessMutation,
	InsertVisitFolderAccessMutationVariables,
	InsertVisitMutation,
	InsertVisitMutationVariables,
	PendingVisitCountForUserBySlugDocument,
	PendingVisitCountForUserBySlugQuery,
	PendingVisitCountForUserBySlugQueryVariables,
	UpdateVisitDocument,
	UpdateVisitMutation,
	UpdateVisitMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import { OrganisationInfoV2 } from '~modules/organisations/organisations.types';
import { ORDER_PROP_TO_DB_PROP } from '~modules/visits/consts';
import { convertToDate } from '~shared/helpers/format-belgian-date';
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
		[VisitStatus.DENIED]: [VisitStatus.DENIED, VisitStatus.APPROVED],
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

	public adaptEmail(graphQlInfo: OrganisationInfoV2): string {
		const contactPoint = find(graphQlInfo?.contact_point, { contact_type: 'ontsluiting' });
		return contactPoint?.email || null;
	}

	public adaptTelephone(graphQlInfo: OrganisationInfoV2): string {
		const contactPoint = find(graphQlInfo?.contact_point, { contact_type: 'ontsluiting' });
		return contactPoint?.telephone || null;
	}

	public adapt(graphQlVisit: GqlVisit): VisitRequest | null {
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
				graphQlVisit?.visitor_space?.content_partner?.information?.primary_site?.address
			),
			spaceId: graphQlVisit?.cp_space_id,
			spaceMaintainerId: graphQlVisit?.visitor_space?.schema_maintainer_id,
			spaceMail: this.adaptEmail(
				graphQlVisit?.visitor_space?.content_partner?.information as OrganisationInfoV2
			),
			spaceTelephone: this.adaptTelephone(
				graphQlVisit?.visitor_space?.content_partner?.information as OrganisationInfoV2
			),
			spaceName: graphQlVisit?.visitor_space?.content_partner?.schema_name,
			spaceSlug: graphQlVisit?.visitor_space?.slug,
			spaceColor: graphQlVisit?.visitor_space?.schema_color,
			spaceImage: graphQlVisit?.visitor_space?.schema_image,
			spaceLogo: graphQlVisit?.visitor_space?.content_partner?.information?.logo?.iri,
			spaceInfo: graphQlVisit?.visitor_space?.content_partner?.information?.description,
			spaceDescription: graphQlVisit?.visitor_space?.schema_description,
			spaceServiceDescription: graphQlVisit?.visitor_space?.schema_service_description,
			startAt: graphQlVisit?.start_date,
			status: graphQlVisit?.status as VisitStatus,
			accessType: graphQlVisit?.access_type || VisitAccessType.Full,
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
			visitorLanguage: graphQlVisit?.requested_by?.language,
			accessibleFolderIds: uniq(
				graphQlVisit.accessible_folders.map(
					(accessibleFolderLink) => accessibleFolderLink.folder.id
				)
			),
			accessibleObjectIds: uniq(
				graphQlVisit.accessible_folders.flatMap((accessibleFolderLink) =>
					accessibleFolderLink.folder.ies
						.filter(
							(accessibleFolderIeLink) =>
								graphQlVisit?.access_type === VisitAccessType.Full ||
								(graphQlVisit?.access_type === VisitAccessType.Folders &&
									graphQlVisit?.visitor_space?.schema_maintainer_id ===
										accessibleFolderIeLink?.ie?.maintainer?.schema_identifier)
						)
						.map(
							(accessibleFolderIeLink) => accessibleFolderIeLink.ie.schema_identifier
						)
				)
			),
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
	): Promise<VisitRequest> {
		const newVisit = {
			cp_space_id: createVisitDto.visitorSpaceId,
			user_profile_id: userProfileId,
			user_reason: createVisitDto.reason,
			user_timeframe: createVisitDto.timeframe,
			user_accepted_tos: createVisitDto.acceptedTos,
		};

		const { insert_maintainer_visitor_space_request_one: createdVisit } =
			await this.dataService.execute<InsertVisitMutation, InsertVisitMutationVariables>(
				InsertVisitDocument,
				{ newVisit }
			);

		this.logger.debug(`Visit ${createdVisit.id} created`);

		return this.adapt(createdVisit);
	}

	public async update(
		id: string,
		updateVisitDto: UpdateVisitDto,
		userProfileId: string
	): Promise<VisitRequest> {
		const { startAt, endAt, accessType } = updateVisitDto;
		let { accessFolderIds } = updateVisitDto;
		// if any of these is set, both must be set (db constraint)
		this.validateDates(startAt, endAt);

		const updateVisit: Partial<GqlUpdateVisit> = {
			...(startAt ? { start_date: startAt } : {}),
			...(endAt ? { end_date: endAt } : {}),
			...(updateVisitDto.status ? { status: updateVisitDto.status } : {}),
			updated_by: userProfileId,
			access_type: accessType,
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
				throw new ForbiddenException(
					`Status transition '${currentVisit.status}' -> '${updateVisit.status}' is not allowed`
				);
			}
		}

		//IF status is DENIED
		//THEN change access_type to FULL and clear accessFolderIds
		if (updateVisit.status === VisitStatus.DENIED) {
			updateVisit.access_type = VisitAccessType.Full;
			accessFolderIds = null;
		} else {
			if (updateVisit.access_type) {
				// IF accessFolderIds is empty and accessType is FOLDERS
				// OR accessFolderIds is not empty and accessType is FULL
				// THEN throw BadRequest exception
				if (
					isEmpty(accessType) ||
					(isEmpty(accessFolderIds) &&
						updateVisit.access_type === VisitAccessType.Folders) ||
					(!isEmpty(accessFolderIds) && updateVisit.access_type === VisitAccessType.Full)
				) {
					throw new BadRequestException(
						`The amount of accessFolderIds (${
							isEmpty(accessFolderIds) ? 0 : accessFolderIds.length
						}) does not correspond with the accessType ${updateVisit.access_type}`
					);
				}
			}
		}

		// Always delete the old access folders
		await this.dataService.execute<
			DeleteVisitFolderAccessMutation,
			DeleteVisitFolderAccessMutationVariables
		>(DeleteVisitFolderAccessDocument, {
			visitRequestId: currentVisit.id,
		});

		// IF accessFolderIds is not empty and accessType is FOLDERS
		// THEN add new folders to the folder_access table
		if (!isEmpty(accessFolderIds) && updateVisit.access_type === VisitAccessType.Folders) {
			await this.dataService.execute<
				InsertVisitFolderAccessMutation,
				InsertVisitFolderAccessMutationVariables
			>(InsertVisitFolderAccessDocument, {
				objects: [
					...accessFolderIds.map((accessFolderId: string) => ({
						folder_id: accessFolderId,
						visit_request_id: currentVisit.id,
					})),
				],
			});
		}
		// }

		await this.dataService.execute<UpdateVisitMutation, UpdateVisitMutationVariables>(
			UpdateVisitDocument,
			{
				id,
				updateVisit: updateVisit as any,
			}
		);

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
		const { insert_maintainer_visitor_space_request_note_one: insertNote } =
			await this.dataService.execute<InsertNoteMutation, InsertNoteMutationVariables>(
				InsertNoteDocument,
				{
					visitId,
					note,
					userProfileId,
				}
			);

		return !!insertNote;
	}

	public async findAll(
		inputQuery: VisitsQueryDto,
		parameters: {
			visitorSpaceSlug?: string | null; // Meemoo admins should pass null, CP admins need to pass their own cpSpaceId
			userProfileId?: string;
			visitorSpaceStatuses?: VisitorSpaceStatus[];
		}
	): Promise<IPagination<VisitRequest>> {
		const { query, status, timeframe, accessType, page, size, orderProp, orderDirection } =
			inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		/** Dynamically build the where object  */
		const where: FindVisitsQueryVariables['where'] = {};

		if (!isEmpty(query) && query !== '%' && query !== '%%') {
			// If we are searching inside one cpSpace, we should not search the name of the cpSpace
			const visitorSpaceFilter: FindVisitsQueryVariables['where'] = {
				visitor_space: { content_partner: { schema_name: { _ilike: query } } },
			};
			const filterBySpaceName = parameters.visitorSpaceSlug ? [] : [visitorSpaceFilter];

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

		if (!isEmpty(parameters.visitorSpaceSlug)) {
			where.visitor_space = {
				slug: {
					_eq: parameters.visitorSpaceSlug,
				},
			};
		}

		if (parameters.visitorSpaceStatuses?.length > 0) {
			where.visitor_space = {
				...(where.visitor_space ? where.visitor_space : {}),
				status: { _in: parameters.visitorSpaceStatuses },
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

		if (!isEmpty(accessType)) {
			where.access_type = { _eq: accessType };
		}

		const visitsResponse = await this.dataService.execute<
			FindVisitsQuery,
			FindVisitsQueryVariables
		>(FindVisitsDocument, {
			where,
			offset,
			limit,
			orderBy: set(
				{},
				ORDER_PROP_TO_DB_PROP[orderProp] || ORDER_PROP_TO_DB_PROP['startAt'],
				orderDirection || SortDirection.desc
			),
		});

		return Pagination<VisitRequest>({
			items: visitsResponse.maintainer_visitor_space_request.map((visit: any) =>
				this.adapt(visit)
			),
			page,
			size,
			total: visitsResponse.maintainer_visitor_space_request_aggregate.aggregate.count,
		});
	}

	public async findById(id: string): Promise<VisitRequest> {
		const visitResponse = await this.dataService.execute<
			FindVisitByIdQuery,
			FindVisitByIdQueryVariables
		>(FindVisitByIdDocument, { id });

		if (!visitResponse.maintainer_visitor_space_request[0]) {
			throw new NotFoundException(`Visit with id '${id}' not found`);
		}

		return this.adapt(visitResponse.maintainer_visitor_space_request[0]);
	}

	public async findEndDatesByFolderId(folderId: string): Promise<Date[]> {
		const visitResponse = await this.dataService.execute<
			FindVisitEndDatesByFolderIdQuery,
			FindVisitEndDatesByFolderIdQueryVariables
		>(FindVisitEndDatesByFolderIdDocument, { folderId, now: new Date().toISOString() });

		return visitResponse.maintainer_visitor_space_request_folder_access.map(
			(visit) => new Date(visit.visitor_space_request?.end_date)
		);
	}

	public async getActiveVisitForUserAndSpace(
		userProfileId: string,
		visitorSpaceSlug: string
	): Promise<VisitRequest | null> {
		const visitResponse = await this.dataService.execute<
			FindActiveVisitByUserAndSpaceQuery,
			FindActiveVisitByUserAndSpaceQueryVariables
		>(FindActiveVisitByUserAndSpaceDocument, {
			userProfileId,
			visitorSpaceSlug,
			now: new Date().toISOString(),
		});

		if (!visitResponse.maintainer_visitor_space_request[0]) {
			return null;
		}

		return this.adapt(visitResponse.maintainer_visitor_space_request[0]);
	}

	public async getPendingVisitCountForUserBySlug(
		userProfileId: string,
		slug: string
	): Promise<VisitSpaceCount> {
		const result = await this.dataService.execute<
			PendingVisitCountForUserBySlugQuery,
			PendingVisitCountForUserBySlugQueryVariables
		>(PendingVisitCountForUserBySlugDocument, {
			user: userProfileId,
			slug,
		});

		/* istanbul ignore next */
		return {
			count: result?.maintainer_visitor_space_request_aggregate?.aggregate?.count || 0,
			id: result?.maintainer_visitor_space_request_aggregate?.nodes?.[0]?.cp_space_id,
		};
	}

	public async getApprovedAndStartedVisitsWithoutNotification(): Promise<VisitRequest[]> {
		const visitsResponse = await this.dataService.execute<
			FindApprovedStartedVisitsWithoutNotificationQuery,
			FindApprovedStartedVisitsWithoutNotificationQueryVariables
		>(FindApprovedStartedVisitsWithoutNotificationDocument, { now: new Date().toISOString() });
		return visitsResponse.maintainer_visitor_space_request.map((visit: any) =>
			this.adapt(visit)
		);
	}

	public async getApprovedAndAlmostEndedVisitsWithoutNotification() {
		const visitsResponse = await this.dataService.execute<
			FindApprovedAlmostEndedVisitsWithoutNotificationQuery,
			FindApprovedAlmostEndedVisitsWithoutNotificationQueryVariables
		>(FindApprovedAlmostEndedVisitsWithoutNotificationDocument, {
			now: new Date().toISOString(),
			warningDate: addMinutes(new Date(), 15).toISOString(),
		});
		return visitsResponse.maintainer_visitor_space_request.map((visit: any) =>
			this.adapt(visit)
		);
	}

	public async getApprovedAndEndedVisitsWithoutNotification() {
		const visitsResponse = await this.dataService.execute<
			FindApprovedEndedVisitsWithoutNotificationQuery,
			FindApprovedEndedVisitsWithoutNotificationQueryVariables
		>(FindApprovedEndedVisitsWithoutNotificationDocument, { now: new Date().toISOString() });
		return visitsResponse.maintainer_visitor_space_request.map((visit: any) =>
			this.adapt(visit)
		);
	}

	/**
	 * Checks if the user has access to a maintainer's space because he has an approved visit request for the current date
	 * @param userProfileId: UUID of a user
	 * @param maintainerOrId: OR-id of a maintainer
	 */
	async hasAccess(userProfileId: string, maintainerOrId: string): Promise<boolean> {
		const visitsResponse = await this.dataService.execute<
			GetVisitRequestForAccessQuery,
			GetVisitRequestForAccessQueryVariables
		>(GetVisitRequestForAccessDocument, {
			userProfileId,
			maintainerOrId,
			now: new Date().toISOString(),
		});

		return visitsResponse.maintainer_visitor_space_request.length > 0;
	}

	public async getAccessStatus(spaceSlug: string, userProfileId: string): Promise<AccessStatus> {
		const visitResponse = await this.dataService.execute<
			FindPendingOrApprovedVisitRequestsForUserQuery,
			FindPendingOrApprovedVisitRequestsForUserQueryVariables
		>(FindPendingOrApprovedVisitRequestsForUserDocument, {
			userProfileId,
			spaceSlug,
			now: new Date().toISOString(),
		});
		// return
		// - PENDING (visit request with status pending or approved in the future)
		// - ACCESS (approved visit request with the now() time between start and end date)
		// - NO ACCESS (denied visit request or no visit request)
		const visit = visitResponse.maintainer_visitor_space_request[0];

		if (!visit) {
			return AccessStatus.NO_ACCESS;
		}
		// visit is Pending or Approved. We only return ACCESS status if the visit is APPROVED and valid right now
		if (
			visit.status === VisitStatus.APPROVED &&
			visit.start_date &&
			isPast(convertToDate(visit.start_date)) &&
			visit.end_date &&
			isFuture(convertToDate(visit.end_date))
		) {
			return AccessStatus.ACCESS;
		}

		return AccessStatus.PENDING;
	}
}
