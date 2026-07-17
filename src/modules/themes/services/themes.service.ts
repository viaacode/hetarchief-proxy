import { DataService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Injectable, NotFoundException } from '@nestjs/common';

import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import { compact, isNil, set } from 'lodash';
import {
	DeleteIeObjectFromThemeDocument,
	DeleteIeObjectFromThemeMutation,
	DeleteIeObjectFromThemeMutationVariables,
	DeleteThemeDocument,
	DeleteThemeMutation,
	DeleteThemeMutationVariables,
	GetIeObjectsInThemeDocument,
	GetIeObjectsInThemeQuery,
	GetIeObjectsInThemeQueryVariables,
	GetThemeWithObjectsDocument,
	GetThemeWithObjectsInRandomOrderDocument,
	GetThemeWithObjectsInRandomOrderQuery,
	GetThemeWithObjectsInRandomOrderQueryVariables,
	GetThemeWithObjectsQuery,
	GetThemeWithObjectsQueryVariables,
	GetThemesDocument,
	GetThemesInRandomOrderDocument,
	GetThemesInRandomOrderQuery,
	GetThemesInRandomOrderQueryVariables,
	GetThemesQuery,
	GetThemesQueryVariables,
	GetThemesSearchDocument,
	GetThemesSearchQuery,
	GetThemesSearchQueryVariables,
	InsertIeObjectsIntoThemeDocument,
	InsertIeObjectsIntoThemeMutation,
	InsertIeObjectsIntoThemeMutationVariables,
	InsertThemeDocument,
	InsertThemeMutation,
	InsertThemeMutationVariables,
	Order_By,
	UpdateThemeDocument,
	UpdateThemeMutation,
	UpdateThemeMutationVariables,
} from '~generated/graphql-db-types-hetarchief';
import { SortDirectionWithRandom } from '~shared/types';
import {
	CreateThemeDto,
	IeObjectInThemeResponseDto,
	IeObjectsInThemeResponseDto,
	ThemeIeObjectLinkResponseDto,
	ThemeIeObjectsQueryDto,
	ThemeResponseDto,
	ThemesQueryDto,
	UpdateThemeDto,
} from '../dto/themes.dto';
import {
	RawThemeIeObject,
	THEME_ORDER_PROP_TO_DB_PROP,
	ThemeIeObjectOrderProp,
	ThemeOrderProp,
} from '../themes.types';

@Injectable()
export class ThemesService {
	constructor(private dataService: DataService) {}

	public async getThemes(queryDto: ThemesQueryDto): Promise<IPagination<ThemeResponseDto>> {
		const { page, size, orderProp, orderDirection, searchTerm } = queryDto;
		const offset = page * size;
		const searchPattern = searchTerm ? `%${searchTerm}%` : undefined;

		if (orderDirection === SortDirectionWithRandom.random) {
			// Gets themes from the app_theme_random_order view
			// Which has a computed column that is filled in by the postgres function RANDOM()
			// And rows are sorted by that random column, so we get a random selection of themes
			const response = await this.dataService.execute<
				GetThemesInRandomOrderQuery,
				GetThemesInRandomOrderQueryVariables
			>(GetThemesInRandomOrderDocument, { limit: size });

			return Pagination<ThemeResponseDto>({
				items: response.app_theme_random_order.map((theme) => this.adaptTheme(theme)),
				page,
				size,
				total: 0,
			});
		}

		const dbProp =
			THEME_ORDER_PROP_TO_DB_PROP[orderProp] ?? THEME_ORDER_PROP_TO_DB_PROP[ThemeOrderProp.NAME_NL];
		const direction = (orderDirection ?? SortDirectionWithRandom.asc) as unknown as Order_By;
		const orderBy = [set({}, dbProp, direction)];

		if (searchPattern) {
			const response = await this.dataService.execute<
				GetThemesSearchQuery,
				GetThemesSearchQueryVariables
			>(GetThemesSearchDocument, { offset, limit: size, orderBy, searchTerm: searchPattern });

			return Pagination<ThemeResponseDto>({
				items: response.app_theme.map((theme) => this.adaptTheme(theme)),
				page,
				size,
				total: response.app_theme_aggregate.aggregate.count,
			});
		}

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
				description_nl: dto.descriptionNl ?? null,
				description_en: dto.descriptionEn ?? null,
				image_url: dto.imageUrl ?? null,
				content_page_path_nl: dto.contentPagePathNl ?? null,
				content_page_path_en: dto.contentPagePathEn ?? null,
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
				...(dto.descriptionNl !== undefined && { description_nl: dto.descriptionNl }),
				...(dto.descriptionEn !== undefined && { description_en: dto.descriptionEn }),
				...(dto.imageUrl !== undefined && { image_url: dto.imageUrl }),
				...(dto.contentPagePathNl !== undefined && {
					content_page_path_nl: dto.contentPagePathNl,
				}),
				...(dto.contentPagePathEn !== undefined && {
					content_page_path_en: dto.contentPagePathEn,
				}),
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
		themeUuid: string,
		queryDto: ThemeIeObjectsQueryDto
	): Promise<IeObjectsInThemeResponseDto> {
		const { page, size, orderProp, orderDirection } = queryDto;
		const offset = page * size;

		let rawIeObjects: RawThemeIeObject[];
		let rawTheme:
			| GetThemeWithObjectsInRandomOrderQuery['app_theme_by_pk']
			| GetThemeWithObjectsQuery['app_theme_by_pk'];
		if (orderDirection && orderDirection === SortDirectionWithRandom.random) {
			// random
			// Gets a theme with ieObjects from the app_theme_intellectual_entity_random_order view
			// Which has a computed column that is filled in by the postgres function RANDOM()
			// And rows are sorted by that random column, so we get a random selection of ieObjects
			const response = await this.dataService.execute<
				GetThemeWithObjectsInRandomOrderQuery,
				GetThemeWithObjectsInRandomOrderQueryVariables
			>(GetThemeWithObjectsInRandomOrderDocument, { themeId: themeUuid, objectsLimit: size });
			rawTheme = response.app_theme_by_pk;
			rawIeObjects =
				compact(response.app_theme_by_pk?.ieObjectLinksRandomOrder.map((link) => link.ieObject)) ??
				[];
		} else {
			// asc or desc
			const direction = (orderDirection ?? SortDirectionWithRandom.asc) as unknown as Order_By;
			let orderBy: GetThemeWithObjectsQueryVariables['orderBy'];
			switch (orderProp) {
				case ThemeIeObjectOrderProp.MAINTAINER_NAME:
					orderBy = [{ ieObject: { schemaMaintainer: { skos_pref_label: direction } } }];
					break;
				default: // ThemeIeObjectOrderProp.NAME
					orderBy = [{ ieObject: { schema_name: direction } }];
					break;
			}

			const response = await this.dataService.execute<
				GetThemeWithObjectsQuery,
				GetThemeWithObjectsQueryVariables
			>(GetThemeWithObjectsDocument, { themeId: themeUuid, offset, limit: size, orderBy });
			rawTheme = response.app_theme_by_pk;
			rawIeObjects = response.app_theme_by_pk?.ieObjectLinks?.map((link) => link.ieObject) ?? [];
		}

		if (!rawTheme) {
			throw new CustomError('Theme was not found', null, { themeUuid, queryDto });
		}

		let total: number | null = null;
		if (orderDirection !== SortDirectionWithRandom.random) {
			total =
				(rawTheme as GetThemeWithObjectsQuery['app_theme_by_pk']).ieObjectLinks_aggregate.aggregate
					?.count ?? 0;
		}

		const ieObjects: IeObjectInThemeResponseDto[] = compact(
			rawIeObjects.map((rawIeObject) => {
				if (isNil(rawIeObject)) {
					return null;
				}
				return this.adaptIeObject(rawIeObject);
			})
		);

		const theme = this.adaptTheme(rawTheme);
		return {
			...theme,
			ieObjects: ieObjects,
			total,
		};
	}

	private adaptTheme(theme: {
		id?: string;
		slug?: string | null;
		name_nl?: string | null;
		name_en?: string | null;
		description_nl?: string | null;
		description_en?: string | null;
		image_url?: string | null;
		content_page_path_nl?: string | null;
		content_page_path_en?: string | null;
	}): ThemeResponseDto {
		return {
			id: theme.id,
			slug: theme.slug ?? '',
			nameNl: theme.name_nl ?? '',
			nameEn: theme.name_en ?? '',
			descriptionNl: theme.description_nl ?? null,
			descriptionEn: theme.description_en ?? null,
			imageUrl: theme.image_url ?? null,
			contentPagePathNl: theme.content_page_path_nl ?? null,
			contentPagePathEn: theme.content_page_path_en ?? null,
		};
	}

	private adaptIeObject(rawIeObject: RawThemeIeObject): IeObjectInThemeResponseDto {
		return {
			id: rawIeObject.id,
			name: rawIeObject.schema_name ?? null,
			format: rawIeObject.dctermsFormat?.[0]?.dcterms_format ?? null,
			thumbnailUrl: rawIeObject.schemaThumbnail?.schema_thumbnail_url ?? null,
			maintainerId: rawIeObject.schemaMaintainer?.id ?? null,
			maintainerName: rawIeObject.schemaMaintainer?.skos_pref_label ?? null,
		};
	}
}
