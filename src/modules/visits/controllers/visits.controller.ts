import { randomUUID } from 'crypto';

import { TranslationsService } from '@meemoo/admin-core-api';
import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	GoneException,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Pagination } from '@studiohyperdrive/pagination';
import { IPagination } from '@studiohyperdrive/pagination/dist/lib/pagination.types';
import { addYears, isFuture } from 'date-fns';
import { Request } from 'express';

import { CreateVisitDto, UpdateVisitDto, VisitsQueryDto } from '../dto/visits.dto';
import { VisitsService } from '../services/visits.service';
import { AccessStatus, Visit, VisitAccessType, VisitSpaceCount, VisitStatus } from '../types';

import { VisitorSpaceStatus } from '~generated/database-aliases';
import { Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum } from '~generated/graphql-db-types-hetarchief';
import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { NotificationType } from '~modules/notifications/types';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { Space } from '~modules/spaces/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName, Permission } from '~modules/users/types';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { EventsHelper } from '~shared/helpers/events';

@UseGuards(LoggedInGuard)
@ApiTags('Visits')
@Controller('visits')
export class VisitsController {
	constructor(
		private visitsService: VisitsService,
		private notificationsService: NotificationsService,
		private spacesService: SpacesService,
		private eventsService: EventsService,
		private translationsService: TranslationsService
	) {}

	@Get()
	@ApiOperation({
		description:
			'Get Visits endpoint for Meemoo Admins and CP Admins. Visitors should use the /personal endpoint. ',
	})
	@RequireAnyPermissions(Permission.READ_ALL_VISIT_REQUESTS, Permission.READ_CP_VISIT_REQUESTS)
	public async getVisits(
		@Query() queryDto: VisitsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Visit>> {
		if (user.has(Permission.READ_ALL_VISIT_REQUESTS)) {
			const visits = await this.visitsService.findAll(queryDto, {
				...(queryDto?.visitorSpaceSlug
					? { visitorSpaceSlug: queryDto.visitorSpaceSlug }
					: {}),
				...(queryDto?.requesterId ? { userProfileId: queryDto.requesterId } : {}),
			});
			return visits;
		}
		// CP_VISIT_REQUESTS (user has any of these permissions as enforced by guard)
		const cpSpace = await this.spacesService.findSpaceByCpUserId(user.getId());

		if (!cpSpace) {
			throw new NotFoundException(
				this.translationsService.t(
					'modules/visits/controllers/visits___the-current-user-does-not-seem-to-be-linked-to-a-cp-space'
				)
			);
		}

		const visits = await this.visitsService.findAll(queryDto, {
			visitorSpaceSlug: cpSpace.slug,
			...(queryDto?.requesterId ? { userProfileId: queryDto.requesterId } : {}),
		});
		return visits;
	}

	@Get('personal')
	@ApiOperation({
		description: 'Get Visits endpoint for Visitors.',
	})
	@RequireAllPermissions(
		Permission.READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		Permission.MANAGE_ACCOUNT
	)
	public async getPersonalVisits(
		@Query() queryDto: VisitsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Visit>> {
		if (user.getGroupName() === GroupName.MEEMOO_ADMIN) {
			const spaces = await this.spacesService.findAll(
				{
					status: [
						VisitorSpaceStatus.Active,
						VisitorSpaceStatus.Inactive,
						VisitorSpaceStatus.Requested,
					],
					page: 1,
					size: 100,
				},
				user.getId()
			);

			const visits = spaces.items.map((space: Space) => {
				return {
					id: `permanent-id--${randomUUID()}`,
					status: VisitStatus.APPROVED,
					endAt: addYears(new Date(), 100).toISOString(),
					startAt: new Date(2000, 1, 1).toISOString(),
					visitorFirstName: user.getFirstName(),
					visitorLastName: user.getLastName(),
					visitorName: user.getFullName(),
					updatedByName: null,
					createdAt: new Date().toISOString(),
					spaceName: space.name,
					spaceMail: space.contactInfo.email,
					spaceId: space.id,
					spaceTelephone: space.contactInfo.telephone,
					reason: null,
					spaceMaintainerId: space.maintainerId,
					spaceSlug: space.slug,
					accessType: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum.Full,
					updatedById: null,
					timeframe: null,
					userProfileId: user.getId(),
					visitorId: user.getId(),
					updatedAt: new Date().toISOString(),
					visitorMail: user.getMail(),
				};
			});

			return Pagination<Visit>({
				items: visits,
				page: spaces.page,
				size: spaces.size,
				total: spaces.total,
			});
		}

		const visits = await this.visitsService.findAll(queryDto, {
			userProfileId: user.getId(),
			visitorSpaceStatus: VisitorSpaceStatus.Active, // a visitor should only see visits for active spaces
		});

		if (user.getGroupName() === GroupName.CP_ADMIN) {
			visits.items = [
				...visits.items,
				{
					id: `permanent-id--${randomUUID()}`,
					status: VisitStatus.APPROVED,
					endAt: addYears(new Date(), 100).toISOString(),
					startAt: new Date(2000, 1, 1).toISOString(),
					visitorFirstName: user.getFirstName(),
					visitorLastName: user.getLastName(),
					visitorName: user.getFullName(),
					updatedByName: null,
					createdAt: new Date().toISOString(),
					spaceName: user.getVisitorSpaceSlug(),
					spaceMail: null,
					spaceId: user.getMaintainerId(),
					spaceTelephone: null,
					reason: null,
					spaceMaintainerId: user.getMaintainerId(),
					spaceSlug: user.getVisitorSpaceSlug(),
					accessType: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum.Full,
					updatedById: null,
					timeframe: null,
					userProfileId: user.getId(),
					visitorId: user.getId(),
					updatedAt: new Date().toISOString(),
					visitorMail: user.getMail(),
				},
			];
		}

		return visits;
	}

	@Get('space/:slug/access-status')
	@ApiOperation({
		description:
			'Get Access status. Returns the highest status (APPROVED>PENDING>..) for a current active visit request. DENIED if no active visit request was found.',
	})
	@RequireAllPermissions(
		Permission.READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		Permission.MANAGE_ACCOUNT
	)
	public async getAccessStatus(
		@Param('slug') slug: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: AccessStatus }> {
		return { status: await this.visitsService.getAccessStatus(slug, user.getId()) };
	}

	@Get(':id')
	@RequireAnyPermissions(
		Permission.READ_ALL_VISIT_REQUESTS,
		Permission.READ_CP_VISIT_REQUESTS,
		Permission.READ_PERSONAL_APPROVED_VISIT_REQUESTS
	)
	public async getVisitById(@Param('id') id: string): Promise<Visit> {
		const visit = await this.visitsService.findById(id);
		return visit;
	}

	@Get('active-for-space/:visitorSpaceSlug')
	// TODO permissions?
	public async getActiveVisitForUserAndSpace(
		@Param('visitorSpaceSlug') visitorSpaceSlug: string,
		@SessionUser() user: SessionUserEntity
	): Promise<Visit | null> {
		// Check if the user is a CP admin or a Kiosk user for the requested space
		if (visitorSpaceSlug === user.getVisitorSpaceSlug()) {
			const spaceInfo = await this.spacesService.findBySlug(visitorSpaceSlug);
			// Return fake visit request that is approved and valid forever
			return {
				spaceId: spaceInfo.id,
				id: randomUUID(),
				startAt: new Date(2000, 0, 2).toISOString(),
				endAt: new Date(2100, 0, 2).toISOString(), // Second of januari to avoid issues with GMT => 31 dec 2099
				visitorName: user.getFullName(),
				spaceName: spaceInfo.name,
				spaceMaintainerId: spaceInfo.maintainerId,
				status: VisitStatus.APPROVED,
				createdAt: new Date().toISOString(),
				reason: 'permanent access',
				visitorFirstName: user.getFirstName(),
				visitorLastName: user.getLastName(),
				visitorId: user.getId(),
				visitorMail: user.getMail(),
				spaceMail: spaceInfo.contactInfo.email,
				spaceTelephone: spaceInfo.contactInfo.telephone,
				updatedById: '',
				updatedByName: '',
				spaceSlug: spaceInfo.slug,
				timeframe: '',
				updatedAt: new Date().toISOString(),
				userProfileId: user.getId(),
				accessType: VisitAccessType.Full,
				accessibleFolderIds: null,
			};
		}

		// Find visit request that is approved for the current time
		const activeVisit = await this.visitsService.getActiveVisitForUserAndSpace(
			user.getId(),
			visitorSpaceSlug
		);

		// If no visitor request, check of we need to show a 404 not found or a 403 no access
		if (!activeVisit) {
			// Check if space exists
			const space = await this.spacesService.findBySlug(visitorSpaceSlug);

			if (space) {
				if (space.status === VisitorSpaceStatus.Inactive) {
					throw new GoneException(
						this.translationsService.t(
							'modules/visits/controllers/visits___the-space-with-slug-name-is-no-longer-accepting-visit-requests',
							{ name: visitorSpaceSlug }
						)
					);
				}

				// User does not have access to existing space
				throw new ForbiddenException(
					this.translationsService.t(
						'modules/visits/controllers/visits___you-do-not-have-access-to-space-with-slug-name',
						{
							name: visitorSpaceSlug,
						}
					)
				);
			} else {
				// Space does not exist
				throw new NotFoundException(
					this.translationsService.t(
						'modules/visits/controllers/visits___space-with-slug-name-was-not-found',
						{ name: visitorSpaceSlug }
					)
				);
			}
		}

		return activeVisit;
	}

	@Get('pending-for-space/:slug')
	// TODO permissions?
	public async getPendingVisitCountForUserBySlug(
		@Param('slug') slug: string,
		@SessionUser() user: SessionUserEntity
	): Promise<VisitSpaceCount> {
		const count = await this.visitsService.getPendingVisitCountForUserBySlug(
			user.getId(),
			slug
		);
		return count;
	}

	@Post()
	@ApiOperation({
		description: 'Create a Visit request. Requires the CREATE_VISIT_REQUEST permission.',
	})
	@RequireAllPermissions(Permission.CREATE_VISIT_REQUEST)
	public async createVisit(
		@Req() request: Request,
		@Body() createVisitDto: CreateVisitDto,
		@SessionUser() user: SessionUserEntity
	): Promise<Visit> {
		if (!createVisitDto.acceptedTos) {
			throw new BadRequestException(
				this.translationsService.t(
					'modules/visits/controllers/visits___the-terms-of-service-of-the-visitor-space-need-to-be-accepted-to-be-able-to-request-a-visit'
				)
			);
		}

		// Resolve visitor space slug to visitor space id
		const visitorSpace = await this.spacesService.findBySlug(createVisitDto.visitorSpaceSlug);

		if (!visitorSpace) {
			throw new BadRequestException(
				this.translationsService.t(
					'modules/visits/controllers/visits___the-space-with-slug-name-was-not-found',
					{
						name: createVisitDto.visitorSpaceSlug,
					}
				)
			);
		}

		// Create visit request
		const visit = await this.visitsService.create(
			{
				...createVisitDto,
				visitorSpaceId: visitorSpace.id,
			},
			user.getId()
		);

		// Send notifications
		const recipients = await this.spacesService.getMaintainerProfiles(visit.spaceId);
		await this.notificationsService.onCreateVisit(visit, recipients, user);

		// Log event
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.VISIT_REQUEST,
				source: request.path,
				subject: user.getId(),
				time: new Date().toISOString(),
				data: {
					visitor_space_id: visitorSpace.id,
					user_group_name: user.getGroupName(),
					user_group_id: user.getGroupId(),
				},
			},
		]);

		return visit;
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Update a Visit request.',
	})
	@RequireAnyPermissions(
		Permission.APPROVE_DENY_ALL_VISIT_REQUESTS,
		Permission.APPROVE_DENY_CP_VISIT_REQUESTS,
		Permission.CANCEL_OWN_VISIT_REQUEST
	)
	public async update(
		@Req() request: Request,
		@Param('id') id: string,
		@Body() updateVisitDto: UpdateVisitDto,
		@SessionUser() user: SessionUserEntity
	): Promise<Visit> {
		const originalVisit = await this.visitsService.findById(id);

		if (
			user.has(Permission.CANCEL_OWN_VISIT_REQUEST) &&
			user.hasNot(Permission.APPROVE_DENY_ALL_VISIT_REQUESTS) &&
			user.hasNot(Permission.APPROVE_DENY_CP_VISIT_REQUESTS)
		) {
			if (
				originalVisit.userProfileId !== user.getId() ||
				updateVisitDto.status !== VisitStatus.CANCELLED_BY_VISITOR
			) {
				throw new ForbiddenException(
					this.translationsService.t(
						'modules/visits/controllers/visits___you-do-not-have-the-right-permissions-to-call-this-route'
					)
				);
			}

			// user can only update status, not anything else
			updateVisitDto = {
				status: VisitStatus.CANCELLED_BY_VISITOR,
			};
		}

		// update the Visit
		const visit = await this.visitsService.update(id, updateVisitDto, user.getId());

		// Post processing for notifications
		if (updateVisitDto.status) {
			await this.postProcessVisitStatusChange(
				request,
				visit,
				updateVisitDto,
				originalVisit.status,
				user
			);
		}
		if (updateVisitDto.startAt || updateVisitDto.endAt) {
			await this.postProcessVisitTimes(updateVisitDto, visit);
		}

		return visit;
	}

	/**
	 * When the a visit status changed, check if notifications should be sent
	 */
	protected async postProcessVisitStatusChange(
		request: Request,
		visit: Visit,
		updateVisitDto: UpdateVisitDto,
		formerStatus: VisitStatus,
		user: SessionUserEntity
	) {
		const space = await this.spacesService.findById(visit.spaceId);
		if (visit.status === VisitStatus.APPROVED) {
			await this.notificationsService.onApproveVisitRequest(visit, space);

			// Log event
			this.eventsService.insertEvents([
				{
					id: EventsHelper.getEventId(request),
					type: LogEventType.VISIT_REQUEST_APPROVED,
					source: request.path,
					subject: user.getId(),
					time: new Date().toISOString(),
					data: {
						visitor_space_request_id: visit.id,
						visitor_space_id: visit.spaceId,
						user_group_name: user.getGroupName(),
						user_group_id: user.getGroupId(),
					},
				},
			]);
		} else if (visit.status === VisitStatus.DENIED) {
			await this.notificationsService.onDenyVisitRequest(visit, space, updateVisitDto.note);

			// Log event
			this.eventsService.insertEvents([
				{
					id: EventsHelper.getEventId(request),
					type:
						formerStatus === VisitStatus.APPROVED
							? LogEventType.VISIT_REQUEST_REVOKED
							: LogEventType.VISIT_REQUEST_DENIED,
					source: request.path,
					subject: user.getId(),
					time: new Date().toISOString(),
					data: {
						visitor_space_request_id: visit.id,
						visitor_space_id: visit.spaceId,
						user_group_name: user.getGroupName(),
						user_group_id: user.getGroupId(),
					},
				},
			]);
		} else if (updateVisitDto.status === VisitStatus.CANCELLED_BY_VISITOR) {
			const recipients = await this.spacesService.getMaintainerProfiles(visit.spaceId);

			await this.notificationsService.onCancelVisitRequest(visit, recipients, user);

			// Log event
			this.eventsService.insertEvents([
				{
					id: EventsHelper.getEventId(request),
					type: LogEventType.VISIT_REQUEST_CANCELLED_BY_VISITOR,
					source: request.path,
					subject: user.getId(),
					time: new Date().toISOString(),
					data: {
						visitor_space_request_id: visit.id,
						visitor_space_id: visit.spaceId,
						user_group_name: user.getGroupName(),
						user_group_id: user.getGroupId(),
					},
				},
			]);
		}
	}

	/**
	 * When a visit status changed, check if notifications should be sent
	 */
	protected async postProcessVisitTimes(updateVisitDto: UpdateVisitDto, visit: Visit) {
		const typesToDelete = [];
		if (updateVisitDto.startAt && isFuture(new Date(updateVisitDto.startAt))) {
			typesToDelete.push(NotificationType.ACCESS_PERIOD_VISITOR_SPACE_STARTED);
		}

		if (updateVisitDto.endAt && isFuture(new Date(updateVisitDto.endAt))) {
			typesToDelete.push(
				NotificationType.ACCESS_PERIOD_VISITOR_SPACE_ENDED,
				NotificationType.ACCESS_PERIOD_VISITOR_SPACE_END_WARNING
			);
		}

		await this.notificationsService.delete(visit.id, {
			types: typesToDelete,
		});
	}
}
