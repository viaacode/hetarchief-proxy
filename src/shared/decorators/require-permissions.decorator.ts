import { SetMetadata } from '@nestjs/common';

export const RequireAllPermissions = (...requiredPermissions: string[]) =>
	SetMetadata('requiredPermissions', requiredPermissions);
