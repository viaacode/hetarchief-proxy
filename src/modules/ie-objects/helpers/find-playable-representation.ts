import { compact } from 'lodash';

import { FLOWPLAYER_FORMATS, IMAGE_API_FORMATS } from '../ie-objects.conts';
import type {
	PlayableDisplayDataFile,
	PlayableDisplayDataPage,
	PlayableDisplayDataRepresentation,
} from '../services/ie-objects.service.types';

import type { GetIeObjectPlayableDisplayDataQuery } from '~generated/graphql-db-types-hetarchief';

/**
 * Finds the first image-api file in a representation's files, same selection as
 * ObjectDetailPage.tsx's iiifViewerImageInfos in hetarchief-client.
 */
export function findIiifImageFile(
	files: PlayableDisplayDataFile[]
): PlayableDisplayDataFile | null {
	return (
		files.find((file) => IMAGE_API_FORMATS.includes(file.ebucore_has_mime_type)) ||
		// Delete when https://meemoo.atlassian.net/browse/ARC-3156 is fixed
		files.find((file) => file.premis_stored_at?.endsWith('jp2')) ||
		null
	);
}

/**
 * Finds the first representation (own + child parts, own representations checked before child
 * pages) that contains a file relevant to the caller's needs - a flowplayer-compatible file for
 * AV objects, or an IIIF image file for non-AV objects (mainly newspapers), reusing
 * findIiifImageFile as the source of truth for "is this an image file". A representation without
 * such a file is skipped so the search falls through to the next one, e.g. a newspaper's own
 * representation holding only a non-image export falls through to the child page holding the
 * real page image. Matches the object detail page's selection. Cut fragments are hidden
 * whenever a main (non-fragment) representation also exists (ARC-3690), and m4a/duplicate-mpeg
 * representations are skipped the same way cleanupRepresentations does for the full object
 * detail query (ARC-3121) - both no-ops for non-AV objects since their files never carry audio
 * mimetypes.
 */
export function findFirstPlayableRepresentation(
	dbResponse: GetIeObjectPlayableDisplayDataQuery,
	isAvObject: boolean
): PlayableDisplayDataRepresentation | null {
	const pages: PlayableDisplayDataPage[] = [
		...(dbResponse.getIsRepresentedBy || []),
		...(dbResponse.getHasPart || []),
	].filter((page) => (page.isRepresentedBy?.length || 0) > 0);

	const hasMainRepresentation = pages.some((page) =>
		page.isRepresentedBy.some(
			(representation: PlayableDisplayDataRepresentation) =>
				representation.is_media_fragment_of === null
		)
	);

	for (const page of pages) {
		for (const representation of page.isRepresentedBy as PlayableDisplayDataRepresentation[]) {
			if (hasMainRepresentation && representation.is_media_fragment_of) {
				continue;
			}

			const mimeTypes = (representation.includes || []).map(
				(include) => include.file?.ebucore_has_mime_type
			);
			if (mimeTypes.includes('audio/m4a')) {
				continue;
			}
			if (
				mimeTypes.includes('audio/mpeg') &&
				page.isRepresentedBy.some((sibling: PlayableDisplayDataRepresentation) =>
					(sibling.includes || []).some(
						(include) => include.file?.ebucore_has_mime_type === 'audio/mp4'
					)
				)
			) {
				continue;
			}

			const files = compact((representation.includes || []).map((include) => include.file));
			const hasRelevantFile = isAvObject
				? files.some((file) => FLOWPLAYER_FORMATS.includes(file.ebucore_has_mime_type))
				: !!findIiifImageFile(files);

			if (!hasRelevantFile) {
				continue;
			}

			return representation;
		}
	}
	return null;
}
