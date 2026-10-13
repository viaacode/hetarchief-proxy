import { describe, expect, it } from 'vitest';
import { convertSrtToVtt, getSubtitleMimeType, isSubtitleMimeType } from './subtitles';

describe('subtitles helpers', () => {
	describe('isSubtitleMimeType', () => {
		it('accepts vtt and srt mime types', () => {
			expect(isSubtitleMimeType('text/vtt')).toBe(true);
			expect(isSubtitleMimeType('application/x-subrip')).toBe(true);
		});

		it('rejects other mime types', () => {
			expect(isSubtitleMimeType('video/mp4')).toBe(false);
			expect(isSubtitleMimeType(null)).toBe(false);
			expect(isSubtitleMimeType(undefined)).toBe(false);
		});
	});

	describe('getSubtitleMimeType', () => {
		it('returns the stored mime type when it is a subtitle type', () => {
			expect(getSubtitleMimeType({ ebucore_has_mime_type: 'text/srt' })).toBe('text/srt');
		});

		it('falls back to the file extension', () => {
			expect(
				getSubtitleMimeType({ ebucore_has_mime_type: null, premis_original_name: 'abc.VTT' })
			).toBe('text/vtt');
			expect(getSubtitleMimeType({ premis_stored_at: 'https://s3/bucket/abc.srt' })).toBe(
				'application/x-subrip'
			);
		});

		it('returns null for files that are not subtitles', () => {
			expect(getSubtitleMimeType({ ebucore_has_mime_type: 'video/mp4' })).toBeNull();
			expect(getSubtitleMimeType({ premis_stored_at: 'https://s3/bucket/abc.mp4' })).toBeNull();
		});
	});

	describe('convertSrtToVtt', () => {
		it('converts srt to vtt', () => {
			const srt =
				'1\r\n00:00:01,500 --> 00:00:03,000\r\nHallo, wereld\r\n\r\n2\r\n00:00:04,000 --> 00:00:05,250\r\nTot ziens\r\n';

			expect(convertSrtToVtt(srt)).toBe(
				'WEBVTT\n\n1\n00:00:01.500 --> 00:00:03.000\nHallo, wereld\n\n2\n00:00:04.000 --> 00:00:05.250\nTot ziens\n'
			);
		});

		it('leaves vtt content unchanged', () => {
			const vtt = 'WEBVTT\n\n00:00:01.500 --> 00:00:03.000\nHallo, wereld\n';

			expect(convertSrtToVtt(vtt)).toBe(vtt);
		});

		it('strips a byte order mark', () => {
			expect(convertSrtToVtt('﻿1\n00:00:01,000 --> 00:00:02,000\nHi\n')).toBe(
				'WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000\nHi\n'
			);
		});
	});
});
