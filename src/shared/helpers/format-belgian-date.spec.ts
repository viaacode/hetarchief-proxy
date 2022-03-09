import { formatAsBelgianDate } from '~shared/helpers/format-belgian-date';

describe('formatAsBelgianDate', () => {
	it('should format a date string as a belgian date', () => {
		const converted = formatAsBelgianDate('2022-03-04T14:10:23.754Z');
		expect(converted).toBe('04/03/2022 15:10');
	});

	it('should format a date object as a belgian date', () => {
		const converted = formatAsBelgianDate(new Date('2022-03-04T14:10:23.754Z'));
		expect(converted).toBe('04/03/2022 15:10');
	});
});
