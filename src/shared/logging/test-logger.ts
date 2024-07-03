/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */

import { type LoggerService } from '@nestjs/common';

export class TestingLogger implements LoggerService {
	/**
	 * Write a 'log' level log.
	 */
	log(message: any, ...optionalParams: any[]) {}

	/**
	 * Write an 'error' level log.
	 */
	error(message: any, ...optionalParams: any[]) {}

	/**
	 * Write a 'warn' level log.
	 */
	warn(message: any, ...optionalParams: any[]) {}

	/**
	 * Write a 'debug' level log.
	 */
	debug?(message: any, ...optionalParams: any[]) {}

	/**
	 * Write a 'verbose' level log.
	 */
	verbose?(message: any, ...optionalParams: any[]) {}
}
