import { JSEP_DIGIT_PREFIX } from '../elasticsearch/elasticsearch.consts';

import { describe, expect, it } from 'vitest';
import { decodeSearchterm, encodeSearchterm } from './encode-search-term';

describe('encode and decode search terms', () => {
	describe('encodeSearchterm', () => {
		it('should encode a searchterm number that contains digits', () => {
			expect(encodeSearchterm('3r0pr9jj7g')).toEqual(
				`${JSEP_DIGIT_PREFIX}3${JSEP_DIGIT_PREFIX}r${JSEP_DIGIT_PREFIX}0${JSEP_DIGIT_PREFIX}pr${JSEP_DIGIT_PREFIX}9${JSEP_DIGIT_PREFIX}jj${JSEP_DIGIT_PREFIX}7${JSEP_DIGIT_PREFIX}g`
			);
		});

		it("should return the same searchterm if the searchterm doesn't contain any digits", () => {
			expect(encodeSearchterm('rprjjg')).toEqual('rprjjg');
		});

		it('should return an empty string if the searchterm is an empty string', () => {
			expect(encodeSearchterm('')).toEqual('');
		});

		it('should return undefined if the searchterm is null', () => {
			expect(encodeSearchterm(null)).toEqual(undefined);
		});
	});

	describe('decodeSearchterm', () => {
		it('should return the original searchterm given an encoded searchterm that contains digits', () => {
			expect(
				decodeSearchterm(
					`${JSEP_DIGIT_PREFIX}3${JSEP_DIGIT_PREFIX}r${JSEP_DIGIT_PREFIX}0${JSEP_DIGIT_PREFIX}pr${JSEP_DIGIT_PREFIX}9${JSEP_DIGIT_PREFIX}jj${JSEP_DIGIT_PREFIX}7${JSEP_DIGIT_PREFIX}g`
				)
			).toEqual('3r0pr9jj7g');
		});

		it("should return the same searchterm if the encoded searchterm doesn't contain any digits", () => {
			expect(encodeSearchterm('rprjjg')).toEqual('rprjjg');
		});

		it('should return an empty string if the encoded searchterm is an empty string', () => {
			expect(encodeSearchterm('')).toEqual('');
		});

		it('should return undefined if the encoded searchterm is null', () => {
			expect(encodeSearchterm(null)).toEqual(undefined);
		});
	});
});
