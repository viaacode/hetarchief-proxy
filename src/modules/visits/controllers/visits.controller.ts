import {
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

import {
	CreateVisitDto,
	UpdateVisitDto,
	UpdateVisitStatusDto,
	VisitsQueryDto,
} from '../dto/visits.dto';
import { VisitsService } from '../services/visits.service';
import { Visit } from '../types';

import { SessionHelper } from '~shared/auth/session-helper';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@ApiTags('Visits')
@Controller('visits')
@UseGuards(LoggedInGuard)
export class VisitsController {
	private logger: Logger = new Logger(VisitsController.name, { timestamp: true });

	constructor(private visitsService: VisitsService) {}

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
		@Session() session: Record<string, any>
	): Promise<Visit> {
		const visit = await this.visitsService.create(
			createVisitDto,
			SessionHelper.getArchiefUserInfo(session).id
		);
		return visit;
	}

	@Patch(':id')
	public async update(
		@Param('id') id: string,
		@Body() updateVisitDto: UpdateVisitDto,
		@Session() session: Record<string, any>
	): Promise<Visit> {
		const visit = await this.visitsService.update(
			id,
			updateVisitDto,
			SessionHelper.getArchiefUserInfo(session).id
		);
		return visit;
	}

	@Patch(':id/status')
	public async updateStatus(
		@Param('id') id: string,
		@Body() updateStatusDto: UpdateVisitStatusDto
	): Promise<Visit> {
		const visit = await this.visitsService.updateStatus(id, updateStatusDto);
		return visit;
	}
}
