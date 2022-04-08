export function commaSeparatedStringToArray(param: { value: string | string[] }) {
	if (typeof param.value === 'string') {
		return param.value.split(',');
	}
	return param.value;
}
