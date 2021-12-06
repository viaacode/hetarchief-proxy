import { ConfigService as NestConfigService } from '@nestjs/config';

export interface Configuration {
	port: number;
}

export type ConfigService = NestConfigService<Configuration>;
