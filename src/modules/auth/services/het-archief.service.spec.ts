import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { HetArchiefService } from './het-archief.service';

describe('HetArchiefService', () => {
	let hetArchiefService: HetArchiefService;
	let configService: ConfigService;

	beforeEach(async () => {
		const archiefServiceFactory = {
			provide: HetArchiefService,
			useFactory: async (configService: ConfigService) => {
				const archiefService = new HetArchiefService(configService);
				await archiefService.initialize();
				return archiefService;
			},
			inject: [ConfigService],
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [archiefServiceFactory, ConfigService],
		}).compile();

		hetArchiefService = module.get<HetArchiefService>(HetArchiefService);
		configService = module.get<ConfigService>(ConfigService);
	});

	it('services should be defined', () => {
		expect(hetArchiefService).toBeDefined();
		expect(configService).toBeDefined();
	});
});
