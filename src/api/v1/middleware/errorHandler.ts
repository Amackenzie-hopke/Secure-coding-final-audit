import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../models/responseModel";

interface ExtendedError extends Error {
	code?: string; // Optional custom error code
	statusCode?: number; // HTTP status code for the error
}

const errorHandler = (
	err: ExtendedError,
	req: Request,
	res: Response,
	_next: NextFunction
): void => {
	const statusCode = err.statusCode || 500; // Default to 500 for unspecified errors
	const code = err.code || "UNKNOWN_ERROR"; // Default error code

	// Log the error for debugging purposes
	console.error(`Error: ${err.message} (Code: ${code})`);

	// Respond with a structured JSON error message
	res.status(statusCode).json(
		errorResponse("An unexpected error occurred. Please try again.", code)
	);
};

export default errorHandler;