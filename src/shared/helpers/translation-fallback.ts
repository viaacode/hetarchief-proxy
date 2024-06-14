import nlJson from '../i18n/locales/nl.json';

export function getTranslationFallback(
	key: string,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	variables: Record<string, string | number> = {}
): string {
	const translation = nlJson[key];
	if (translation) {
		return resolveTranslationVariables(translation, variables);
	}
	if (key.includes('___')) {
		return key.split('___')[1].replace('-', ' ') + ' ***';
	} else {
		return key + ' ***';
	}
}

export function resolveTranslationVariables(
	translation: string,
	variables?: Record<string, string | number>
): string {
	let resolvedTranslation = translation;
	Object.keys(variables || {}).forEach((variableName) => {
		resolvedTranslation = resolvedTranslation.replace(
			new RegExp(`{{${variableName}}}`, 'g'),
			String(variables[variableName])
		);
	});
	return resolvedTranslation;
}
