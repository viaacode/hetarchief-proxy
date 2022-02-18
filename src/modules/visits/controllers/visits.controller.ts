import { Body, Controller, Get, Logger, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination/dist/lib/pagination.types';

import { CreateVisitDto, UpdateVisitStatusDto, VisitsQueryDto } from '../dto/visits.dto';
import { VisitsService } from '../services/visits.service';
import { Visit } from '../types';

@ApiTags('Visits')
@Controller('visits')
export class VisitsController {
	private logger: Logger = new Logger(VisitsController.name, { timestamp: true });

	constructor(private visitsService: VisitsService) {}

	@Get()
	public async getVisits(@Query() queryDto: VisitsQueryDto): Promise<IPagination<Visit>> {
		const visits = this.visitsService.findAll(queryDto);
		return visits;
	}

	@Get(':id')
	public async getVisitById(@Param('id') id: string): Promise<Visit> {
		const visit = await this.visitsService.findById(id);
		return visit;
	}

	@Post()
	public async createVisit(@Body() createVisitDto: CreateVisitDto): Promise<Visit> {
		const visit = await this.visitsService.create(createVisitDto);
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
