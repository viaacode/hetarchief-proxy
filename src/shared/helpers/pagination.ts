export class PaginationHelper {
	/**
	 * Convert page and size to offset and limit
	 */
	public static convertPagination(page: number, size: number): { offset: number; limit: number } {
		const offset = page > 0 ? (page - 1) * size : 0;
		return {
			offset,
			limit: size,
		};
	}
}
