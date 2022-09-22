import { Module } from '@nestjs/common';

import { NotFoundController } from '~modules/not-found/controllers/not-found.controller';

@Module({
	controllers: [NotFoundController],
})
export class NotFoundModule {}
