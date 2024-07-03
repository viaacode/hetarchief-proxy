import { type ExecutionContext } from '@nestjs/common';

import { LoggedInGuard } from './logged-in.guard';

const mockExecutionContextWithSession = (session) =>
	({
		switchToHttp: jest.fn().mockReturnValue({
			getRequest: jest.fn().mockReturnValue({
				session,
			}),
		}),
	}) as unknown as ExecutionContext;

describe('LoggedInGuard', () => {
	it('Should allow access when user is logged in', async () => {
		const session = {
			archiefUserInfo: {
				id: 'test-user-id',
			},
		};
		const canActivate = new LoggedInGuard().canActivate(
			mockExecutionContextWithSession(session)
		);
		expect(canActivate).toBe(true);
	});

	it('Should not allow access when no user is logged in', async () => {
		expect(() =>
			new LoggedInGuard().canActivate(mockExecutionContextWithSession({}))
		).toThrowError();
	});
});
