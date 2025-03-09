import { Request, Response, NextFunction } from "express";
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
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            locals: {},
        };
        nextFunction = jest.fn();
    });

    it("should call next with error when no token is provided", async () => {
        // Execute
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Verify
        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );
        expect(nextFunction.mock.calls[0][0].message).toBe("Unauthorized: No token provided");
    });

    it("should call next() when token is valid", async () => {
        // Setup
        const mockUid = "test-uid";
        const mockCustomClaims = { role: "admin" };
        
        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };

        // Mock successful verification
        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
            uid: mockUid
        });
        
        // Mock getUser response
        (auth.getUser as jest.Mock).mockResolvedValueOnce({
            uid: mockUid,
            customClaims: mockCustomClaims
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
            uid: mockUid,
            customClaims: mockCustomClaims
        });
        expect(nextFunction).toHaveBeenCalled();
        expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should call next with error when token verification fails", async () => {
        // Setup
        mockRequest.headers = {
            authorization: "Bearer invalid-token",
        };

        // Mock failed verification
        (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(
            new Error("Invalid token")
        );

        // Execute
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Verify
        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );
    });
});
