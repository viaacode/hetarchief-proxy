import type { Locale } from '~shared/types/types';

export function getTemplateEnvVarName(template: string, language: Locale): string {
	return `${template.toUpperCase()}__${language.toUpperCase()}`;
}

export function getTemplateId(template: string, language: Locale): string | undefined {
	const envVarName = getTemplateEnvVarName(template, language);
	return process.env[envVarName];
}
