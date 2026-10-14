import { describe, expect, it } from 'vitest';
import {
	convertSrtToVtt,
	decodeSubtitleBytes,
	getSubtitleMimeType,
	isSubtitleMimeType,
} from './subtitles';

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

		it('only converts the timestamps of a timing line, not cue text', () => {
			expect(
				convertSrtToVtt('1\n00:00:01,000 --> 00:00:02,500\nA --> B, om 10:30:45,123 uur\n')
			).toBe('WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.500\nA --> B, om 10:30:45,123 uur\n');
		});

		it('converts timestamps without hours and keeps cue settings', () => {
			expect(convertSrtToVtt('1\n01:02,500 --> 01:03,000 X1:100 X2:200\nHi\n')).toBe(
				'WEBVTT\n\n1\n01:02.500 --> 01:03.000 X1:100 X2:200\nHi\n'
			);
		});

		it('converts legacy brace tags', () => {
			expect(
				convertSrtToVtt('1\n00:00:01,000 --> 00:00:02,000\n{i}Hallo{/i} {b}x{\\b} {\\u1}y{\\u}\n')
			).toBe('WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000\n<i>Hallo</i> <b>x</b> <u>y</u>\n');
		});

		it('moves {\\an8} to a cue setting on the timing line', () => {
			expect(
				convertSrtToVtt('1\n00:00:01,000 --> 00:00:02,000\n{\\an8}Boven\nTweede regel\n')
			).toBe('WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000 line:5%\nBoven\nTweede regel\n');
		});

		it('moves {\\an7} and {\\an9} to a cue setting too', () => {
			expect(convertSrtToVtt('1\n00:00:01,000 --> 00:00:02,000\n{\\an9}Rechtsboven\n')).toBe(
				'WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000 line:5%\nRechtsboven\n'
			);
		});

		it('drops other {\\anN} alignments from the cue text', () => {
			expect(convertSrtToVtt('1\n00:00:01,000 --> 00:00:02,000\n{\\an2}Onder\n')).toBe(
				'WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000\nOnder\n'
			);
		});

		it('treats a whitespace-only line as a cue separator', () => {
			expect(
				convertSrtToVtt(
					'1\n00:00:01,000 --> 00:00:02,000\nA\n \t\n2\n00:00:03,000 --> 00:00:04,000\nB\n'
				)
			).toBe(
				'WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000\nA\n\n2\n00:00:03.000 --> 00:00:04.000\nB\n'
			);
		});

		it('trims leading and trailing whitespace from every line', () => {
			expect(convertSrtToVtt('1\n  00:00:01,000 --> 00:00:02,000 \n  Hi there  \n')).toBe(
				'WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000\nHi there\n'
			);
		});

		it('strips a byte order mark', () => {
			expect(convertSrtToVtt('﻿1\n00:00:01,000 --> 00:00:02,000\nHi\n')).toBe(
				'WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000\nHi\n'
			);
		});
	});

	describe('decodeSubtitleBytes', () => {
		it('decodes utf-8', () => {
			expect(decodeSubtitleBytes(Buffer.from('Café', 'utf-8'))).toBe('Café');
		});

		it('decodes utf-16 with a byte order mark', () => {
			expect(decodeSubtitleBytes(Buffer.from('\uFEFFCafé', 'utf16le'))).toBe('Café');
		});

		it('falls back to windows-1252 when the bytes are not valid utf-8', () => {
			expect(decodeSubtitleBytes(Uint8Array.from([0x43, 0x61, 0x66, 0xe9]))).toBe('Café');
		});
	});
});
