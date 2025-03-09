jest.mock("../src/api/v1/services/itemService", () => ({
    getAllItems: jest.fn(),
    createItem: jest.fn(),
    updateItem: jest.fn(),
    deleteItem: jest.fn(),
}));

import { Request, Response, NextFunction } from "express";
import * as itemController from "../src/api/v1/controllers/itemController";
import * as itemService from "../src/api/v1/services/itemService";

jest.mock("../src/api/v1/services/itemService");

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

    describe("getAllItems", () => {
        it("should handle successful operation", async () => {
            const mockItems = [
                { id: "1", name: "Test Item", description: "Test Description" },
            ];

            (itemService.getAllItems as jest.Mock).mockResolvedValue(mockItems);

            await itemController.getAllItems(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Items Retrieved",
                data: mockItems,
                status: "success",
            });
        });
    });
});
