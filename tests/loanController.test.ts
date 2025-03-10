
import { Request, Response, NextFunction } from "express";
import * as itemController from "../src/api/v1/controllers/loanControllers";


describe("Item Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockNext = jest.fn();
    });

    import { Request, Response, NextFunction } from "express";
    import * as loanController from "../src/api/v1/controllers/loanControllers";
    import * as loanService from "../src/api/v1/services/loanServices";
    
    // Mock the service
    jest.mock("../src/api/v1/services/loanServices");
    
    describe("Loan Controller", () => {
        let mockReq: Partial<Request>;
        let mockRes: Partial<Response>;
        let mockNext: NextFunction;
    
        beforeEach(() => {
            jest.clearAllMocks();
            mockReq = { params: {}, body: {} };
            mockRes = { 
                status: jest.fn().mockReturnThis(), 
                json: jest.fn(),
                locals: { uid: "test-user-id" } 
            };
            mockNext = jest.fn();
        });
    
        describe("getAllLoans", () => {
            it("should handle successful operation", async () => {
                const mockLoans = [
                    { id: "1", amount: 5000, userId: "test-user-id", status: "pending" },
                    { id: "2", amount: 10000, userId: "test-user-id", status: "reviewed" }
                ];
    
                // Fix the mock setup
                (loanService.getAllLoans as jest.Mock).mockResolvedValue(mockLoans);
    
                await loanController.getAllLoans(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
    
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: "Loans Retrieved",
                    data: mockLoans,
                    status: "success",
                });
            });
    
            it("should handle errors", async () => {
                // Mock a service error
                const error = new Error("Database error");
                (loanService.getAllLoans as jest.Mock).mockRejectedValue(error);
    
                await loanController.getAllLoans(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
    
                // Should pass error to next middleware
                expect(mockNext).toHaveBeenCalledWith(error);
            });
        });
    });
