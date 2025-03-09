import { Request, Response,NextFunction } from "express";
import { successResponse } from "../models/responseModel";


export const createLoanRequest = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
        console.log("create loan request received");
        res.status(201).json(
            successResponse(
                 "loan request received to system"
            ));
    } catch (error) {
        next(error);
    }
};

export const updateLoanReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log("Update loan review received");
        res.status(200).json(
            successResponse(
                "Loan review updated"
            ));
    } catch (error) {
        next(error);
    }
};

export const getAllLoans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log("Get all loans request received");
        res.status(200).json(
            successResponse(
                "Loans retrieved"
            ));
    } catch (error) {
        next(error);
    }
};


export const approveUpdateLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log("Approve loan request received");
        res.status(200).json(
            successResponse(
                "Loan approved"
            ));
    } catch (error) {
        next(error);
    }
};
