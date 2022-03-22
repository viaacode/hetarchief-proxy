import { formatInTimeZone, OptionsWithTZ } from 'date-fns-tz';
import { nlBE } from 'date-fns/locale';

export function formatAsBelgianDate(
	date: string | Date,
	format = 'dd/MM/yyyy HH:mm',
	options: OptionsWithTZ = { locale: nlBE }
): string {
	let dateObj;
	if (typeof date === 'string') {
		dateObj = new Date(date + (date.toLocaleLowerCase().endsWith('z') ? '' : 'Z'));
	} else {
		dateObj = date;
	}
	return formatInTimeZone(dateObj, 'Europe/Brussels', format, options);
}
