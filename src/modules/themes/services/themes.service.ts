import { DataService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Injectable, NotFoundException } from '@nestjs/common';

import { type IPagination, Pagination } from '@studiohyperdrive/pagination';
import {
	HetArchiefIeObjectLicense,
	type HetArchiefIeObjectSector,
	HetArchiefIeObjectType,
} from '@viaa/avo2-types';
import { compact, isNil, set } from 'lodash';
import {
	DeleteIeObjectFromThemeDocument,
	DeleteIeObjectFromThemeMutation,
	DeleteIeObjectFromThemeMutationVariables,
	DeleteThemeDocument,
	DeleteThemeMutation,
	DeleteThemeMutationVariables,
	GetIeObjectIdBySchemaIdentifierDocument,
	GetIeObjectIdBySchemaIdentifierQuery,
	GetIeObjectIdBySchemaIdentifierQueryVariables,
	GetThemeWithObjectsDocument,
	GetThemeWithObjectsInRandomOrderDocument,
	GetThemeWithObjectsInRandomOrderQuery,
	GetThemeWithObjectsInRandomOrderQueryVariables,
	GetThemeWithObjectsQuery,
	GetThemeWithObjectsQueryVariables,
	GetThemesByIdsDocument,
	GetThemesByIdsQuery,
	GetThemesByIdsQueryVariables,
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
import { limitAccessToObjectDetails } from '~modules/ie-objects/helpers/limit-access-to-object-details';
import { mapDcTermsFormatToSimpleType } from '~modules/ie-objects/helpers/map-dc-terms-format-to-simple-type';
import { type IeObject, IeObjectsVisitorSpaceInfo } from '~modules/ie-objects/ie-objects.types';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { AUDIO_WAVE_FORM_URL } from '~shared/consts/audio-wave-form-url';
import { SortDirectionWithRandom } from '~shared/types';
import {
	AddIeObjectToThemeResultDto,
	CreateThemeDto,
	IeObjectInThemeResponseDto,
	IeObjectsInThemeResponseDto,
	ThemeIeObjectsQueryDto,
	ThemeResponseDto,
	ThemesQueryDto,
	UpdateThemeDto,
} from '../dto/themes.dto';
import {
	AddIeObjectToThemeResult,
	RawThemeIeObject,
	THEME_ORDER_PROP_TO_DB_PROP,
	ThemeIeObjectOrderProp,
	ThemeOrderProp,
} from '../themes.types';

@Injectable()
export class ThemesService {
	constructor(
		private dataService: DataService,
		private ieObjectsService: IeObjectsService
	) {}

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

	public async getThemesByIds(ids: string[]): Promise<ThemeResponseDto[]> {
		const response = await this.dataService.execute<
			GetThemesByIdsQuery,
			GetThemesByIdsQueryVariables
		>(GetThemesByIdsDocument, { ids });

		return response.app_theme.map((theme) => this.adaptTheme(theme));
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

	/**
	 * app_theme_intellectual_entity.intellectual_entity_id holds the full intellectual entity uri
	 * (e.g. https://data-qas.hetarchief.be/id/entity/qsnk362q84), which is environment specific.
	 * Callers therefore work with schema identifiers, and we resolve them here.
	 *
	 * Returns a map of schema identifier -> intellectual entity uri. Identifiers that do not
	 * resolve to an existing ie-object are absent from the map.
	 */
	private async resolveSchemaIdentifiersToEntityIds(
		schemaIdentifiers: string[]
	): Promise<Map<string, string>> {
		const uniqueSchemaIdentifiers = [...new Set(schemaIdentifiers)];

		const responses = await Promise.all(
			uniqueSchemaIdentifiers.map((schemaIdentifier) =>
				this.dataService.execute<
					GetIeObjectIdBySchemaIdentifierQuery,
					GetIeObjectIdBySchemaIdentifierQueryVariables
				>(GetIeObjectIdBySchemaIdentifierDocument, { schemaIdentifier })
			)
		);

		const resolved = new Map<string, string>();
		uniqueSchemaIdentifiers.forEach((schemaIdentifier, index) => {
			const entityId = responses[index]?.graph_intellectual_entity?.[0]?.id;
			if (entityId) {
				resolved.set(schemaIdentifier, entityId);
			}
		});

		return resolved;
	}

	public async addIeObjectsToTheme(
		themeId: string,
		ieObjectSchemaIdentifiers: string[]
	): Promise<AddIeObjectToThemeResultDto[]> {
		const resolved = await this.resolveSchemaIdentifiersToEntityIds(ieObjectSchemaIdentifiers);

		const insertedEntityIds = new Set<string>();
		const entityIdsToLink = [...new Set(resolved.values())];

		if (entityIdsToLink.length) {
			const response = await this.dataService.execute<
				InsertIeObjectsIntoThemeMutation,
				InsertIeObjectsIntoThemeMutationVariables
			>(InsertIeObjectsIntoThemeDocument, {
				objects: entityIdsToLink.map((intellectualEntityId) => ({
					theme_id: themeId,
					intellectual_entity_id: intellectualEntityId,
				})),
			});

			// The insert ignores conflicts (update_columns: []), so `returning` only contains rows
			// that were newly inserted. Anything resolved but absent was already linked.
			for (const link of response.insert_app_theme_intellectual_entity.returning) {
				insertedEntityIds.add(link.intellectual_entity_id);
			}
		}

		// Report one result per submitted identifier, in submission order. If the same identifier is
		// submitted twice, only its first occurrence counts as added.
		const reportedAsAdded = new Set<string>();

		return ieObjectSchemaIdentifiers.map((schemaIdentifier) => {
			const entityId = resolved.get(schemaIdentifier);

			if (!entityId) {
				return { schemaIdentifier, result: AddIeObjectToThemeResult.NOT_FOUND };
			}

			if (insertedEntityIds.has(entityId) && !reportedAsAdded.has(schemaIdentifier)) {
				reportedAsAdded.add(schemaIdentifier);
				return { schemaIdentifier, result: AddIeObjectToThemeResult.ADDED };
			}

			return { schemaIdentifier, result: AddIeObjectToThemeResult.ALREADY_LINKED };
		});
	}

	public async deleteIeObjectFromTheme(
		themeId: string,
		ieObjectSchemaIdentifier: string
	): Promise<number> {
		const resolved = await this.resolveSchemaIdentifiersToEntityIds([ieObjectSchemaIdentifier]);
		const ieObjectId = resolved.get(ieObjectSchemaIdentifier);

		if (!ieObjectId) {
			// No such ie-object, so there is no link to remove either
			return 0;
		}

		const response = await this.dataService.execute<
			DeleteIeObjectFromThemeMutation,
			DeleteIeObjectFromThemeMutationVariables
		>(DeleteIeObjectFromThemeDocument, { themeId, ieObjectId });

		return response.delete_app_theme_intellectual_entity.affected_rows ?? 0;
	}

	public async getIeObjectsByThemeUuid(
		themeUuid: string,
		queryDto: ThemeIeObjectsQueryDto,
		user: SessionUserEntity,
		referer: string,
		ip: string
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

		// Both queries select the same aggregate, so the total is available for the random order too
		const total = rawTheme.ieObjectLinks_aggregate.aggregate?.count ?? 0;

		// Needed for the essence access check, which runs for every object regardless of whether the
		// caller also wants the thumbnail url resolved
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		const ieObjects: IeObjectInThemeResponseDto[] = compact(
			await Promise.all(
				rawIeObjects.map((rawIeObject) => {
					if (isNil(rawIeObject)) {
						return null;
					}
					return this.adaptIeObject(
						rawIeObject,
						queryDto.resolveThumbnailUrl,
						visitorSpaceAccessInfo,
						user,
						referer,
						ip
					);
				})
			)
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
		updated_at?: string | null;
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
			updatedAt: theme.updated_at ?? null,
		};
	}

	private async adaptIeObject(
		rawIeObject: RawThemeIeObject,
		resolveThumbnailUrl: boolean,
		visitorSpaceAccessInfo?: IeObjectsVisitorSpaceInfo,
		user?: SessionUserEntity,
		referer?: string,
		ip?: string
	): Promise<IeObjectInThemeResponseDto> {
		const { hasAccessToEssence, objectLicences } = this.determineEssenceAccess(
			rawIeObject,
			visitorSpaceAccessInfo,
			user
		);

		let thumbnailUrl: string | undefined = undefined;

		if (resolveThumbnailUrl && hasAccessToEssence) {
			thumbnailUrl = await this.determineThumbnailUrl(rawIeObject, objectLicences, referer, ip);
		}

		return {
			id: rawIeObject.id,
			schemaIdentifier: rawIeObject.schema_identifier ?? null,
			name: rawIeObject.schema_name ?? null,
			format: rawIeObject.dctermsFormat?.[0]?.dcterms_format ?? null,
			thumbnailUrl: thumbnailUrl ?? null,
			hasAccessToEssence,
			maintainerId: rawIeObject.schemaMaintainer?.id ?? null,
			maintainerName: rawIeObject.schemaMaintainer?.skos_pref_label ?? null,
		};
	}

	/**
	 * Runs the license censor to find out whether the current user may see this object's essence,
	 * and which of its licenses they can actually reach. Both are needed for every object, whether
	 * or not the caller asked for the thumbnail url to be resolved.
	 */
	private determineEssenceAccess(
		rawIeObject: RawThemeIeObject,
		visitorSpaceAccessInfo?: IeObjectsVisitorSpaceInfo,
		user?: SessionUserEntity
	): { hasAccessToEssence: boolean; objectLicences: HetArchiefIeObjectLicense[] } {
		if (!user) {
			return { hasAccessToEssence: false, objectLicences: [] };
		}

		const objectForAccessChecks: Pick<
			IeObject,
			'licenses' | 'schemaIdentifier' | 'maintainerId' | 'sector'
		> = {
			maintainerId: rawIeObject.schemaMaintainer?.org_identifier,
			schemaIdentifier: rawIeObject.schema_identifier,
			licenses: rawIeObject.schemaLicense?.schema_license as HetArchiefIeObjectLicense[],
			sector: rawIeObject.schemaMaintainer?.ha_org_sector as HetArchiefIeObjectSector,
		};
		const censoredObjectMetadata = limitAccessToObjectDetails(objectForAccessChecks, {
			userId: user.getId(),
			isKeyUser: user.getIsKeyUser(),
			sector: user.getSector(),
			groupId: user.getGroupId(),
			maintainerId: user.getOrganisationId(),
			accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo?.objectIds,
			accessibleVisitorSpaceIds: visitorSpaceAccessInfo?.visitorSpaceIds,
		});

		return {
			hasAccessToEssence: !!censoredObjectMetadata?.hasAccessToEssence,
			objectLicences: censoredObjectMetadata?.licenses ?? [],
		};
	}

	/**
	 * Resolves the thumbnail url of an object the user is already known to have essence access to.
	 */
	private async determineThumbnailUrl(
		rawIeObject: RawThemeIeObject,
		objectLicences: HetArchiefIeObjectLicense[],
		referer?: string,
		ip?: string
	): Promise<string | undefined> {
		const dctermsFormat = rawIeObject.dctermsFormat?.[0]?.dcterms_format ?? null;

		if (
			mapDcTermsFormatToSimpleType(dctermsFormat as HetArchiefIeObjectType) ===
			HetArchiefIeObjectType.AUDIO
		) {
			return AUDIO_WAVE_FORM_URL; // avoid the ugly speaker
		}

		const isPublicDomain: boolean =
			objectLicences?.includes(HetArchiefIeObjectLicense.PUBLIEK_CONTENT) &&
			objectLicences?.includes(HetArchiefIeObjectLicense.PUBLIC_DOMAIN);

		return this.ieObjectsService.getThumbnailUrlWithToken(
			rawIeObject?.schemaThumbnail?.schema_thumbnail_url?.[0],
			referer,
			ip,
			// If the object is public domain, we generate a thumbnailUrl with a token that stays valid for 15 years
			// https://meemoo.atlassian.net/browse/ARC-2891
			isPublicDomain
		);
	}
}
