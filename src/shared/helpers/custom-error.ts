import util from 'node:util';

import { InternalServerErrorException } from '@nestjs/common';

export function customError(
	message: string,
	innerException?: any,
	additionalInfo?: Record<string, unknown>
) {
	const stack = innerException?.stack || new Error().stack || '';

	const singleLineLogging = process.env.SINGLE_LINE_LOGGING === 'true';
	const json = util.inspect(
		{
			message,
			innerException: innerException,
			additionalInfo: additionalInfo,
			stack: stack,
		},
		{
			showHidden: false,
			depth: 20,
			colors: !singleLineLogging,
			compact: singleLineLogging,
		}
	);

	return new InternalServerErrorException(json);
}
