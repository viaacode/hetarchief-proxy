import { DocumentNode } from 'graphql';

import {
	GetContentByIdDocument as GetContentByIdDocumentAvo,
	GetContentPageByPathDocument as GetContentPageByPathDocumentAvo,
	GetContentPageLabelsByTypeAndIdsDocument as GetContentPageLabelsByTypeAndIdsDocumentAvo,
	GetContentPageLabelsByTypeAndLabelsDocument as GetContentPageLabelsByTypeAndLabelsDocumentAvo,
	GetContentPagesDocument as GetContentPagesDocumentAvo,
	GetContentPagesWithBlocksDocument as GetContentPagesWithBlocksDocumentAvo,
	GetPublicContentPagesDocument as GetPublicContentPagesDocumentAvo,
	UpdateContentPagePublishDatesDocument as UpdateContentPagePublishDatesDocumentAvo,
} from '~generated/graphql-db-types-avo';
import {
	GetContentByIdDocument as GetContentByIdDocumentHetArchief,
	GetContentPageByPathDocument as GetContentPageByPathDocumentHetArchief,
	GetContentPageLabelsByTypeAndIdsDocument as GetContentPageLabelsByTypeAndIdsDocumentHetArchief,
	GetContentPageLabelsByTypeAndLabelsDocument as GetContentPageLabelsByTypeAndLabelsDocumentHetArchief,
	GetContentPagesDocument as GetContentPagesDocumentHetArchief,
	GetContentPagesWithBlocksDocument as GetContentPagesWithBlocksDocumentHetArchief,
	GetPublicContentPagesDocument as GetPublicContentPagesDocumentHetArchief,
	UpdateContentPagePublishDatesDocument as UpdateContentPagePublishDatesDocumentHetArchief,
} from '~generated/graphql-db-types-hetarchief';
import {
	AvoOrHetArchief,
	MediaPlayerPathInfo,
} from '~modules/admin/content-pages/content-pages.types';

type ContentPageQueries = {
	GetContentByIdDocument: DocumentNode;
	GetContentPageByPathDocument: DocumentNode;
	GetContentPageLabelsByTypeAndIdsDocument: DocumentNode;
	GetContentPageLabelsByTypeAndLabelsDocument: DocumentNode;
	GetContentPagesDocument: DocumentNode;
	GetContentPagesWithBlocksDocument: DocumentNode;
	GetPublicContentPagesDocument: DocumentNode;
	UpdateContentPagePublishDatesDocument: DocumentNode;
};

export const CONTENT_PAGE_QUERIES: Record<AvoOrHetArchief, ContentPageQueries> = {
	[AvoOrHetArchief.avo]: {
		GetContentByIdDocument: GetContentByIdDocumentAvo,
		GetContentPageByPathDocument: GetContentPageByPathDocumentAvo,
		GetContentPageLabelsByTypeAndIdsDocument: GetContentPageLabelsByTypeAndIdsDocumentAvo,
		GetContentPageLabelsByTypeAndLabelsDocument: GetContentPageLabelsByTypeAndLabelsDocumentAvo,
		GetContentPagesDocument: GetContentPagesDocumentAvo,
		GetContentPagesWithBlocksDocument: GetContentPagesWithBlocksDocumentAvo,
		GetPublicContentPagesDocument: GetPublicContentPagesDocumentAvo,
		UpdateContentPagePublishDatesDocument: UpdateContentPagePublishDatesDocumentAvo,
	},
	[AvoOrHetArchief.hetArchief]: {
		GetContentByIdDocument: GetContentByIdDocumentHetArchief,
		GetContentPageByPathDocument: GetContentPageByPathDocumentHetArchief,
		GetContentPageLabelsByTypeAndIdsDocument:
			GetContentPageLabelsByTypeAndIdsDocumentHetArchief,
		GetContentPageLabelsByTypeAndLabelsDocument:
			GetContentPageLabelsByTypeAndLabelsDocumentHetArchief,
		GetContentPagesDocument: GetContentPagesDocumentHetArchief,
		GetContentPagesWithBlocksDocument: GetContentPagesWithBlocksDocumentHetArchief,
		GetPublicContentPagesDocument: GetPublicContentPagesDocumentHetArchief,
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
