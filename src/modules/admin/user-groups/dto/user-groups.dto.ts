import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsUUID, ValidateNested } from 'class-validator';

export class UpdatePermission {
	@IsUUID()
	@ApiProperty({
		type: String,
		description: 'The permissionId (uuid) to add/remove from the user group',
		example: 'b53def44-7b00-402c-9014-e2fd3e3db06c',
	})
	permissionId: string;

	@IsUUID()
	@ApiProperty({
		type: String,
		description: 'The permission group (uuid) to update',
		example: 'c56d95aa-e918-47ca-b102-486c9449fc4a',
	})
	userGroupId: string;

	@IsBoolean()
	@ApiProperty({
		type: Boolean,
		description:
			'Whether to add this permission to the group (true) or remove it from the group (false)',
		example: true,
	})
	hasPermission: boolean;
}

export class UpdateUserGroupsDto {
	@IsArray()
	@Type(() => UpdatePermission)
	@IsArray()
	@ValidateNested()
	@ApiProperty({
		type: () => [UpdatePermission],
		description: 'The permissionId to add/remove from the user group',
		example: [
			{
				userGroupId: '01ba6e7e-de74-4546-9462-7489aa3ed5a5',
				permissionId: 'e19e9490-b2b0-4bd5-bb7d-aa930fffcceb',
				hasPermission: true,
			},
			{
				userGroupId: '01ba6e7e-de74-4546-9462-7489aa3ed5a5',
				permissionId: 'aca096c1-8a3e-4ee5-823e-c12652c888f2',
				hasPermission: true,
			},
			{
				userGroupId: '012b353c-1486-45a6-b335-c48ff7484892',
				permissionId: 'e19e9490-b2b0-4bd5-bb7d-aa930fffcceb',
				hasPermission: false,
			},
		] as UpdatePermission[],
	})
	updates: UpdatePermission[];
}
