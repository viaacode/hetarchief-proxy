import translations from './src/shared/i18n/locales/nl.json';

const t = (key: string, variables: Record<string, string>) => {
	let output = translations[key];
	if (!output) {
		return key.split('___')[1].replace('-', ' ') + ' ***';
	}
	Object.keys(variables || {}).forEach((variableName) => {
		output = output.replace(`{{${variableName}}}`, variables[variableName]);
	});
	return output;
};

jest.mock('~shared/i18n', () => ({
	t,
}));
