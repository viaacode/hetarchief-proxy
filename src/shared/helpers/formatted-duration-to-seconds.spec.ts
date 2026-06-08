import { describe, expect, it } from 'vitest';
import { formattedDurationToSeconds } from './formatted-duration-to-seconds';

describe('formattedDurationToSeconds', () => {
	it('converts 00:00:00 to 0 seconds', () => {
		expect(formattedDurationToSeconds('00:00:00')).toBe(0);
	});

	it('converts seconds only', () => {
		expect(formattedDurationToSeconds('00:00:45')).toBe(45);
	});

	it('converts minutes and seconds', () => {
		expect(formattedDurationToSeconds('00:01:30')).toBe(90);
	});

	it('converts hours, minutes and seconds', () => {
		expect(formattedDurationToSeconds('12:23:12')).toBe(44592);
	});

	it('converts a full hour', () => {
		expect(formattedDurationToSeconds('01:00:00')).toBe(3600);
	});

	it('converts multiple hours', () => {
		expect(formattedDurationToSeconds('24:00:00')).toBe(86400);
	});

	it('handles maximum values within a day', () => {
		expect(formattedDurationToSeconds('23:59:59')).toBe(86399);
	});

	it('converts seconds with decimals (round down)', () => {
		expect(formattedDurationToSeconds('12:23:06.345')).toBe(44586);
	});

	it('converts seconds with decimals (round up)', () => {
		expect(formattedDurationToSeconds('12:23:06.745')).toBe(44587);
	});

	describe('invalid input', () => {
		it('throws for an empty string', () => {
			expect(() => formattedDurationToSeconds('')).toThrow();
		});

		it('throws for missing sections', () => {
			expect(() => formattedDurationToSeconds('12:34')).toThrow();
		});

		it('throws for too many sections', () => {
			expect(() => formattedDurationToSeconds('12:34:56:78')).toThrow();
		});

		it('throws for non-numeric values', () => {
			expect(() => formattedDurationToSeconds('aa:bb:cc')).toThrow();
		});

		it('throws for malformed values', () => {
			expect(() => formattedDurationToSeconds('12:ab:34')).toThrow();
		});
	});
});
