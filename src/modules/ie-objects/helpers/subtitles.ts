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
 * Decodes subtitle file bytes: UTF-16 when there is a byte order mark, UTF-8 when valid, otherwise windows-1252
 * (legacy SRT files are often saved in that encoding).
 */
export const decodeSubtitleBytes = (bytes: Uint8Array): string => {
	if (bytes[0] === 0xff && bytes[1] === 0xfe) {
		return new TextDecoder('utf-16le').decode(bytes);
	}
	if (bytes[0] === 0xfe && bytes[1] === 0xff) {
		return new TextDecoder('utf-16be').decode(bytes);
	}
	try {
		return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
	} catch {
		return new TextDecoder('windows-1252').decode(bytes);
	}
};

/**
 * Converts SRT subtitles to WebVTT. Content that already is WebVTT is returned unchanged.
 */
export const convertSrtToVtt = (content: string): string => {
	const normalized = content.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
	if (normalized.trimStart().startsWith('WEBVTT')) {
		return normalized;
	}

	// SRT uses a comma as millisecond separator, WebVTT a dot. Only touch the two timestamps of a timing line,
	// not cue text (which can contain an arrow or a comma-timestamp itself).
	const converted = normalized
		// Trimming also empties whitespace-only lines, which would not end a WebVTT cue (only an empty line does).
		.replace(/^[ \t]+|[ \t]+$/gm, '')
		.replace(
			/^(\s*(?:\d+:)?\d{1,2}:\d{2}),(\d{3}\s*-->\s*(?:\d+:)?\d{1,2}:\d{2}),(\d{3})/gm,
			'$1.$2.$3'
		);

	// Legacy brace markup: {i}/{\i1} open and {/i}/{\i} close an i/b/u tag. {\an7-9} (top position) is a cue
	// setting in WebVTT, so it moves to the end of the timing line. Other {\anN} alignments are dropped.
	const withTags = converted
		.replace(/\{\\([ibu])\}/g, '</$1>')
		.replace(/\{\\([ibu])1\}/g, '<$1>')
		.replace(/\{([ibu])\}/g, '<$1>')
		.replace(/\{\/([ibu])\}/g, '</$1>')
		.replace(/^([^\n]*\d\s*-->[^\n]*)\n\{\\an[789]\}/gm, '$1 line:5%\n')
		.replace(/\{\\an[1-9]\}/g, '');
	return `WEBVTT\n\n${withTags}`;
};
