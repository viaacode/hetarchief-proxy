import { DataService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Injectable } from '@nestjs/common';

import { compact, isNil } from 'lodash';
import type {
	GetIeObjectsInThemeQuery,
	GetIeObjectsInThemeQueryVariables,
} from '~generated/graphql-db-types-hetarchief';
import { GetIeObjectsInThemeDocument } from '~generated/graphql-db-types-hetarchief';
import { IeObjectInThemeResponseDto, IeObjectsInThemeResponseDto } from '../dto/themes.dto';

@Injectable()
export class ThemesService {
	constructor(private dataService: DataService) {}

	public async getIeObjectsInTheme(
		themeSlug: string,
		limit: number
	): Promise<IeObjectsInThemeResponseDto> {
		const response = await this.dataService.execute<
			GetIeObjectsInThemeQuery,
			GetIeObjectsInThemeQueryVariables
		>(GetIeObjectsInThemeDocument, {
			themeSlug,
			objectsLimit: limit,
		});

		const theme = response.app_theme?.[0];

		if (!theme) {
			throw new CustomError(`Theme with slug '${themeSlug}' not found`, null, { themeSlug }, 404);
		}

		return this.adapt(theme);
	}

	private adapt(theme: GetIeObjectsInThemeQuery['app_theme'][0]): IeObjectsInThemeResponseDto {
		const ieObjects: IeObjectInThemeResponseDto[] = compact(
			theme.ieObjectLinksRandomOrder.flatMap((ieObjectLink) => {
				if (isNil(ieObjectLink.ieObject)) {
					return null;
				}
				return {
					id: ieObjectLink.ieObject.id,
					name: ieObjectLink.ieObject.schema_name ?? null,
					format: ieObjectLink.ieObject.dctermsFormat?.[0]?.dcterms_format ?? null,
					thumbnailUrl: ieObjectLink.ieObject.schemaThumbnail?.schema_thumbnail_url ?? null,
					maintainerId: ieObjectLink.ieObject.schemaMaintainer?.id ?? null,
					maintainerName: ieObjectLink.ieObject.schemaMaintainer?.skos_pref_label ?? null,
				};
			})
		);

		return {
			id: theme.id,
			slug: theme.slug,
			nameNl: theme.name_nl,
			nameEn: theme.name_en,
			imageUrl: theme.image_url ?? null,
			ieObjects,
		};
	}
}
