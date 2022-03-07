import { NotificationsQueryDto } from '~modules/notifications/dto/notifications.dto';

describe('NotificationsDto', () => {
	describe('NotificationsQueryDto', () => {
		it('should be able to construct a NotificationsQueryDto object', async () => {
			const notificationsQueryDto = new NotificationsQueryDto();
			expect(notificationsQueryDto).toEqual({
				page: 1,
				size: 10,
			});
		});
	});
});
