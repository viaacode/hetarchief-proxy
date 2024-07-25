export function customError(message: string, innerException: Error, additionalInfo: any): string {
	return JSON.stringify(
		{
			message,
			innerException,
			additionalInfo,
		},
		null,
		2
	);
}
