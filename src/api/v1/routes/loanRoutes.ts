/*
/api/v1/loans POST -> Role: User

/api/v1/loans/:id/review PUT -> Officer

/api/v1/loans GET -> Officer, Manager

/api/v1/loans/:id/approve PUT -> Manager
*/
import { Router } from "express";

import {createLoanRequest,updateLoanReview,getAllLoans,approveUpdateLoan } from "../controllers/loanControllers";

const router = Router();


/**
 * @swagger
 * /api/v1/branches:
 *   post:
 *     summary: Create a new loan request
 *     description: Create a new loan request with user permisisions.
 *     responses:
 *       201:
 *         description: loan request created successfully
 *         content:
 *           application/json:
 *       500:
 *         description: Internal server error
 */
router.post("/", createLoanRequest);

export default router;
