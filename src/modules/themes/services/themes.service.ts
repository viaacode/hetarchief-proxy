import { DataService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Injectable, NotFoundException } from '@nestjs/common';

import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { compact, isNil, set } from 'lodash';
import type {
	DeleteIeObjectFromThemeMutation,
	DeleteIeObjectFromThemeMutationVariables,
	DeleteThemeMutation,
	DeleteThemeMutationVariables,
	GetIeObjectsByThemeIdQuery,
	GetIeObjectsByThemeIdQueryVariables,
	GetIeObjectsInThemeQuery,
	GetIeObjectsInThemeQueryVariables,
	GetThemesQuery,
	GetThemesQueryVariables,
	InsertIeObjectsIntoThemeMutation,
	InsertIeObjectsIntoThemeMutationVariables,
	InsertThemeMutation,
	InsertThemeMutationVariables,
	UpdateThemeMutation,
	UpdateThemeMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import {
	DeleteIeObjectFromThemeDocument,
	DeleteThemeDocument,
	GetIeObjectsByThemeIdDocument,
	GetIeObjectsInThemeDocument,
	GetThemesDocument,
	InsertIeObjectsIntoThemeDocument,
	InsertThemeDocument,
	Order_By,
	UpdateThemeDocument,
} from '~generated/graphql-db-types-hetarchief';
import {
	CreateThemeDto,
	IeObjectInThemeResponseDto,
	IeObjectsInThemeResponseDto,
	ThemeIeObjectLinkResponseDto,
	ThemeIeObjectsQueryDto,
	ThemeResponseDto,
	ThemesQueryDto,
	UpdateThemeDto,
} from '../dto/themes.dto';import {
	THEME_ORDER_PROP_TO_DB_PROP,
	ThemeIeObjectOrderProp,
	ThemeOrderProp,
} from '../themes.types';
import { SortDirection } from '~shared/types';

@Injectable()
export class ThemesService {
	constructor(private dataService: DataService) {}

	private toOrderBy(direction: SortDirection): Order_By {
		return direction as unknown as Order_By;
	}

	public async getThemes(queryDto: ThemesQueryDto): Promise<IPagination<ThemeResponseDto>> {
		const { page, size, orderProp, orderDirection } = queryDto;
		const offset = page * size;

		const dbProp = THEME_ORDER_PROP_TO_DB_PROP[orderProp] ?? THEME_ORDER_PROP_TO_DB_PROP[ThemeOrderProp.NAME_NL];
		const direction = this.toOrderBy(orderDirection ?? SortDirection.asc);
		const orderBy = [set({}, dbProp, direction)];

		const response = await this.dataService.execute<GetThemesQuery, GetThemesQueryVariables>(
			GetThemesDocument,
			{ offset, limit: size, orderBy }
		);

		const total = response.app_theme_aggregate.aggregate.count;

		return Pagination<ThemeResponseDto>({
			items: response.app_theme.map((theme) => this.adaptTheme(theme)),
			page,
			size,
			total,
		});
	}

	public async createTheme(dto: CreateThemeDto): Promise<ThemeResponseDto> {
		const response = await this.dataService.execute<
			InsertThemeMutation,
			InsertThemeMutationVariables
		>(InsertThemeDocument, {
			object: {
				slug: dto.slug,
				name_nl: dto.nameNl,
				name_en: dto.nameEn,
				image_url: dto.imageUrl ?? null,
			},
		});

		return this.adaptTheme(response.insert_app_theme_one);
	}

	public async updateTheme(themeId: string, dto: UpdateThemeDto): Promise<ThemeResponseDto> {
		const response = await this.dataService.execute<
			UpdateThemeMutation,
			UpdateThemeMutationVariables
		>(UpdateThemeDocument, {
			themeId,
			theme: {
				...(dto.slug !== undefined && { slug: dto.slug }),
				...(dto.nameNl !== undefined && { name_nl: dto.nameNl }),
				...(dto.nameEn !== undefined && { name_en: dto.nameEn }),
				...(dto.imageUrl !== undefined && { image_url: dto.imageUrl }),
			},
		});

		if (!response.update_app_theme_by_pk) {
			throw new NotFoundException(`Theme with id '${themeId}' not found`);
		}

		return this.adaptTheme(response.update_app_theme_by_pk);
	}

	public async deleteTheme(themeId: string): Promise<number> {
		const response = await this.dataService.execute<
			DeleteThemeMutation,
			DeleteThemeMutationVariables
		>(DeleteThemeDocument, { themeId });

		return response.delete_app_theme_by_pk ? 1 : 0;
	}

	public async addIeObjectsToTheme(
		themeId: string,
		ieObjectSchemaIdentifiers: string[]
	): Promise<ThemeIeObjectLinkResponseDto[]> {
		const response = await this.dataService.execute<
			InsertIeObjectsIntoThemeMutation,
			InsertIeObjectsIntoThemeMutationVariables
		>(InsertIeObjectsIntoThemeDocument, {
			objects: ieObjectSchemaIdentifiers.map((intellectualEntityId) => ({
				theme_id: themeId,
				intellectual_entity_id: intellectualEntityId,
			})),
		});

		return response.insert_app_theme_intellectual_entity.returning.map((link) => ({
			id: link.id,
			themeId: link.theme_id,
			intellectualEntityId: link.intellectual_entity_id,
		}));
	}

	public async deleteIeObjectFromTheme(themeId: string, ieObjectId: string): Promise<number> {
		const response = await this.dataService.execute<
			DeleteIeObjectFromThemeMutation,
			DeleteIeObjectFromThemeMutationVariables
		>(DeleteIeObjectFromThemeDocument, { themeId, ieObjectId });

		return response.delete_app_theme_intellectual_entity.affected_rows ?? 0;
	}

	public async getIeObjectsByThemeUuid(
		themeId: string,
		queryDto: ThemeIeObjectsQueryDto
	): Promise<IPagination<IeObjectInThemeResponseDto>> {
		const { page, size, orderProp, orderDirection } = queryDto;
		const offset = page * size;

		const direction = this.toOrderBy(orderDirection ?? SortDirection.asc);
		let orderBy: GetIeObjectsByThemeIdQueryVariables['orderBy'];
		if (orderProp === ThemeIeObjectOrderProp.NAME) {
			orderBy = [{ ieObject: { schema_name: direction } }];
		} else {
			orderBy = [set({}, 'intellectual_entity_id', direction)];
		}

		const response = await this.dataService.execute<
			GetIeObjectsByThemeIdQuery,
			GetIeObjectsByThemeIdQueryVariables
		>(GetIeObjectsByThemeIdDocument, { themeId, offset, limit: size, orderBy });

		const theme = response.app_theme_by_pk;

		if (!theme) {
			throw new NotFoundException(`Theme with id '${themeId}' not found`);
		}

		const total = theme.ieObjectLinks_aggregate.aggregate?.count ?? 0;

		const ieObjects: IeObjectInThemeResponseDto[] = compact(
			theme.ieObjectLinks.flatMap((ieObjectLink) => {
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

		return Pagination<IeObjectInThemeResponseDto>({ items: ieObjects, page, size, total });
	}

	public async getIeObjectsByThemeSlug(
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

		return this.adaptIeObjectsInTheme(theme);
	}

	private adaptTheme(theme: {
		id: string;
		slug: string;
		name_nl: string;
		name_en: string;
		image_url?: string | null;
	}): ThemeResponseDto {
		return {
			id: theme.id,
			slug: theme.slug,
			nameNl: theme.name_nl,
			nameEn: theme.name_en,
			imageUrl: theme.image_url ?? null,
		};
	}

	private adaptIeObjectsInTheme(
		theme: GetIeObjectsInThemeQuery['app_theme'][0]
	): IeObjectsInThemeResponseDto {
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
