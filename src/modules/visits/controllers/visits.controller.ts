import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Logger,
	Param,
	Post,
	Put,
	Query,
	Session,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination/dist/lib/pagination.types';

import {
	CreateVisitDto,
	UpdateVisitDto,
	UpdateVisitStatusDto,
	VisitsQueryDto,
} from '../dto/visits.dto';
import { VisitsService } from '../services/visits.service';
import { Visit } from '../types';

import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { NotificationStatus, NotificationType } from '~modules/notifications/types';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionHelper } from '~shared/auth/session-helper';
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
	public async getVisits(@Query() queryDto: VisitsQueryDto): Promise<IPagination<Visit>> {
		const visits = await this.visitsService.findAll(queryDto);
		return visits;
	}

	@Get(':id')
	public async getVisitById(@Param('id') id: string): Promise<Visit> {
		const visit = await this.visitsService.findById(id);
		return visit;
	}

	@Post()
	public async createVisit(
		@Body() createVisitDto: CreateVisitDto,
		@Session() session
	): Promise<Visit> {
		if (!createVisitDto.acceptedTos) {
			throw new BadRequestException(
				i18n.t(
					'The Terms of Service of the reading room need to be accepted to be able to request a visit.'
				)
			);
		}
		// Create visit request
		const visit = await this.visitsService.create(createVisitDto);

		// Send notifications
		const user = SessionHelper.getArchiefUserInfo(session);
		const recipientIds = await this.spacesService.getMaintainerProfileIds(visit.spaceId);
		if (recipientIds.length) {
			await this.notificationsService.createForMultipleRecipients(
				{
					title: i18n.t('Er is aan aanvraag om je leeszaal te bezoeken'),
					description: i18n.t('{{name}} wil je leeszaal bezoeken', {
						name: user.firstName + ' ' + user.lastName,
					}),
					visit_id: visit.id,
					notification_type: NotificationType.NEW_VISIT_REQUEST,
					status: NotificationStatus.UNREAD,
				},
				recipientIds
			);
		}

		return visit;
	}

	@Put(':id')
	public async update(
		@Param('id') id: string,
		@Body() updateVisitDto: UpdateVisitDto
	): Promise<Visit> {
		const visit = await this.visitsService.update(id, updateVisitDto);
		return visit;
	}

	@Put(':id/status')
	public async updateStatus(
		@Param('id') id: string,
		@Body() updateStatusDto: UpdateVisitStatusDto
	): Promise<Visit> {
		const visit = await this.visitsService.updateStatus(id, updateStatusDto);
		return visit;
	}
}
