export function commaSeparatedStringToArray(param: { value: string | string[] }) {
	if (typeof param.value === 'string') {
		if (param.value.length === 0) {
			return [];
		}
		return param.value.split(',');
	}
	return param.value;
}
