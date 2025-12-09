// routes/transactionRoutes.js
import express from "express";
import {
  addTransaction,
  getTransactions,
  editTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/add", addTransaction);
router.get("/get", getTransactions);
router.put("/edit/:id", editTransaction);
router.delete("/delete/:id", deleteTransaction);

export default router;
