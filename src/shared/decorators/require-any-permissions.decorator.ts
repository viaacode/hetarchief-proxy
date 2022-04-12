import { SetMetadata } from '@nestjs/common';

export const RequireAnyPermissions = (...requireAnyPermissions: string[]) =>
	SetMetadata('requireAnyPermissions', requireAnyPermissions);
