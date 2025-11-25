const express = require('express');
const Transaction = require('../models/Transaction');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Add transaction
router.post('/add', requireAuth, async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    if (!amount || !type || !category || !date) return res.status(400).json({ error: 'Missing fields' });

    const t = new Transaction({
      userId: req.session.userId,
      amount,
      type,
      category,
      description: description || '',
      date: new Date(date)
    });

    await t.save();
    res.json({ message: 'Transaction added', transaction: t });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get transactions (optionally filter by month/category/type)
router.get('/get', requireAuth, async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;
    const filter = { userId: req.session.userId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (category) filter.category = category;
    if (type) filter.type = type;

    const items = await Transaction.find(filter).sort({ date: -1 });
    res.json({ transactions: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Edit
router.put('/edit/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const t = await Transaction.findOne({ _id: id, userId: req.session.userId });
    if (!t) return res.status(404).json({ error: 'Not found' });

    const fields = ['amount', 'type', 'category', 'description', 'date'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        t[f] = f === 'date' ? new Date(req.body[f]) : req.body[f];
      }
    });

    await t.save();
    res.json({ message: 'Updated', transaction: t });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete
router.delete('/delete/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await Transaction.findOneAndDelete({ _id: id, userId: req.session.userId });
    if (!removed) return res.status(404).json({ error: 'Not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
