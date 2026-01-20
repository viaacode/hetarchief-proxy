import type { ExecutionContext } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { PermissionGuard } from './permission.guard';

import { PermissionName } from '@viaa/avo2-types';

const mockExecutionContextWithPermissions = (permissions) =>
	({
		switchToHttp: vi.fn().mockReturnValue({
			getRequest: vi.fn().mockReturnValue({
				session: {
					archiefUserInfo: {
						id: 'test-user-id',
						permissions,
					},
				},
			}),
		}),
		getClass: vi.fn(),
		getHandler: vi.fn(),
	}) as unknown as ExecutionContext;

const mockReflector = {
	get: vi.fn(),
	getAll: vi.fn(),
	getAllAndMerge: vi.fn(),
	getAllAndOverride: vi.fn(),
};

describe('PermissionGuard', () => {
	it('Should allow access when no permissions are required', async () => {
		const canActivate = new PermissionGuard(mockReflector).canActivate(
			mockExecutionContextWithPermissions([])
		);
		expect(canActivate).toBe(true);
	});

	it('Should allow access when the user has all required permissions', async () => {
		mockReflector.get.mockReturnValueOnce([
			PermissionName.DOWNLOAD_OBJECT,
			PermissionName.SEARCH_OBJECTS,
		]);
		const canActivate = new PermissionGuard(mockReflector).canActivate(
			mockExecutionContextWithPermissions([
				PermissionName.DOWNLOAD_OBJECT,
				PermissionName.SEARCH_OBJECTS,
			])
		);
		expect(canActivate).toBe(true);
	});

	it('Should NOT allow access when the user has not all required permissions', async () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([PermissionName.DOWNLOAD_OBJECT, PermissionName.SEARCH_OBJECTS]); // trigger the handler option as alternative
		expect(() =>
			new PermissionGuard(mockReflector).canActivate(
				mockExecutionContextWithPermissions([PermissionName.DOWNLOAD_OBJECT])
			)
		).toThrowError();
	});

	// Any permissions
	it('Should allow access when the user has any of the required permissions', async () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([PermissionName.DOWNLOAD_OBJECT, PermissionName.SEARCH_OBJECTS]);
		const canActivate = new PermissionGuard(mockReflector).canActivate(
			mockExecutionContextWithPermissions([PermissionName.DOWNLOAD_OBJECT])
		);
		expect(canActivate).toBe(true);
	});

	it('Should allow access when the user has all of the any permissions', async () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([PermissionName.DOWNLOAD_OBJECT, PermissionName.SEARCH_OBJECTS]);
		const canActivate = new PermissionGuard(mockReflector).canActivate(
			mockExecutionContextWithPermissions([
				PermissionName.DOWNLOAD_OBJECT,
				PermissionName.SEARCH_OBJECTS,
			])
		);
		expect(canActivate).toBe(true);
	});

	it('Should NOT allow access when the user has none of the any permissions', async () => {
		mockReflector.get
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([PermissionName.DOWNLOAD_OBJECT, PermissionName.SEARCH_OBJECTS]);
		expect(() =>
			new PermissionGuard(mockReflector).canActivate(
				mockExecutionContextWithPermissions([PermissionName.CREATE_VISIT_REQUEST])
			)
		).toThrowError();
	});
});
