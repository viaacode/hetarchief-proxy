import { Media } from '~modules/media/types';
import { User } from '~modules/users/types';

export type ContentPickerType =
	// Avo
	| 'COLLECTION'
	| 'ITEM'
	| 'BUNDLE'
	| 'DROPDOWN'
	| 'SEARCH_QUERY'
	| 'PROJECTS'

	// Het archief
	| 'IE_COLLECTION'
	| 'IE_OBJECT'

	// Both
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
	content_id: number;
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
	created_at: string;
	updated_at: string;
	content_content_labels: ContentPageLabelLink[];
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

export interface GqlContentPage {
	content_type: string;
	created_at: string;
	depublish_at: any;
	description: any;
	seo_description: any;
	meta_description: any;
	id: string;
	thumbnail_path: string;
	is_protected: boolean;
	is_public: boolean;
	path: string;
	owner: GqlUserProfile;
	publish_at: any;
	published_at: any;
	title: string;
	updated_at: string;
	user_group_ids: any[];
	user_profile_id: string;
	content_content_labels: any[];
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

export interface CmsContentAggregate {
	aggregate: Aggregate;
}

export interface Aggregate {
	count: number;
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
	contentType: string;
	contentWidth: ContentWidth;
	owner: User;
	userProfileId: string | null;
	userGroupIds: number[] | null;
	contentBlocks: ContentBlock[];
	labels: ContentPageLabel[];
}

export type ContentPageType =
	| 'NIEUWS_ITEM'
	| 'FAQ_ITEM'
	| 'SCREENCAST'
	| 'PAGINA'
	| 'PROJECT'
	| 'OVERZICHT';

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

export type ResolvedIeObject = Partial<Media> & {
	src?: string;
};

export type MediaItemResponse = Partial<Media> & {
	count: number;
};

export interface ContentPageOverviewParams {
	withBlock: boolean;
	contentType: string;
	// Visible tabs in the page overview component for which we should fetch item counts
	labelIds: number[];
	// Selected tabs for which we should fetch content page items
	selectedLabelIds: number[];
	orderByProp?: string;
	orderByDirection?: 'asc' | 'desc';
	offset: number;
	limit: number;
}

export interface ContentPageOverviewResponse {
	pages: ContentPage[];
	count: number;
	labelCounts: { [id: number]: number };
}

export type LabelObj = {
	label: string;
	id: number;
};

export type ContentLabelsRequestBody =
	| {
			contentType: string;
			labelIds: string[];
	  }
	| {
			contentType: string;
			labels: string[];
	  };
