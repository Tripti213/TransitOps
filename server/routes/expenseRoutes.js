import express from "express";
import {
    create_expense,
    get_expenses,
    get_expense,
    update_expense,
    delete_expense
} from "../controllers/expenseController.js";

const router=express.Router();

router.route("/").get(get_expenses).post(create_expense);

router.route("/:id").get(get_expense).put(update_expense).delete(delete_expense);

export default router;