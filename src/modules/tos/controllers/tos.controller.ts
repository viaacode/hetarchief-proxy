import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { hoursToSeconds } from 'date-fns';
import { TosService } from '../services/tos.service';
import type { Tos } from '../types';

const CACHE_KEY_GET_TOS_LAST_UPDATED = 'CACHE_KEY_GET_TOS_LAST_UPDATED';

@ApiTags('Tos')
@Controller('tos')
export class TosController {
	private logger: Logger = new Logger(TosController.name, { timestamp: true });

	constructor(
		private tosService: TosService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	@Get()
	public async getTos(): Promise<Tos> {
		return await this.cacheManager.wrap(
			CACHE_KEY_GET_TOS_LAST_UPDATED,
			() => this.tosService.getTosLastUpdatedAt(),
			// cache for 1 day
			hoursToSeconds(24)
		);
	}
}
