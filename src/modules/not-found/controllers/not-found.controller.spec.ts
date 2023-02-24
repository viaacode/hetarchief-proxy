import { TranslationsService } from '@meemoo/admin-core-api';
import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundController } from './not-found.controller';

import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';

describe('NotFoundController', () => {
	let notFoundController: NotFoundController;
	const OLD_ENV = process.env;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotFoundController],
			imports: [],
			providers: [
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		}).compile();

		notFoundController = module.get<NotFoundController>(NotFoundController);
		process.env = { ...OLD_ENV }; // Make a copy
	});

	afterAll(() => {
		process.env = OLD_ENV; // Restore old environment
	});

	describe('getNotFoundPage', () => {
		it('should return the not found page html code', async () => {
			process.env.CLIENT_HOST = 'http://localhost:3200';
			const notFound = await notFoundController.getNotFoundPage(undefined, undefined);
			expect(notFound).toContain('<title>');
			expect(notFound).toContain(process.env.CLIENT_HOST);
		});
	});
});
