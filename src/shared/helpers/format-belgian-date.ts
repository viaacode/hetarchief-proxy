import { formatInTimeZone } from 'date-fns-tz';

export function formatAsBelgianDate(date: string | Date, format = 'dd/MM/yyyy HH:mm'): string {
	let dateObj;
	if (typeof date === 'string') {
		dateObj = new Date(date);
	} else {
		dateObj = date;
	}
	return formatInTimeZone(dateObj, 'Europe/Brussels', format);
}
