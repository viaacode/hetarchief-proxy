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
	Session,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination/dist/lib/pagination.types';

import { CreateVisitDto, UpdateVisitDto, VisitsQueryDto } from '../dto/visits.dto';
import { VisitsService } from '../services/visits.service';
import { Visit, VisitStatus } from '../types';

import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { SessionHelper } from '~shared/auth/session-helper';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import i18n from '~shared/i18n';

@UseGuards(LoggedInGuard)
@ApiTags('Visits')
@Controller('visits')
export class VisitsController {
	private logger: Logger = new Logger(VisitsController.name, { timestamp: true });

	constructor(
		private visitsService: VisitsService,
		private notificationsService: NotificationsService,
		private spacesService: SpacesService
	) {}

	@Get()
	@ApiOperation({
		description:
			'Get Visits endpoint for Meemoo Admins and CP Admins. Visitors should use the /personal endpoint. ',
	})
	public async getVisits(
		@Query() queryDto: VisitsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Visit>> {
		if (user.has(Permission.CAN_READ_ALL_VISIT_REQUESTS)) {
			const visits = await this.visitsService.findAll(queryDto, {});
			return visits;
		} else if (user.has(Permission.CAN_READ_CP_VISIT_REQUESTS)) {
			const cpSpace = await this.spacesService.findSpaceByCpUserId(user.getId());

			if (!cpSpace) {
				throw new NotFoundException(
					i18n.t('The current user does not seem to be linked to a cp space.')
				);
			}

			const visits = await this.visitsService.findAll(queryDto, { cpSpaceId: cpSpace.id });
			return visits;
		} else {
			throw new UnauthorizedException(
				i18n.t('You do not have the right permissions to call this route')
			);
		}
	}

	@Get('personal')
	@ApiOperation({
		description: 'Get Visits endpoint for Visitors.',
	})
	public async getPersonalVisits(
		@Query() queryDto: VisitsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IPagination<Visit>> {
		if (user.has(Permission.CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS)) {
			const visits = await this.visitsService.findAll(queryDto, {
				userProfileId: user.getId(),
			});
			return visits;
		}

		throw new UnauthorizedException(
			i18n.t('You do not have the right permissions to call this route')
		);
	}

	@Get(':id')
	public async getVisitById(@Param('id') id: string): Promise<Visit> {
		const visit = await this.visitsService.findById(id);
		return visit;
	}

	@Get('active-for-space/:maintainerOrgId')
	public async getActiveVisitForUserAndSpace(
		@Param('maintainerOrgId') maintainerOrgId: string,
		@Session() session: Record<string, any>
	): Promise<Visit | null> {
		const activeVisit = await this.visitsService.getActiveVisitForUserAndSpace(
			SessionHelper.getArchiefUserInfo(session).id,
			maintainerOrgId
		);
		return activeVisit;
	}

	@Post()
	public async createVisit(
		@Body() createVisitDto: CreateVisitDto,
		@Session() session: Record<string, any>
	): Promise<Visit> {
		if (!createVisitDto.acceptedTos) {
			throw new BadRequestException(
				i18n.t(
					'The Terms of Service of the reading room need to be accepted to be able to request a visit.'
				)
			);
		}
		const user = SessionHelper.getArchiefUserInfo(session);

		// Create visit request
		const visit = await this.visitsService.create(createVisitDto, user.id);

		// Send notifications
		const recipients = await this.spacesService.getMaintainerProfiles(visit.spaceId);
		await this.notificationsService.onCreateVisit(visit, recipients, user);

		return visit;
	}

	@Patch(':id')
	public async update(
		@Param('id') id: string,
		@Body() updateVisitDto: UpdateVisitDto,
		@Session() session: Record<string, any>
	): Promise<Visit> {
		const user = SessionHelper.getArchiefUserInfo(session);
		const visit = await this.visitsService.update(id, updateVisitDto, user.id);

		if (updateVisitDto.status) {
			// Status was updated

			// Send notifications
			const space = await this.spacesService.findById(visit.spaceId);
			if (updateVisitDto.status === VisitStatus.APPROVED) {
				await this.notificationsService.onApproveVisitRequest(visit, space);
			} else if (updateVisitDto.status === VisitStatus.DENIED) {
				await this.notificationsService.onDenyVisitRequest(
					visit,
					space,
					updateVisitDto.note
				);
			}
		}

		return visit;
	}
}
