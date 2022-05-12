import { GetPermissionsQuery } from '~generated/graphql-db-types-hetarchief';

export type PermissionResponse = GetPermissionsQuery['users_permission'][0];
