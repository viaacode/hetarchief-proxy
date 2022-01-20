import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { MeemooService } from './meemoo.service';

describe('MeemooService', () => {
	let meemooService: MeemooService;
	let configService: ConfigService;

	beforeEach(async () => {
		const archiefServiceFactory = {
			provide: MeemooService,
			useFactory: async (configService: ConfigService) => {
				const archiefService = new MeemooService(configService);
				await archiefService.initialize();
				return archiefService;
			},
			inject: [ConfigService],
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [archiefServiceFactory, ConfigService],
		}).compile();

		meemooService = module.get<MeemooService>(MeemooService);
		configService = module.get<ConfigService>(ConfigService);
	});

	it('services should be defined', () => {
		expect(meemooService).toBeDefined();
		expect(configService).toBeDefined();
	});

	// rest of the test coverage is common with HetArchiefService, both extend SamlService.
});
