import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";



const errorHandler = (
    err: Error | null,
    req: Request,
    res: Response,
    _next: NextFunction // Underscore prefix indicates this parameter is required but unused
): void => {
    if (!err) {
        console.error("Error: null or undefined error received");
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        return;
    }

    // Log the error message for debugging
    console.error(`Error: ${err.message}`);

    if (err instanceof AppError) {
        res.status(err.statusCode).json(errorResponse(err.message, err.code));
    } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
    }
};

export default errorHandler;