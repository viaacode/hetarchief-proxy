import { AdminTranslationsModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { NotFoundController } from '~modules/not-found/controllers/not-found.controller';

@Module({
	controllers: [NotFoundController],
	imports: [AdminTranslationsModule],
})
export class NotFoundModule {}
