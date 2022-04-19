import { Request } from 'express';

import { EventsHelper } from './events';

describe('getEventId', () => {
	it('should return a uuid when no header was set', () => {
		const id = EventsHelper.getEventId({ headers: {} } as unknown as Request);
		expect(id.length).toEqual(36);
	});

	it('should return the correlation header if set', () => {
		const id = EventsHelper.getEventId({
			headers: {
				'x-viaa-request-id': 'the-correlation-id',
			},
		} as unknown as Request);
		expect(id).toEqual('the-correlation-id');
	});
});
