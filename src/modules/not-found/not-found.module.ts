import { Module } from '@nestjs/common';

import { NotFoundController } from '~modules/not-found/controllers/not-found.controller';
import { TranslationsModule } from '~modules/translations';

@Module({
	controllers: [NotFoundController],
	imports: [TranslationsModule],
})
export class NotFoundModule {}
