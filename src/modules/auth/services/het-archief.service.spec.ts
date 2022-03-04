import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import got from 'got';

import { HetArchiefService } from './het-archief.service';

import { IDP_XML_RESPONSE } from '~modules/collections/services/__mocks__/idpXmlResponse';

describe('HetArchiefService', () => {
	let hetArchiefService: HetArchiefService;
	let configService: ConfigService;

	beforeEach(async () => {
		jest.spyOn(got, 'post').mockResolvedValue(IDP_XML_RESPONSE);

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
