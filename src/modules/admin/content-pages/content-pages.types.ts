import { Avo } from '@viaa/avo2-types';

import {
	GetContentPageByPathQuery as GetContentPageByPathQueryAvo,
	GetContentPagesQuery as GetContentPagesQueryAvo,
	GetContentPagesWithBlocksQuery as GetContentPagesWithBlocksQueryAvo,
	Lookup_Enum_Content_Types_Enum,
} from '~generated/graphql-db-types-avo';
import {
	GetContentPageByPathQuery as GetContentPageByPathQueryHetArchief,
	GetContentPagesQuery as GetContentPagesQueryHetArchief,
	GetContentPagesWithBlocksQuery as GetContentPagesWithBlocksQueryHetArchief,
	Lookup_App_Content_Type_Enum,
} from '~generated/graphql-db-types-hetarchief';
import { Media } from '~modules/media/media.types';

export enum AvoOrHetArchief {
	avo = 'avo',
	hetArchief = 'hetarchief',
}

type ContentPickerTypeAvo =
	| 'COLLECTION'
	| 'ITEM'
	| 'BUNDLE'
	| 'DROPDOWN'
	| 'SEARCH_QUERY'
	| 'PROJECTS';

type ContentPickerTypeHetArchief = 'IE_COLLECTION' | 'IE_OBJECT';

export type ContentPickerType =
	| ContentPickerTypeAvo
	| ContentPickerTypeHetArchief
	| 'CONTENT_PAGE'
	| 'INTERNAL_LINK'
	| 'EXTERNAL_LINK'
	| 'ANCHOR_LINK'
	| 'PROFILE';

export type LinkTarget = '_self' | '_blank';

export interface PickerItem {
	label?: string;
	type: ContentPickerType;
	value: string;
	target?: LinkTarget;
}

export interface ContentBlock {
	id: number;
	variables: { [key: string]: any } | any[] | null;
	position: number;
	created_at: string;
	updated_at: string;
	content_block_type: string;
}

export type ContentWidth = 'REGULAR' | 'LARGE' | 'MEDIUM';

export interface ContentPageLabel {
	id: number;
	label: string;
	content_type: ContentPageType;
	link_to: PickerItem | null;
}

export interface ContentPageLabelLink {
	id: number;
	content_id: number;
	label_id: number;
	created_at: string;
	updated_at: string;
	content_label: ContentPageLabel;
	content: ContentPage[];
}

export interface GqlUserProfile {
	first_name: string;
	last_name: string;
	group: Group;
}

export interface Group {
	id: string;
	label: string;
}

export interface ContentPage {
	id: number;
	thumbnailPath: string | null;
	title: string;
	description: string | null;
	seoDescription: string | null;
	metaDescription: string | null;
	path: string | null;
	isPublic: boolean;
	publishedAt: string;
	publishAt: string | null;
	depublishAt: string | null;
	createdAt: string;
	updatedAt: string | null;
	isProtected: boolean;
	contentType: ContentPageType;
	contentWidth: ContentWidth;
	owner: ContentPageUser;
	userProfileId: string | null;
	userGroupIds: string[] | null;
	content_blocks: ContentBlock[];
	labels: ContentPageLabel[];
}

export type GqlContentPage =
	| GetContentPageByPathQueryAvo['app_content'][0]
	| GetContentPageByPathQueryHetArchief['app_content_page'][0]
	| GetContentPagesQueryAvo['app_content'][0]
	| GetContentPagesQueryHetArchief['app_content_page'][0]
	| GetContentPagesWithBlocksQueryAvo['app_content'][0]
	| GetContentPagesWithBlocksQueryHetArchief['app_content_page'][0];
export type GqlContentBlock =
	| GetContentPageByPathQueryHetArchief['app_content_page'][0]['content_blocks'][0]
	| GetContentPageByPathQueryAvo['app_content'][0]['content_blocks'][0];

export type GqlAvoUser = GetContentPageByPathQueryAvo['app_content'][0]['profile'];
export type GqlHetArchiefUser =
	GetContentPageByPathQueryHetArchief['app_content_page'][0]['owner_profile'];
export type GqlUser = GqlAvoUser | GqlHetArchiefUser;

export interface ContentPageUser {
	id: string;
	fullName: string;
	firstName: string;
	lastName: string;
	groupId: string | number;
}

export type ContentPageType = Lookup_App_Content_Type_Enum | Lookup_Enum_Content_Types_Enum;
export const ContentPageTypeValues = {
	...Lookup_App_Content_Type_Enum,
	...Lookup_Enum_Content_Types_Enum,
};

// TODO add these types to the hetarchief hasura migrations after the database rename
// NIEUWS_ITEM = 'NIEUWS_ITEM',
// FAQ_ITEM = 'FAQ_ITEM',
// SCREENCAST = 'SCREENCAST',
// PAGINA = 'PAGINA',
// PROJECT = 'PROJECT',
// OVERZICHT = 'OVERZICHT',

export interface MediaPlayerPathInfo {
	getItemExternalIdPath: string;
	setItemExternalIdPath: string;
	setVideoSrcPath: string;
	setPosterSrcPath: string;
	setTitlePath: string;
	setDescriptionPath: string;
	setIssuedPath: string;
	setOrganisationPath: string;
	setDurationPath: string;
}

export type MediaItemResponse = Partial<Media> & {
	count: number;
};

export interface ContentPageOverviewResponse {
	pages: ContentPage[];
	count: number;
	labelCounts: { [id: number]: number };
}

export type LabelObj = {
	label: string;
	id: number;
};

export interface SearchDateRange {
	gte: string | '' | undefined;
	lte: string | '' | undefined;
}

export type ResolvedItemOrCollection = Partial<Avo.Item.Item | Avo.Collection.Collection> & {
	src?: string;
};

export type FetchSearchQueryFunctionAvo = (
	limit: number,
	filters: Partial<Avo.Search.Filters>,
	orderProperty: Avo.Search.OrderProperty,
	orderDirection: Avo.Search.OrderDirection
) => Promise<Avo.Search.Search | null>;

export enum MediaItemType {
	ITEM = 'ITEM',
	COLLECTION = 'COLLECTION',
	BUNDLE = 'BUNDLE',
}
