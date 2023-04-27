import { decodeSearchterm, encodeSearchterm } from './encode-search-term';

describe('encode and decode search terms', () => {
	describe('encodeSearchterm', () => {
		it('should encode a searchterm number that contains digits', () => {
			expect(encodeSearchterm('3r0pr9jj7g')).toEqual(
				'_ç_ç_ç_ç_ç_3_ç_ç_ç_ç_ç_r_ç_ç_ç_ç_ç_0_ç_ç_ç_ç_ç_pr_ç_ç_ç_ç_ç_9_ç_ç_ç_ç_ç_jj_ç_ç_ç_ç_ç_7_ç_ç_ç_ç_ç_g'
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
					'_ç_ç_ç_ç_ç_3_ç_ç_ç_ç_ç_r_ç_ç_ç_ç_ç_0_ç_ç_ç_ç_ç_pr_ç_ç_ç_ç_ç_9_ç_ç_ç_ç_ç_jj_ç_ç_ç_ç_ç_7_ç_ç_ç_ç_ç_g'
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
