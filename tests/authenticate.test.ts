import { Request, Response, NextFunction, response } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { auth } from "../config/firebaseConfig";
import { AuthenticationError } from "../src/api/v1/errors/errors";

// Mock Firebase auth
jest.mock("../config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
        getUser: jest.fn(),
    },
}));

describe("authenticate middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        // Arrange (common setup)
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            locals: {},
        };
        nextFunction = jest.fn();
    });

    it("should call next with error when no token is provided", async () => {

        // Arrange/Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );
        expect(nextFunction.mock.calls[0][0].statusCode).toBe(401);    
    });

    it("should call next() when token is valid", async () => {
        // Setup
        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };

        // Mock successful verification
        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
            uid: "test-uid",
            role: "admin",
        });

        // Execute
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Verify
        expect(auth.verifyIdToken).toHaveBeenCalledWith("valid-token");
        expect(mockResponse.locals).toEqual({
            uid: "test-uid",
            role: "admin",
        });
        expect(nextFunction).toHaveBeenCalled();
    });

    it("should call next with error when token verification fails", async () => {
        // Arrange
        mockRequest.headers = {
            authorization: "Bearer invalid-token",
        };
    
        // Mock failed verification
        (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(
            new Error("Invalid token")
        );
    
        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );
    
        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );
        expect(nextFunction.mock.calls[0][0].statusCode).toBe(401);
    });
});