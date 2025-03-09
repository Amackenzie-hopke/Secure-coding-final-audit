import request from "supertest";
import { Request, Response, NextFunction } from "express";
import app from "../src/app";
import {
    getAllItems,
    createItem,
    updateItem,
    deleteItem,
} from "../src/api/v1/controllers/itemController";

jest.mock("../src/api/v1/controllers/itemController", () => ({
    getAllItems: jest.fn((req, res) => res.status(200).send()),
    createItem: jest.fn((req, res) => res.status(201).send()),
    updateItem: jest.fn((req, res) => res.status(200).send()),
    deleteItem: jest.fn((req, res) => res.status(200).send()),
}));

jest.mock("../src/api/v1/middleware/authenticate", () => {
    return jest.fn((req: Request, res: Response, next: NextFunction) => next());
});

jest.mock("../src/api/v1/middleware/authorize", () => {
    return jest.fn(
        (options) => (req: Request, res: Response, next: NextFunction) => next()
    );
});

describe("Item Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/items", () => {
        it("should call getAllItems controller", async () => {
            await request(app)
                .get("/api/v1/items")
                .set("Authorization", "Bearer mockedToken");
            expect(getAllItems).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/items", () => {
        it("should call createItem controller", async () => {
            const mockItem = {
                name: "Test Item",
                description: "Test Description",
            };

            await request(app)
                .post("/api/v1/items")
                .set("Authorization", "Bearer mockedToken")
                .send(mockItem);
            expect(createItem).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/items/:id", () => {
        it("should call updateItem controller", async () => {
            const mockItem = {
                name: "Test Item",
                description: "Test Description",
            };

            const mockId = 1;

            await request(app)
                .put(`/api/v1/items/${mockId}`)
                .set("Authorization", "Bearer mockedToken")
                .send(mockItem);
            expect(updateItem).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/items/:id", () => {
        it("should call deleteItem controller", async () => {
            await request(app)
                .delete("/api/v1/items/1")
                .set("Authorization", "Bearer mockedToken");
            expect(deleteItem).toHaveBeenCalled();
        });
    });
});
