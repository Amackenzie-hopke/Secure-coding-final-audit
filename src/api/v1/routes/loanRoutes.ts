/*
/api/v1/loans POST -> Role: User (GLOBAL = all roles)

/api/v1/loans/:id/review PUT -> Officer

/api/v1/loans GET -> Officer, Manager

/api/v1/loans/:id/approve PUT -> Manager
*/
import express,{ Router } from "express";

import {createLoanRequest,updateLoanReview,getAllLoans,approveUpdateLoan } from "../controllers/loanControllers";

import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { auth } from "config/firebaseConfig";


const router: Router = express.Router();


/**
 * @swagger
 * /api/v1/loans:
 *   post:
 *     summary: Create a new loan request
 *     description: Create a new loan request (Available to all users)
 *     tags: [Loans]
 *     responses:
 *       201:
 *         description: Loan request created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/",authenticate, createLoanRequest);

/**
 * @swagger
 * /api/v1/loans/{id}/review:
 *   put:
 *     summary: Review a loan request
 *     description: Update loan review status (Officer only)
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: Loan review updated successfully
 *       404:
 *         description: Loan not found
 *       500:
 *         description: Internal server error
 */
router.put(
    "/:id/review",
    authenticate,
    isAuthorized({ hasRole:["officer"]}),
    updateLoanReview
);

/**
 * @swagger
 * /api/v1/loans:
 *   get:
 *     summary: Get all loans
 *     description: Retrieve all loans (Officer and Manager only)
 *     tags: [Loans]
 *     responses:
 *       200:
 *         description: List of all loans
 *       403:
 *         description: Forbidden access
 *       500:
 *         description: Internal server error
 */
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole:["manager","officer"],allowSameUser: true}),
    getAllLoans
);


/**
 * @swagger
 * /api/v1/loans/{id}/approve:
 *   put:
 *     summary: Approve a loan
 *     description: Approve or reject a loan request (Manager only)
 *     tags: [Loans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: Loan status updated successfully
 *       404:
 *         description: Loan not found
 *       403:
 *         description: Forbidden access
 *       500:
 *         description: Internal server error
 */
router.put(
    "/:id/approve",
    authenticate,
    isAuthorized({hasRole: ["manager"],allowSameUser: true }) ,
    approveUpdateLoan
);

export default router;
