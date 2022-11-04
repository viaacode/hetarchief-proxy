import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { MeemooService } from './meemoo.service';

import { TestingLogger } from '~shared/logging/test-logger';

describe('MeemooService', () => {
	let meemooService: MeemooService;
	let configService: ConfigService<Configuration>;

	beforeEach(async () => {
		const archiefServiceFactory = {
			provide: MeemooService,
			useFactory: async (configService: ConfigService<Configuration>) => {
				const archiefService = new MeemooService(configService);
				await archiefService.initialize();
				return archiefService;
			},
			inject: [ConfigService],
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [archiefServiceFactory, ConfigService],
		})
			.setLogger(new TestingLogger())
			.compile();

		meemooService = module.get<MeemooService>(MeemooService);
		configService = module.get<ConfigService<Configuration>>(ConfigService);
	});

	it('services should be defined', () => {
		expect(meemooService).toBeDefined();
		expect(configService).toBeDefined();
	});

	// rest of the test coverage is common with HetArchiefService, both extend SamlService.
});
