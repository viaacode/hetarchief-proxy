import { type Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

export class EventsHelper {
	public static getEventId(request: Request): string {
		return (request.headers['x-viaa-request-id'] as string) || uuidv4();
	}
}
