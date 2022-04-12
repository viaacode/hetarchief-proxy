import { SetMetadata } from '@nestjs/common';

export const RequirePermissions = (...requiredPermissions: string[]) =>
	SetMetadata('requiredPermissions', requiredPermissions);
