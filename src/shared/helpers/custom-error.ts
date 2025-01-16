export function customError(message: string, innerException: Error, additionalInfo: any): string {
	const singleLineLogging = process.env.SINGLE_LINE_LOGGING === 'true';
	return JSON.stringify(
		{
			message,
			innerException,
			additionalInfo,
		},
		null,
		singleLineLogging ? undefined : 2
	);
}
