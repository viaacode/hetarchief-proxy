import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';

const VALID_DURATION_REGEX = /^[0-9]+:[0-5][0-9]:[0-5][0-9](\.[0-9]+)?$/;

/**
 * Converts a formatted string to seconds
 * 12:23:12.765 => 44593
 * 12:23:12 => 44592
 * 23:12 => 1552
 * @param formattedDuration example: 12:23:12.765
 * @returns the number of seconds
 * @throws CustomError if the input is not a valid duration string
 */
export function formattedDurationToSeconds(formattedDuration: string): number {
	const error = new CustomError(
		'Invalid time string format in formattedStringToSeconds. Expected format: HH:MM:SS or MM:SS',
		null,
		{ timeString: formattedDuration }
	);
	if (!VALID_DURATION_REGEX.test(formattedDuration)) {
		throw error;
	}
	const parts = formattedDuration.split(':').map((text) => Number.parseFloat(text));

	if (parts.length === 3) {
		// Format is HH:MM:SS
		const [hours, minutes, seconds] = parts;
		return Math.round(hours * 3600 + minutes * 60 + seconds);
	}
	if (parts.length === 2) {
		// Format is MM:SS
		const [minutes, seconds] = parts;
		return Math.round(minutes * 60 + seconds);
	}

	throw error;
}
