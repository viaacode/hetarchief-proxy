import { Controller, Get, Logger } from '@nestjs/common';

import { SpacesService } from '../services/spaces.service';

@Controller('spaces')
export class SpacesController {
	private logger: Logger = new Logger(SpacesController.name, { timestamp: true });

	constructor(private spacesService: SpacesService) {}

	@Get()
	public async getSpaces(): Promise<any> {
		// TODO type
		// TODO real implementation
		return this.spacesService.findAll();
	}
}
