import type { ExecutionContext } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { LoggedInGuard } from './logged-in.guard';

const mockExecutionContextWithSession = (session) =>
	({
		switchToHttp: vi.fn().mockReturnValue({
			getRequest: vi.fn().mockReturnValue({
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
		const canActivate = new LoggedInGuard().canActivate(mockExecutionContextWithSession(session));
		expect(canActivate).toBe(true);
	});

	it('Should not allow access when no user is logged in', async () => {
		expect(() =>
			new LoggedInGuard().canActivate(mockExecutionContextWithSession({}))
		).toThrowError();
	});
});
