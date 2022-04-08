import { ExecutionContext } from '@nestjs/common';

import { PermissionGuard } from './permission.guard';

import { Permission } from '~modules/users/types';

const mockExecutionContextWithPermissions = (permissions) =>
	({
		switchToHttp: jest.fn().mockReturnValue({
			getRequest: jest.fn().mockReturnValue({
				session: {
					archiefUserInfo: {
						id: 'test-user-id',
						permissions,
					},
				},
			}),
		}),
		getClass: jest.fn(),
		getHandler: jest.fn(),
	} as unknown as ExecutionContext);

const mockReflector = {
	get: jest.fn(),
	getAll: jest.fn(),
	getAllAndMerge: jest.fn(),
	getAllAndOverride: jest.fn(),
};

describe('PermissionGuard', () => {
	it('Should allow access when no permissions are required', async () => {
		const canActivate = new PermissionGuard(mockReflector).canActivate(
			mockExecutionContextWithPermissions([])
		);
		expect(canActivate).toBe(true);
	});

	it('Should allow access when the user has all required permissions', async () => {
		mockReflector.get.mockReturnValueOnce([Permission.SEARCH, Permission.CAN_SEARCH_OBJECTS]);
		const canActivate = new PermissionGuard(mockReflector).canActivate(
			mockExecutionContextWithPermissions([Permission.SEARCH, Permission.CAN_SEARCH_OBJECTS])
		);
		expect(canActivate).toBe(true);
	});

	it('Should not allow access when the user has not all required permissions', async () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([Permission.SEARCH, Permission.CAN_SEARCH_OBJECTS]); // trigger the handler option as alternative
		expect(() =>
			new PermissionGuard(mockReflector).canActivate(
				mockExecutionContextWithPermissions([Permission.SEARCH])
			)
		).toThrowError();
	});

	// Any permissions
	it('Should allow access when the user has any of the required permissions', async () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([Permission.SEARCH, Permission.CAN_SEARCH_OBJECTS]);
		const canActivate = new PermissionGuard(mockReflector).canActivate(
			mockExecutionContextWithPermissions([Permission.SEARCH])
		);
		expect(canActivate).toBe(true);
	});

	it('Should allow access when the user has all of the any permissions', async () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([Permission.SEARCH, Permission.CAN_SEARCH_OBJECTS]);
		const canActivate = new PermissionGuard(mockReflector).canActivate(
			mockExecutionContextWithPermissions([Permission.SEARCH, Permission.CAN_SEARCH_OBJECTS])
		);
		expect(canActivate).toBe(true);
	});

	it('Should NOT allow access when the user has none of the any permissions', async () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([Permission.SEARCH, Permission.CAN_SEARCH_OBJECTS]);
		expect(() =>
			new PermissionGuard(mockReflector).canActivate(
				mockExecutionContextWithPermissions([Permission.CAN_CREATE_VISIT_REQUEST])
			)
		).toThrowError();
	});
});
