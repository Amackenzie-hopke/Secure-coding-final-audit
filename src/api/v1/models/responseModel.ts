export interface ApiResponse<T> {
	status: string; // "success" or "error"
	data?: T; // Optional data returned in case of success
	message?: string; // Informational message about the result
	error?: string; // Error message in case of failure
	code?: string; // Optional error code for debugging
}

export const successResponse = <T>(
	data?: T,
	message?: string
): ApiResponse<T> => ({
	status: "success",
	data,
	message,
});

export const errorResponse = (
	message: string,
	code?: string
): ApiResponse<null> => ({
	status: "error",
	message,
	code,
});
