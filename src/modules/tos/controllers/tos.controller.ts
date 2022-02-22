import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TosService } from '../services/tos.service';
import { Tos } from '../types';

@ApiTags('Tos')
@Controller('tos')
export class TosController {
	private logger: Logger = new Logger(TosController.name, { timestamp: true });

	constructor(private tosService: TosService) {}

	@Get()
	public async getTos(): Promise<Tos> {
		const tos = await this.tosService.getTosLastUpdatedAt();
		return tos;
	}
}
