import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import got from 'got';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Configuration } from '~config';
import { IDP_XML_RESPONSE } from '~modules/folders/services/__mocks__/idpXmlResponse';
import { Locale } from '~shared/types/types';
import { HetArchiefService } from './het-archief.service';

describe('HetArchiefService', () => {
	let hetArchiefService: HetArchiefService;
	let configService: ConfigService<Configuration>;

	beforeEach(async () => {
		vi.spyOn(got, 'post').mockResolvedValue(IDP_XML_RESPONSE);

		const archiefServiceFactory = {
			provide: HetArchiefService,
			useFactory: async (configService: ConfigService<Configuration>) => {
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
		configService = module.get<ConfigService<Configuration>>(ConfigService);
	});

	it('services should be defined', () => {
		expect(hetArchiefService).toBeDefined();
		expect(configService).toBeDefined();
	});

	it('creates a login url to the idp', async () => {
		const loginUrl = await hetArchiefService.createLoginRequestUrl(
			'http://localhost:3200/nl',
			Locale.Nl
		);

		expect(loginUrl).toContain('SAMLRequest=');
	});

	it('retries loading the idp metadata when it failed on startup', async () => {
		vi.mocked(got.post).mockClear();
		vi.spyOn(got, 'post')
			.mockRejectedValueOnce(new Error('connect ECONNREFUSED'))
			.mockResolvedValueOnce(IDP_XML_RESPONSE);
		const service = new HetArchiefService(configService);
		await service.initialize();

		const loginUrl = await service.createLoginRequestUrl('http://localhost:3200/nl', Locale.Nl);

		expect(loginUrl).toContain('SAMLRequest=');
		expect(got.post).toHaveBeenCalledTimes(2);
	});

	it('throws a clear error when the idp metadata still cannot be loaded', async () => {
		vi.spyOn(got, 'post').mockRejectedValue(new Error('connect ECONNREFUSED'));
		const service = new HetArchiefService(configService);
		await service.initialize();

		await expect(
			service.createLoginRequestUrl('http://localhost:3200/nl', Locale.Nl)
		).rejects.toThrow('SAML is not initialized');
	});
});
