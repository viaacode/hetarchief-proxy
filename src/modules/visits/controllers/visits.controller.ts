import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Logger,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination/dist/lib/pagination.types';
import { Request } from 'express';

import { CreateVisitDto, UpdateVisitDto, VisitsQueryDto } from '../dto/visits.dto';
import { VisitsService } from '../services/visits.service';
import { Visit, VisitSpaceCount, VisitStatus } from '../types';

import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { RequirePermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import { EventsHelper } from '~shared/helpers/events';
import i18n from '~shared/i18n';

@UseGuards(LoggedInGuard)
@ApiTags('Visits')
@Controller('visits')
export class VisitsController {
	private logger: Logger = new Logger(VisitsController.name, { timestamp: true });

	constructor(
		private visitsService: VisitsService,
		private notificationsService: NotificationsService,
		private spacesService: SpacesService,
		private eventsService: EventsService
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
			const visits = await this.visitsService.findAll(queryDto, {});
			return visits;
		}
		// CP_VISIT_REQUESTS (user has any of these permissions as enforced by guard)
		const cpSpace = await this.spacesService.findSpaceByCpUserId(user.getId());

		if (!cpSpace) {
			throw new NotFoundException(
				i18n.t('The current user does not seem to be linked to a cp space.')
			);
		}

		const visits = await this.visitsService.findAll(queryDto, { cpSpaceId: cpSpace.id });
		return visits;
	}

	@Get('personal')
	@ApiOperation({
		description: 'Get Visits endpoint for Visitors.',
	})
	@RequirePermissions(Permission.READ_PERSONAL_APPROVED_VISIT_REQUESTS)
	public async getPersonalVisits(
		@Query() queryDto: VisitsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Visit>> {
		const visits = await this.visitsService.findAll(queryDto, {
			userProfileId: user.getId(),
		});
		return visits;
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

	@Get('active-for-space/:maintainerOrgId')
	// TODO permissions?
	public async getActiveVisitForUserAndSpace(
		@Param('maintainerOrgId') maintainerOrgId: string,
		@SessionUser() user: SessionUserEntity
	): Promise<Visit | null> {
		const activeVisit = await this.visitsService.getActiveVisitForUserAndSpace(
			user.getId(),
			maintainerOrgId
		);
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
	@RequirePermissions(Permission.CREATE_VISIT_REQUEST)
	public async createVisit(
		@Req() request: Request,
		@Body() createVisitDto: CreateVisitDto,
		@SessionUser() user: SessionUserEntity
	): Promise<Visit> {
		if (!createVisitDto.acceptedTos) {
			throw new BadRequestException(
				i18n.t(
					'The Terms of Service of the reading room need to be accepted to be able to request a visit.'
				)
			);
		}

		// Create visit request
		const visit = await this.visitsService.create(createVisitDto, user.getId());

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
			},
		]);

		return visit;
	}

	@Patch(':id')
	@ApiOperation({
		description: 'Update a Visit request.',
	})
	@RequireAnyPermissions(Permission.UPDATE_VISIT_REQUEST, Permission.CANCEL_OWN_VISIT_REQUEST)
	public async update(
		@Req() request: Request,
		@Param('id') id: string,
		@Body() updateVisitDto: UpdateVisitDto,
		@SessionUser() user: SessionUserEntity
	): Promise<Visit> {
		const originalVisit = await this.visitsService.findById(id);

		if (
			user.has(Permission.CANCEL_OWN_VISIT_REQUEST) &&
			user.hasNot(Permission.UPDATE_VISIT_REQUEST)
		) {
			if (
				originalVisit.userProfileId !== user.getId() ||
				updateVisitDto.status !== VisitStatus.CANCELLED_BY_VISITOR
			) {
				throw new UnauthorizedException(
					i18n.t('You do not have the right permissions to call this route')
				);
			}

			// user can only update status, not anything else
			updateVisitDto = {
				status: VisitStatus.CANCELLED_BY_VISITOR,
			};
		}
		const visit = await this.visitsService.update(id, updateVisitDto, user.getId());

		if (updateVisitDto.status) {
			// Status was updated

			// Send notifications
			const space = await this.spacesService.findById(visit.spaceId);
			if (updateVisitDto.status === VisitStatus.APPROVED) {
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
							visitor_space_request_id: id,
						},
					},
				]);
			} else if (updateVisitDto.status === VisitStatus.DENIED) {
				await this.notificationsService.onDenyVisitRequest(
					visit,
					space,
					updateVisitDto.note
				);

				// Log event
				this.eventsService.insertEvents([
					{
						id: EventsHelper.getEventId(request),
						type:
							originalVisit.status === VisitStatus.APPROVED
								? LogEventType.VISIT_REQUEST_REVOKED
								: LogEventType.VISIT_REQUEST_DENIED,
						source: request.path,
						subject: user.getId(),
						time: new Date().toISOString(),
						data: {
							visitor_space_request_id: id,
						},
					},
				]);
			} else if (updateVisitDto.status === VisitStatus.CANCELLED_BY_VISITOR) {
				// Log event
				this.eventsService.insertEvents([
					{
						id: EventsHelper.getEventId(request),
						type: LogEventType.VISIT_REQUEST_CANCELLED_BY_VISITOR,
						source: request.path,
						subject: user.getId(),
						time: new Date().toISOString(),
						data: {
							visitor_space_request_id: id,
						},
					},
				]);
			}
		}

		return visit;
	}
}
