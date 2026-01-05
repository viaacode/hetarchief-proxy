import { randomUUID } from 'node:crypto';

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
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Pagination } from '@studiohyperdrive/pagination';
import type { IPagination } from '@studiohyperdrive/pagination/dist/lib/pagination.types';
import { isFuture } from 'date-fns';
import type { Request } from 'express';
import { uniqBy } from 'lodash';

import { CreateVisitDto, UpdateVisitDto, VisitsQueryDto } from '../dto/visits.dto';

import { VisitsService } from '../services/visits.service';
import {
	type AccessStatus,
	VisitAccessType,
	type VisitRequest,
	type VisitSpaceCount,
	VisitStatus,
} from '../types';

import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';

import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { NotificationType } from '~modules/notifications/types';

import { PermissionName } from '@viaa/avo2-types';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import type { VisitorSpace } from '~modules/spaces/spaces.types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName } from '~modules/users/types';
import { getFakeVisitorRequest } from '~modules/visits/controllers/visits.controller.helpers';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { EventsHelper } from '~shared/helpers/events';
import { VisitorSpaceStatus } from '~shared/types/types';

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
	@RequireAnyPermissions(
		PermissionName.MANAGE_ALL_VISIT_REQUESTS,
		PermissionName.MANAGE_CP_VISIT_REQUESTS
	)
	public async getVisits(
		@Query() queryDto: VisitsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<VisitRequest>> {
		if (user.has(PermissionName.MANAGE_ALL_VISIT_REQUESTS)) {
			return await this.visitsService.findAll(queryDto, {
				...(queryDto?.visitorSpaceSlug ? { visitorSpaceSlug: queryDto.visitorSpaceSlug } : {}),
				...(queryDto?.requesterId ? { userProfileId: queryDto.requesterId } : {}),
			});
		}
		// CP_VISIT_REQUESTS (user has any of these permissions as enforced by guard)
		const cpSpace = await this.spacesService.findSpaceByOrganisationId(user.getOrganisationId());

		if (!cpSpace) {
			const userLanguage = user.getLanguage();
			throw new NotFoundException(
				this.translationsService.tText(
					'modules/visits/controllers/visits___the-current-user-does-not-seem-to-be-linked-to-a-cp-space',
					null,
					userLanguage
				)
			);
		}

		return await this.visitsService.findAll(queryDto, {
			visitorSpaceSlug: cpSpace.slug,
			...(queryDto?.requesterId ? { userProfileId: queryDto.requesterId } : {}),
		});
	}

	@Get('personal')
	@ApiOperation({
		description: 'Get Visits endpoint for Visitors.',
	})
	public async getPersonalVisits(
		@Query() queryDto: VisitsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<VisitRequest>> {
		if (user.getGroupName() === GroupName.KIOSK_VISITOR) {
			const visitorSpace = await this.spacesService.findSpaceByOrganisationId(
				user.getOrganisationId()
			);
			// Kiosk user only has access to the visitor space of the organisation to which they are linked
			const visitorRequests = [getFakeVisitorRequest(user, visitorSpace)];

			return Pagination<VisitRequest>({
				items: visitorRequests,
				page: 1,
				size: 1,
				total: 1,
			});
		}
		if (user.getGroupName() === GroupName.MEEMOO_ADMIN) {
			const visitorSpaces = await this.spacesService.findAll(
				{
					// Do not include inactive visitor spaces otherwise they show up in the visitor spaces dropdown and cause errors:
					// https://meemoo.atlassian.net/browse/ARC-2576?focusedCommentId=53662
					status: [VisitorSpaceStatus.Active, VisitorSpaceStatus.Requested],
					page: 1,
					size: 100,
				},
				user?.getId()
			);

			const visits = visitorSpaces.items.map((visitorSpace: VisitorSpace) => {
				return getFakeVisitorRequest(user, visitorSpace);
			});

			return Pagination<VisitRequest>({
				items: visits,
				page: visitorSpaces.page,
				size: visitorSpaces.size,
				total: visitorSpaces.total,
			});
		}

		const visitRequests = await this.visitsService.findAll(queryDto, {
			userProfileId: user?.getId(),
			// a visitor can see visit requests that have been approved for visitor spaces with status requested and active
			// https://meemoo.atlassian.net/browse/ARC-1949
			visitorSpaceStatuses: [VisitorSpaceStatus.Requested, VisitorSpaceStatus.Active],
		});

		if (user.getGroupName() === GroupName.CP_ADMIN) {
			const visitorSpace = await this.spacesService.findSpaceByOrganisationId(
				user.getOrganisationId()
			);
			visitRequests.items = uniqBy(
				[...visitRequests.items, getFakeVisitorRequest(user, visitorSpace)],
				(visit) => visit.spaceSlug
			);
		}

		return visitRequests;
	}

	@Get('space/:slug/access-status')
	@ApiOperation({
		description:
			'Get Access status. Returns the highest status (APPROVED>PENDING>..) for a current active visit request. DENIED if no active visit request was found.',
	})
	@RequireAllPermissions(
		PermissionName.READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		PermissionName.MANAGE_ACCOUNT
	)
	public async getAccessStatus(
		@Param('slug') slug: string,
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: AccessStatus }> {
		return { status: await this.visitsService.getAccessStatus(slug, user?.getId()) };
	}

	@Get(':id')
	@RequireAnyPermissions(
		PermissionName.MANAGE_ALL_VISIT_REQUESTS,
		PermissionName.MANAGE_CP_VISIT_REQUESTS,
		PermissionName.READ_PERSONAL_APPROVED_VISIT_REQUESTS
	)
	public async getVisitById(@Param('id', ParseUUIDPipe) id: string): Promise<VisitRequest> {
		return await this.visitsService.findById(id);
	}

	@Get('active-for-space/:visitorSpaceSlug')
	// TODO permissions?
	public async getActiveVisitForUserAndSpace(
		@Param('visitorSpaceSlug') visitorSpaceSlug: string,
		@SessionUser() user: SessionUserEntity
	): Promise<VisitRequest | null> {
		// Check if the user is a CP admin or a Kiosk user for the requested space
		// MEEMOO_ADMIN has access to all the visitor spaces
		if (
			visitorSpaceSlug === user.getVisitorSpaceSlug() ||
			user.getGroupName() === GroupName.MEEMOO_ADMIN
		) {
			const spaceInfo = await this.spacesService.findBySlug(visitorSpaceSlug);

			if (!spaceInfo) {
				const userLanguage = user.getLanguage();
				throw new NotFoundException(
					this.translationsService.tText(
						'modules/visits/controllers/visits___space-with-slug-name-was-not-found',
						{ name: visitorSpaceSlug },
						userLanguage
					)
				);
			}

			// Return fake visit request that is approved and valid forever
			return {
				spaceId: spaceInfo.id,
				id: randomUUID(),
				startAt: new Date(2000, 0, 2).toISOString(),
				endAt: new Date(2100, 0, 2).toISOString(), // Second of january to avoid issues with GMT => 31 dec 2099
				visitorName: user.getFullName(),
				spaceName: spaceInfo.name,
				spaceMaintainerId: spaceInfo.maintainerId,
				status: VisitStatus.APPROVED,
				createdAt: new Date().toISOString(),
				reason: 'permanent access',
				visitorFirstName: user.getFirstName(),
				visitorLastName: user.getLastName(),
				visitorId: user?.getId(),
				visitorMail: user.getMail(),
				visitorLanguage: user.getLanguage(),
				spaceMail: spaceInfo.contactInfo.email,
				spaceTelephone: spaceInfo.contactInfo.telephone,
				updatedById: '',
				updatedByName: '',
				spaceSlug: spaceInfo.slug,
				timeframe: '',
				updatedAt: new Date().toISOString(),
				userProfileId: user?.getId(),
				accessType: VisitAccessType.Full,
				accessibleFolderIds: null,
			};
		}

		// Find visit request that is approved for the current time
		const activeVisit = await this.visitsService.getActiveVisitForUserAndSpace(
			user?.getId(),
			visitorSpaceSlug
		);

		// If no visitor request, check of we need to show a 404 not found or a 403 no access
		if (!activeVisit) {
			// Check if space exists
			const space = await this.spacesService.findBySlug(visitorSpaceSlug);

			const userLanguage = user.getLanguage();
			if (space) {
				if (space.status === VisitorSpaceStatus.Inactive) {
					throw new GoneException(
						this.translationsService.tText(
							'modules/visits/controllers/visits___the-space-with-slug-name-is-no-longer-accepting-visit-requests',
							{ name: visitorSpaceSlug },
							userLanguage
						)
					);
				}

				// User does not have access to existing space
				throw new ForbiddenException(
					this.translationsService.tText(
						'modules/visits/controllers/visits___you-do-not-have-access-to-space-with-slug-name',
						{
							name: visitorSpaceSlug,
						},
						userLanguage
					)
				);
			}
			// Space does not exist
			throw new NotFoundException(
				this.translationsService.tText(
					'modules/visits/controllers/visits___space-with-slug-name-was-not-found',
					{ name: visitorSpaceSlug },
					userLanguage
				)
			);
		}

		return activeVisit;
	}

	@Get('pending-for-space/:slug')
	// TODO permissions?
	public async getPendingVisitCountForUserBySlug(
		@Param('slug') slug: string,
		@SessionUser() user: SessionUserEntity
	): Promise<VisitSpaceCount> {
		const count = await this.visitsService.getPendingVisitCountForUserBySlug(user?.getId(), slug);
		return count;
	}

	@Post()
	@ApiOperation({
		description: 'Create a Visit request. Requires the CREATE_VISIT_REQUEST permission.',
	})
	@RequireAllPermissions(PermissionName.CREATE_VISIT_REQUEST)
	public async createVisitRequest(
		@Req() request: Request,
		@Body() createVisitDto: CreateVisitDto,
		@SessionUser() user: SessionUserEntity
	): Promise<VisitRequest> {
		const userLanguage = user.getLanguage();
		if (!createVisitDto.acceptedTos) {
			throw new BadRequestException(
				this.translationsService.tText(
					'modules/visits/controllers/visits___the-terms-of-service-of-the-visitor-space-need-to-be-accepted-to-be-able-to-request-a-visit',
					null,
					userLanguage
				)
			);
		}

		// Resolve visitor space slug to visitor space id
		const visitorSpace = await this.spacesService.findBySlug(createVisitDto.visitorSpaceSlug);

		if (!visitorSpace) {
			throw new BadRequestException(
				this.translationsService.tText(
					'modules/visits/controllers/visits___the-space-with-slug-name-was-not-found',
					{
						name: createVisitDto.visitorSpaceSlug,
					},
					userLanguage
				)
			);
		}

		// Create visit request
		const visit = await this.visitsService.create(
			{
				...createVisitDto,
				visitorSpaceId: visitorSpace.id,
			},
			user?.getId()
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
				subject: user?.getId(),
				time: new Date().toISOString(),
				data: {
					visitor_space_id: visitorSpace.id,
					user_group_name: user.getGroupName(),
					user_group_id: user.getGroupId(),
					or_id: visit.spaceMaintainerId,
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
		PermissionName.MANAGE_ALL_VISIT_REQUESTS,
		PermissionName.MANAGE_CP_VISIT_REQUESTS,
		PermissionName.CANCEL_OWN_VISIT_REQUEST
	)
	public async update(
		@Req() request: Request,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateVisitDto: UpdateVisitDto,
		@SessionUser() user: SessionUserEntity
	): Promise<VisitRequest> {
		let updateVisitDtoValidated = updateVisitDto;
		const originalVisit = await this.visitsService.findById(id);

		if (
			user.has(PermissionName.CANCEL_OWN_VISIT_REQUEST) &&
			user.hasNot(PermissionName.MANAGE_ALL_VISIT_REQUESTS) &&
			user.hasNot(PermissionName.MANAGE_CP_VISIT_REQUESTS)
		) {
			if (
				originalVisit.userProfileId !== user?.getId() ||
				updateVisitDtoValidated.status !== VisitStatus.CANCELLED_BY_VISITOR
			) {
				const userLanguage = user.getLanguage();
				throw new ForbiddenException(
					this.translationsService.tText(
						'modules/visits/controllers/visits___you-do-not-have-the-right-permissions-to-call-this-route',
						undefined,
						userLanguage
					)
				);
			}

			// user can only update status, not anything else
			updateVisitDtoValidated = {
				status: VisitStatus.CANCELLED_BY_VISITOR,
			};
		}

		// update the Visit
		const visit = await this.visitsService.update(id, updateVisitDtoValidated, user?.getId());

		// Post-processing for notifications
		if (updateVisitDtoValidated.status) {
			await this.postProcessVisitStatusChange(
				request,
				visit,
				updateVisitDtoValidated,
				originalVisit.status,
				user
			);
		}
		if (updateVisitDtoValidated.startAt || updateVisitDtoValidated.endAt) {
			await this.postProcessVisitTimes(updateVisitDtoValidated, visit);
		}

		return visit;
	}

	/**
	 * When the a visit status changed, check if notifications should be sent
	 */
	protected async postProcessVisitStatusChange(
		request: Request,
		visit: VisitRequest,
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
					subject: user?.getId(),
					time: new Date().toISOString(),
					data: {
						visitor_space_request_id: visit.id,
						visitor_space_id: visit.spaceId,
						user_group_name: user.getGroupName(),
						user_group_id: user.getGroupId(),
						or_id: visit.spaceMaintainerId,
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
					subject: user?.getId(),
					time: new Date().toISOString(),
					data: {
						visitor_space_request_id: visit.id,
						visitor_space_id: visit.spaceId,
						user_group_name: user.getGroupName(),
						user_group_id: user.getGroupId(),
						or_id: visit.spaceMaintainerId,
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
					subject: user?.getId(),
					time: new Date().toISOString(),
					data: {
						visitor_space_request_id: visit.id,
						visitor_space_id: visit.spaceId,
						user_group_name: user.getGroupName(),
						user_group_id: user.getGroupId(),
						or_id: visit.spaceMaintainerId,
					},
				},
			]);
		}
	}

	/**
	 * When a visit status changed, check if notifications should be sent
	 */
	protected async postProcessVisitTimes(updateVisitDto: UpdateVisitDto, visit: VisitRequest) {
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
