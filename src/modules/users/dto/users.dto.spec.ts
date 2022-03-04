import { CreateUserDto, UpdateAcceptedTosDto, UpdateUserDto } from '~modules/users/dto/users.dto';

describe('UsersDto', () => {
	describe('CreateUserDto', () => {
		it('should be able to construct a CreateUserDto object', async () => {
			const createUserDto = new CreateUserDto();
			expect(createUserDto).toEqual({});
		});
	});
	describe('UpdateUserDto', () => {
		it('should be able to construct a UpdateUserDto object', async () => {
			const updateUserDto = new UpdateUserDto();
			expect(updateUserDto).toEqual({});
		});
	});
	describe('UpdateAcceptedTosDto', () => {
		it('should be able to construct a UpdateAcceptedTosDto object', async () => {
			const updateAcceptedTosDto = new UpdateAcceptedTosDto();
			expect(updateAcceptedTosDto).toEqual({});
		});
	});
});
