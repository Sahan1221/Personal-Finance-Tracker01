import Transaction from "../models/Transaction.js";

// Add Transaction
export const addTransaction = async (req, res) => {
  const { amount, type, category, description, date } = req.body;
  if (!amount || !type || !category || !description || !date) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const transaction = await Transaction.create({
      userId: req.session.userId,
      amount,
      type,
      category,
      description,
      date,
    });
    res.status(200).json({ message: "Transaction added", transaction });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.session.userId });
    res.status(200).json({ transactions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Edit Transaction
export const editTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      req.body,
      { new: true }
    );
    if (!transaction) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Updated", transaction });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId,
    });
    if (!transaction) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
