import { randomUUID } from 'node:crypto';
import type { Request } from 'express';

export class EventsHelper {
	public static getEventId(request: Request): string {
		return (request?.headers?.['x-viaa-request-id'] as string) || randomUUID();
	}
}
