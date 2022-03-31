import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject } from 'class-validator';

import { TranslationKey } from '../types';

export class UpdateTranslationsDto {
	@ApiProperty({
		required: true,
		enum: TranslationKey,
		description:
			'The translation set to be updated, possible values: ' +
			Object.values(TranslationKey).join(', '),
	})
	@IsEnum(TranslationKey)
	key: TranslationKey;

	@IsObject()
	@ApiProperty({
		required: true,
		description:
			'A key-value object where the key is the translation-key, and value is the translation itself',
		example: { NO_PERMISSION: 'je hebt geen toegang' },
	})
	data: Record<string, string>;
}
