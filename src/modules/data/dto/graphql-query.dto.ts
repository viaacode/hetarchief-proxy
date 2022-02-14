import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GraphQlQueryDto {
	@IsString()
	@IsNotEmpty()
	query: string;

	@IsOptional()
	variables?: any;
}
