import express from "express";
import{
    get_expenses,
    get_expense,
    create_expense
}from "../controllers/expenseController.js";

const router=express.Router();

router.route("/")
.get(get_expenses)
.post(create_expense);

router.route("/:id")
.get(get_expense);

export default router;