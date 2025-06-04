import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// biome-ignore lint/style/useImportType: We need the full class for dependency injection to work with nestJS
import { StatusService } from '../services/status.service';

@ApiTags('Status')
@Controller()
export class StatusController {
	constructor(private readonly statusService: StatusService) {}

	@ApiOperation({
		description: 'Get the status of the service',
	})
	@Get()
	getStatusRoot(): Record<string, string> {
		return this.statusService.getStatus();
	}

	@ApiOperation({
		description: 'Get the status of the service',
	})
	@Get('status')
	getStatus(): Record<string, string> {
		return this.statusService.getStatus();
	}

	@ApiOperation({
		description: 'Get the status of the service including the databases',
	})
	@Get('status-full')
	getStatusFull(): Promise<Record<string, string>> {
		return this.statusService.getStatusFull();
	}
}
