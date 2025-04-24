import { Request, Response, NextFunction } from "express";
import { RepositoryError, ServiceError } from "../src/api/v1/errors/errors";
import errorHandler from "../src/api/v1/middleware/errorHandler";
import { errorResponse } from "../src/api/v1/models/responseModel";

// Mock the console.error to avoid cluttering test output
console.error = jest.fn();

describe("Error Handler Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it("should handle RepositoryError with custom status code and error code", () => {
        // Arrange
        const testError = new RepositoryError(
            "Document not found",
            "DOCUMENT_NOT_FOUND",
            404
        );

        // Act
        errorHandler(
            testError,
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
            errorResponse("Document not found", "DOCUMENT_NOT_FOUND")
        );
        expect(console.error).toHaveBeenCalledWith("Error: Document not found");
    });

    it("should handle ServiceError with custom status code and error code", () => {
        // Arrange
        const testError = new ServiceError(
            "Invalid input",
            "INVALID_INPUT",
            400
        );

        // Act
        errorHandler(
            testError,
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(
            errorResponse("Invalid input", "INVALID_INPUT")
        );
    });

    it("should handle basic Error object with default status and code", () => {
        // Arrange
        const testError = new Error("Basic error");

        // Act
        errorHandler(
            testError,
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        expect(console.error).toHaveBeenCalledWith("Error: Basic error");
    });

    it("should handle malformed Error objects", () => {
        // Arrange
        const testError = {} as Error;

        // Act
        errorHandler(
            testError,
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        expect(console.error).toHaveBeenCalledWith("Error: undefined");
    });
    it("should handle null errors", () => {
        // Arrange
        const testError = null as any;

        // Act
        errorHandler(
            testError,
            mockReq as Request,
            mockRes as Response,
            mockNext
        );

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
            errorResponse("An unexpected error occurred", "UNKNOWN_ERROR")
        );
        expect(console.error).toHaveBeenCalledWith(
            "Error: null or undefined error received"
        );
    });
});