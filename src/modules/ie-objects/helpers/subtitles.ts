import {
	IE_OBJECT_SUBTITLE_MIME_TYPES,
	SUBTITLE_SRT_MIME_TYPE,
	SUBTITLE_VTT_MIME_TYPE,
} from '../ie-objects.conts';

export const isSubtitleMimeType = (mimeType: string | null | undefined): boolean =>
	IE_OBJECT_SUBTITLE_MIME_TYPES.includes(mimeType);

/**
 * The stored mime type when it is a known subtitle type, otherwise derived from the file extension.
 * Returns null when the file is not a subtitle file.
 */
export const getSubtitleMimeType = (file: {
	ebucore_has_mime_type?: string | null;
	premis_original_name?: string | null;
	premis_stored_at?: string | null;
}): string | null => {
	if (isSubtitleMimeType(file.ebucore_has_mime_type)) {
		return file.ebucore_has_mime_type;
	}

	const name = (file.premis_original_name || file.premis_stored_at || '').toLowerCase();
	if (name.endsWith('.vtt')) {
		return SUBTITLE_VTT_MIME_TYPE;
	}
	if (name.endsWith('.srt')) {
		return SUBTITLE_SRT_MIME_TYPE;
	}
	return null;
};

/**
 * Converts SRT subtitles to WebVTT. Content that already is WebVTT is returned unchanged.
 */
export const convertSrtToVtt = (content: string): string => {
	const normalized = content.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
	if (normalized.trimStart().startsWith('WEBVTT')) {
		return normalized;
	}

	// SRT uses a comma as millisecond separator, WebVTT a dot. Only touch the timing lines, not the cue text.
	const converted = normalized.replace(/^.*-->.*$/gm, (line) => line.replace(/,/g, '.'));
	return `WEBVTT\n\n${converted}`;
};
