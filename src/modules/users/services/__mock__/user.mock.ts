import { GqlUser, Permission } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

export const mockUserResponse: { data: { users_profile: GqlUser[] } } = {
	data: {
		users_profile: [
			{
				id: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
				first_name: 'Marie',
				last_name: 'Odhiambo',
				full_name: 'Marie Odhiambo',
				mail: 'marie.odhiambo@example.com',
				accepted_tos_at: null,
				group_id: '0213c8d4-f459-45ef-8bbc-96268ab56d01',
				group: {
					permissions: [
						{
							permission: {
								name: Permission.READ_ALL_VISIT_REQUESTS,
							},
						},
					],
				},
				identities: [
					{
						identity_provider_name: Idp.HETARCHIEF,
					},
				],
			},
		],
	},
};
