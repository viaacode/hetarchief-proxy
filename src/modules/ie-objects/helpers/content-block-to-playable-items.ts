import type { DbContentBlock } from '@meemoo/admin-core-api';

import { Lookup_App_Content_Block_Type_Enum } from '~generated/graphql-db-types-hetarchief';

/**
 * One object to fetch playable display data for, as derived from a content block config.
 * Null means the block has a slot at this position that has no (usable) ie-object selected yet,
 * e.g. a freshly added, not-yet-filled-in carousel slide or a timeline node without an object.
 * Those are kept in the list so the client can keep matching the response to the block's
 * elements by position.
 */
export type PlayableDisplayDataItem = {
	schemaIdentifier: string;
	start?: number;
	end?: number;
} | null;

/**
 * The content block types whose config references playable ie-objects, and can therefore be
 * resolved to playable display data.
 */
export const PLAYABLE_DISPLAY_DATA_BLOCK_TYPES = [
	Lookup_App_Content_Block_Type_Enum.HetarchiefVideo,
	Lookup_App_Content_Block_Type_Enum.HeroCarousel,
	Lookup_App_Content_Block_Type_Enum.Timeline,
] as const;

/**
 * Matches a snippet time as an admin enters it in the content page editor: `MM:SS` or `HH:MM:SS`.
 * Hours are unbounded (a recording can be longer than a day); minutes and seconds are 00-59.
 * Mirrors snippetTimeToSeconds in the admin core ui.
 */
const SNIPPET_TIME_REGEX = /^(?:(\d+):)?([0-5]?\d):([0-5]\d)$/;

/**
 * Converts a snippet time from a content block config to whole seconds.
 * Returns null when the value is empty or not a valid time, so the caller can tell
 * "not filled in" from "0 seconds" -- `00:00:00` is a legitimate start time.
 */
function snippetTimeToSeconds(time: string | undefined | null): number | null {
	const match = SNIPPET_TIME_REGEX.exec((time || '').trim());

	if (!match) {
		return null;
	}
	const [, hours, minutes, seconds] = match;

	return (
		Number.parseInt(hours || '0', 10) * 3600 +
		Number.parseInt(minutes, 10) * 60 +
		Number.parseInt(seconds, 10)
	);
}

/**
 * Resolves the snippet an editor configured on a block element.
 * Only cut when both times are given and form a real interval: the media service needs an end
 * time to cut at all, so a start time on its own would silently play the whole object. An
 * invalid value parses to null and is treated as "not set", same as in the editor and the
 * player.
 */
function getSnipPoint(
	start: string | undefined,
	end: string | undefined
): { start?: number; end?: number } {
	const startSeconds = snippetTimeToSeconds(start);
	const endSeconds = snippetTimeToSeconds(end);

	if (startSeconds === null || endSeconds === null || endSeconds <= startSeconds) {
		return {};
	}

	return { start: startSeconds, end: endSeconds };
}

/** Content picker values are stored as strings, but tolerate a number coming back from the db */
function getSchemaIdentifier(mediaItem: { value?: string | number } | undefined): string | null {
	const value = mediaItem?.value;

	if (value === undefined || value === null || value === '') {
		return null;
	}

	return String(value);
}

/**
 * HETARCHIEF_VIDEO: a single ie-object with an optional editorial snippet, entered as
 * `startTime` / `endTime` in HH:MM:SS or MM:SS.
 */
function adaptHetArchiefVideoBlock(components: {
	mediaItem?: { value?: string };
	startTime?: string;
	endTime?: string;
}): PlayableDisplayDataItem[] {
	const schemaIdentifier = getSchemaIdentifier(components?.mediaItem);

	if (!schemaIdentifier) {
		return [null];
	}

	return [{ schemaIdentifier, ...getSnipPoint(components?.startTime, components?.endTime) }];
}

/**
 * HERO_CAROUSEL: one slide per element, each with an optional snippet entered as
 * `startTime` / `endTime`.
 */
function adaptHeroCarouselBlock(components: {
	elements?: { mediaItem?: { value?: string }; startTime?: string; endTime?: string }[];
}): PlayableDisplayDataItem[] {
	return (components?.elements || []).map((element) => {
		const schemaIdentifier = getSchemaIdentifier(element?.mediaItem);

		if (!schemaIdentifier) {
			return null;
		}

		return { schemaIdentifier, ...getSnipPoint(element?.startTime, element?.endTime) };
	});
}

/**
 * TIMELINE: one node per element, but only the nodes that show an ie-object, each with an optional
 * snippet entered as `startTime` / `endTime`.
 */
function adaptTimelineBlock(components: {
	elements?: {
		visualType?: string;
		mediaItem?: { value?: string };
		startTime?: string;
		endTime?: string;
	}[];
}): PlayableDisplayDataItem[] {
	return (components?.elements || []).map((node) => {
		const schemaIdentifier =
			node?.visualType === 'OBJECT' ? getSchemaIdentifier(node?.mediaItem) : null;

		if (!schemaIdentifier) {
			return null;
		}

		return { schemaIdentifier };
	});
}

/**
 * Converts the config of a content block into the list of objects to fetch playable display data
 * for, in the block's own element order.
 *
 * Deriving these from the stored block config -- instead of letting the client pass them -- is
 * what makes the snippet start/end times unforgeable: a client can only ever get a cut of an
 * object for which an editor actually configured that cut in a content block.
 *
 * Returns null for a block type that doesn't reference playable ie-objects.
 */
export function contentBlockToPlayableDisplayDataItems(
	contentBlock: DbContentBlock
): PlayableDisplayDataItem[] | null {
	// Content block configs are stored as free form json, so each adapter narrows it itself
	const components = contentBlock?.components as any;

	switch (contentBlock?.type as unknown as Lookup_App_Content_Block_Type_Enum) {
		case Lookup_App_Content_Block_Type_Enum.HetarchiefVideo:
			return adaptHetArchiefVideoBlock(components);

		case Lookup_App_Content_Block_Type_Enum.HeroCarousel:
			return adaptHeroCarouselBlock(components);

		case Lookup_App_Content_Block_Type_Enum.Timeline:
			return adaptTimelineBlock(components);

		default:
			return null;
	}
}
