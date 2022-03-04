import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Logger,
	Param,
	Patch,
	Post,
	Query,
	Session,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination/dist/lib/pagination.types';
import { format } from 'date-fns';

import { CreateVisitDto, UpdateVisitDto, VisitsQueryDto } from '../dto/visits.dto';
import { VisitsService } from '../services/visits.service';
import { Visit, VisitStatus } from '../types';

import { NotificationsService } from '~modules/notifications/services/notifications.service';
import { NotificationStatus, NotificationType } from '~modules/notifications/types';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionHelper } from '~shared/auth/session-helper';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';
import i18n from '~shared/i18n';

@ApiTags('Visits')
@Controller('visits')
@UseGuards(LoggedInGuard)
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
		const user = SessionHelper.getArchiefUserInfo(session);

		// Create visit request
		const visit = await this.visitsService.create(createVisitDto, user.id);

		// Send notifications
		const recipientIds = await this.spacesService.getMaintainerProfileIds(visit.spaceId);
		if (recipientIds.length) {
			await this.notificationsService.createForMultipleRecipients(
				{
					title: i18n.t('Er is aan aanvraag om je leeszaal te bezoeken'),
					description: i18n.t('{{name}} wil je leeszaal bezoeken', {
						name: user.firstName + ' ' + user.lastName,
					}),
					visit_id: visit.id,
					type: NotificationType.NEW_VISIT_REQUEST,
					status: NotificationStatus.UNREAD,
				},
				recipientIds
			);
		}

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
				await this.notificationsService.create({
					title: i18n.t('Je aanvraag voor leeszaal {{name}} is goedgekeurd', {
						name: space.name,
					}),
					description: i18n.t(
						'Je aanvraag voor leeszaal {{name}} is goedgekeurd. Je zal toegang hebben van {{startDate}} tot {{endDate}}',
						{
							name: space.name,
							startDate: format(new Date(visit.startAt), 'dd/MM/yyyy HH:mm'),
							endDate: format(new Date(visit.endAt), 'dd/MM/yyyy HH:mm'),
						}
					),
					visit_id: visit.id,
					type: NotificationType.VISIT_REQUEST_APPROVED,
					status: NotificationStatus.UNREAD,
					recipient: user.id,
				});
			} else if (updateVisitDto.status === VisitStatus.DENIED) {
				await this.notificationsService.create({
					title: i18n.t('Je aanvraag voor leeszaal {{name}} is afgekeurd', {
						name: space.name,
					}),
					description: i18n.t('Reden: {{reason}}', {
						reason: updateVisitDto.note || i18n.t('Er werd geen reden opgegeven'),
					}),
					visit_id: visit.id,
					type: NotificationType.VISIT_REQUEST_DENIED,
					status: NotificationStatus.UNREAD,
					recipient: user.id,
				});
			}
		}

		return visit;
	}
}
