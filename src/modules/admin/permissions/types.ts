import { GetPermissionsQuery } from '~generated/graphql-db-types-hetarchief';

export type Permission = GetPermissionsQuery['users_permission'][0];
