import { DocumentNode } from 'graphql';

import {
	DeleteContentLabelLinksDocument as DeleteContentLabelLinksDocumentAvo,
	GetCollectionTileByIdDocument,
	GetContentByIdDocument as GetContentByIdDocumentAvo,
	GetContentLabelsByContentTypeDocument as GetContentLabelsByContentTypeDocumentAvo,
	GetContentPageByPathDocument as GetContentPageByPathDocumentAvo,
	GetContentPageLabelsByTypeAndIdsDocument as GetContentPageLabelsByTypeAndIdsDocumentAvo,
	GetContentPageLabelsByTypeAndLabelsDocument as GetContentPageLabelsByTypeAndLabelsDocumentAvo,
	GetContentPagesByIdsDocument as GetContentPagesByIdsDocumentAvo,
	GetContentPagesDocument as GetContentPagesDocumentAvo,
	GetContentPagesWithBlocksDocument as GetContentPagesWithBlocksDocumentAvo,
	GetContentTypesDocument as GetContentTypesDocumentAvo,
	GetItemTileByIdDocument,
	GetPermissionsFromContentPageByPathDocument as GetPermissionsFromContentPageByPathDocumentAvo,
	GetPublicContentPagesByTitleDocument as GetPublicContentPagesByTitleDocumentAvo,
	GetPublicContentPagesDocument as GetPublicContentPagesDocumentAvo,
	GetPublicProjectContentPagesByTitleDocument as GetPublicProjectContentPagesByTitleDocumentAvo,
	GetPublicProjectContentPagesDocument as GetPublicProjectContentPagesDocumentAvo,
	InsertContentDocument as InsertContentDocumentAvo,
	InsertContentLabelLinksDocument as InsertContentLabelLinksDocumentAvo,
	SoftDeleteContentDocument as SoftDeleteContentDocumentAvo,
	UpdateContentByIdDocument as UpdateContentByIdDocumentAvo,
	UpdateContentPagePublishDatesDocument as UpdateContentPagePublishDatesDocumentAvo,
} from '../../../generated/graphql-db-types-avo';
import {
	DeleteContentLabelLinksDocument as DeleteContentLabelLinksDocumentHetArchief,
	GetContentByIdDocument as GetContentByIdDocumentHetArchief,
	GetContentLabelsByContentTypeDocument as GetContentLabelsByContentTypeDocumentHetArchief,
	GetContentPageByPathDocument as GetContentPageByPathDocumentHetArchief,
	GetContentPageLabelsByTypeAndIdsDocument as GetContentPageLabelsByTypeAndIdsDocumentHetArchief,
	GetContentPageLabelsByTypeAndLabelsDocument as GetContentPageLabelsByTypeAndLabelsDocumentHetArchief,
	GetContentPagesByIdsDocument as GetContentPagesByIdsDocumentHetArchief,
	GetContentPagesDocument as GetContentPagesDocumentHetArchief,
	GetContentPagesWithBlocksDocument as GetContentPagesWithBlocksDocumentHetArchief,
	GetContentTypesDocument as GetContentTypesDocumentHetArchief,
	GetPermissionsFromContentPageByPathDocument as GetPermissionsFromContentPageByPathDocumentHetArchief,
	GetPublicContentPagesByTitleDocument as GetPublicContentPagesByTitleDocumentHetArchief,
	GetPublicContentPagesDocument as GetPublicContentPagesDocumentHetArchief,
	GetPublicProjectContentPagesByTitleDocument as GetPublicProjectContentPagesByTitleDocumentHetArchief,
	GetPublicProjectContentPagesDocument as GetPublicProjectContentPagesDocumentHetArchief,
	InsertContentDocument as InsertContentDocumentHetArchief,
	InsertContentLabelLinksDocument as InsertContentLabelLinksDocumentHetArchief,
	SoftDeleteContentDocument as SoftDeleteContentDocumentHetArchief,
	UpdateContentByIdDocument as UpdateContentByIdDocumentHetArchief,
	UpdateContentPagePublishDatesDocument as UpdateContentPagePublishDatesDocumentHetArchief,
} from '../../../generated/graphql-db-types-hetarchief';

import {
	AvoOrHetArchief,
	MediaPlayerPathInfo,
} from '~modules/admin/content-pages/content-pages.types';

type ContentPageQueries = {
	DeleteContentLabelLinksDocument: DocumentNode;
	GetContentByIdDocument: DocumentNode;
	GetContentLabelsByContentTypeDocument: DocumentNode;
	GetContentPageByPathDocument: DocumentNode;
	GetContentPageLabelsByTypeAndIdsDocument: DocumentNode;
	GetContentPageLabelsByTypeAndLabelsDocument: DocumentNode;
	GetContentPagesDocument: DocumentNode;
	GetContentPagesByIdsDocument: DocumentNode;
	GetContentPagesWithBlocksDocument: DocumentNode;
	GetContentTypesDocument: DocumentNode;
	GetPermissionsFromContentPageByPathDocument: DocumentNode;
	GetPublicContentPagesDocument: DocumentNode;
	GetPublicContentPagesByTitleDocument: DocumentNode;
	GetPublicProjectContentPagesDocument: DocumentNode;
	GetPublicProjectContentPagesByTitleDocument: DocumentNode;
	InsertContentDocument: DocumentNode;
	InsertContentLabelLinksDocument: DocumentNode;
	SoftDeleteContentDocument: DocumentNode;
	UpdateContentByIdDocument: DocumentNode;
	UpdateContentPagePublishDatesDocument: DocumentNode;
};

export const CONTENT_PAGE_QUERIES: Record<AvoOrHetArchief, ContentPageQueries> = {
	avo: {
		DeleteContentLabelLinksDocument: DeleteContentLabelLinksDocumentAvo,
		GetContentByIdDocument: GetContentByIdDocumentAvo,
		GetContentLabelsByContentTypeDocument: GetContentLabelsByContentTypeDocumentAvo,
		GetContentPageByPathDocument: GetContentPageByPathDocumentAvo,
		GetContentPageLabelsByTypeAndIdsDocument: GetContentPageLabelsByTypeAndIdsDocumentAvo,
		GetContentPageLabelsByTypeAndLabelsDocument: GetContentPageLabelsByTypeAndLabelsDocumentAvo,
		GetContentPagesDocument: GetContentPagesDocumentAvo,
		GetContentPagesByIdsDocument: GetContentPagesByIdsDocumentAvo,
		GetContentPagesWithBlocksDocument: GetContentPagesWithBlocksDocumentAvo,
		GetContentTypesDocument: GetContentTypesDocumentAvo,
		GetPermissionsFromContentPageByPathDocument: GetPermissionsFromContentPageByPathDocumentAvo,
		GetPublicContentPagesDocument: GetPublicContentPagesDocumentAvo,
		GetPublicContentPagesByTitleDocument: GetPublicContentPagesByTitleDocumentAvo,
		GetPublicProjectContentPagesDocument: GetPublicProjectContentPagesDocumentAvo,
		GetPublicProjectContentPagesByTitleDocument: GetPublicProjectContentPagesByTitleDocumentAvo,
		InsertContentDocument: InsertContentDocumentAvo,
		InsertContentLabelLinksDocument: InsertContentLabelLinksDocumentAvo,
		SoftDeleteContentDocument: SoftDeleteContentDocumentAvo,
		UpdateContentByIdDocument: UpdateContentByIdDocumentAvo,
		UpdateContentPagePublishDatesDocument: UpdateContentPagePublishDatesDocumentAvo,
	},
	hetArchief: {
		DeleteContentLabelLinksDocument: DeleteContentLabelLinksDocumentHetArchief,
		GetContentByIdDocument: GetContentByIdDocumentHetArchief,
		GetContentLabelsByContentTypeDocument: GetContentLabelsByContentTypeDocumentHetArchief,
		GetContentPageByPathDocument: GetContentPageByPathDocumentHetArchief,
		GetContentPageLabelsByTypeAndIdsDocument:
			GetContentPageLabelsByTypeAndIdsDocumentHetArchief,
		GetContentPageLabelsByTypeAndLabelsDocument:
			GetContentPageLabelsByTypeAndLabelsDocumentHetArchief,
		GetContentPagesDocument: GetContentPagesDocumentHetArchief,
		GetContentPagesByIdsDocument: GetContentPagesByIdsDocumentHetArchief,
		GetContentPagesWithBlocksDocument: GetContentPagesWithBlocksDocumentHetArchief,
		GetContentTypesDocument: GetContentTypesDocumentHetArchief,
		GetPermissionsFromContentPageByPathDocument:
			GetPermissionsFromContentPageByPathDocumentHetArchief,
		GetPublicContentPagesDocument: GetPublicContentPagesDocumentHetArchief,
		GetPublicContentPagesByTitleDocument: GetPublicContentPagesByTitleDocumentHetArchief,
		GetPublicProjectContentPagesDocument: GetPublicProjectContentPagesDocumentHetArchief,
		GetPublicProjectContentPagesByTitleDocument:
			GetPublicProjectContentPagesByTitleDocumentHetArchief,
		InsertContentDocument: InsertContentDocumentHetArchief,
		InsertContentLabelLinksDocument: InsertContentLabelLinksDocumentHetArchief,
		SoftDeleteContentDocument: SoftDeleteContentDocumentHetArchief,
		UpdateContentByIdDocument: UpdateContentByIdDocumentHetArchief,
		UpdateContentPagePublishDatesDocument: UpdateContentPagePublishDatesDocumentHetArchief,
	},
};

export const MEDIA_PLAYER_BLOCKS: { [blockType: string]: MediaPlayerPathInfo } = {
	MEDIA_PLAYER: {
		getItemExternalIdPath: 'variables.componentState.item.value',
		setItemExternalIdPath: 'variables.componentState.external_id',
		setVideoSrcPath: 'variables.componentState.src',
		setPosterSrcPath: 'variables.componentState.poster',
		setTitlePath: 'variables.componentState.title',
		setDescriptionPath: 'variables.componentState.description',
		setIssuedPath: 'variables.componentState.issued',
		setOrganisationPath: 'variables.componentState.organisation',
		setDurationPath: 'variables.componentState.duration',
	},
	MEDIA_PLAYER_TITLE_TEXT_BUTTON: {
		getItemExternalIdPath: 'variables.componentState.mediaItem.value',
		setItemExternalIdPath: 'variables.componentState.mediaExternalId',
		setVideoSrcPath: 'variables.componentState.mediaSrc',
		setPosterSrcPath: 'variables.componentState.mediaPoster',
		setTitlePath: 'variables.componentState.mediaTitle',
		setDescriptionPath: 'variables.componentState.mediaDescription',
		setIssuedPath: 'variables.componentState.mediaIssued',
		setOrganisationPath: 'variables.componentState.mediaOrganisation',
		setDurationPath: 'variables.componentState.mediaDuration',
	},
};

export const DEFAULT_AUDIO_STILL = '/images/audio-still.svg';
