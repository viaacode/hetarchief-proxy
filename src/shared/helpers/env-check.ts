import { InternalServerErrorException, Logger } from '@nestjs/common';

export function checkRequiredEnvs(requiredEnvs: string[]) {
	if (process.env.NODE_ENV === 'test') {
		return;
	}
	const logger = new Logger('Check Required Envs');

	requiredEnvs.forEach((envVar: string) => {
		if (!process.env[envVar]) {
			logger.error(`Environment variable ${envVar} is required.`);
			throw new InternalServerErrorException(`Environment variable ${envVar} is required.`);
		}
	});
}
