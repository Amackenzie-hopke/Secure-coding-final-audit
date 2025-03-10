import request from "supertest";
import { Request, Response, NextFunction } from "express";
import app from "../src/app";
import {
    createLoanRequest,
    updateLoanReview,
    getAllLoans,
    approveUpdateLoan,
} from "../src/api/v1/controllers/loanControllers";

jest.mock("../src/api/v1/controllers/loanControllers", () => ({
    createLoanRequest: jest.fn((req, res) => res.status(200).send()),
    updateLoanReview: jest.fn((req, res) => res.status(201).send()),
    getAllLoans: jest.fn((req, res) => res.status(200).send()),
    approveUpdateLoan: jest.fn((req, res) => res.status(200).send()),
}));

jest.mock("../src/api/v1/middleware/authenticate", () => {
    return jest.fn((req: Request, res: Response, next: NextFunction) => next());
});

jest.mock("../src/api/v1/middleware/authorize", () => {
    return jest.fn(
        (options) => (req: Request, res: Response, next: NextFunction) => next()
    );
});

describe("loan Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/v1/loans", () => {
        it("should call createloanRequest controller", async () => {
            await request(app)
                .post("/api/v1/loans")
                .set("Authorization", "Bearer mockedToken");
            expect(createLoanRequest).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/loans/:id/review", () => {
        it("should call update review controller", async () => {
            const mockItem = {
                name: "Test loan",
                description: "Test Description",
            };

            await request(app)
                .put("/api/v1/loans/122/review")
                .set("Authorization", "Bearer mockedToken")
                .send(mockItem);
            expect(updateLoanReview).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/loans", () => {
        it("should call getAllLoans controller", async () => {
            const mockItem = {
                name: "Test Item",
                description: "Test Description",
            };


            await request(app)
                .get(`/api/v1/loans`)
                .set("Authorization", "Bearer mockedToken")
            expect(getAllLoans).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/loans/:id/approve", () => {
        it("should call approveUpdateLoan controller", async () => {
            await request(app)
                .put("/api/v1/loans/1/approve")
                .set("Authorization", "Bearer mockedToken");
            expect(approveUpdateLoan).toHaveBeenCalled();
        });
    });
});
