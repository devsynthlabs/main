import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Bookkeeping Schema
const bookkeepingSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Income', 'Expenses'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: 'General' },
    createdAt: { type: Date, default: Date.now },
});

const Bookkeeping = mongoose.model("Bookkeeping", bookkeepingSchema);

// ✅ POST route to add bookkeeping entry
router.post("/add", async (req, res) => {
    try {
        const { date, description, type, amount, category } = req.body;
        const newEntry = new Bookkeeping({
            date: new Date(date),
            description,
            type,
            amount,
            category
        });
        await newEntry.save();
        res.status(201).json({
            message: "Bookkeeping entry saved successfully!",
            entry: newEntry
        });
    } catch (error) {
        console.error("Error saving bookkeeping entry:", error);
        res.status(500).json({ message: "Error saving bookkeeping entry", error });
    }
});

// ✅ GET route to fetch all bookkeeping entries
router.get("/all", async (req, res) => {
    try {
        const entries = await Bookkeeping.find().sort({ date: -1 });

        // Calculate totals
        const totalIncome = entries
            .filter(entry => entry.type === 'Income')
            .reduce((sum, entry) => sum + entry.amount, 0);

        const totalExpenses = entries
            .filter(entry => entry.type === 'Expenses')
            .reduce((sum, entry) => sum + entry.amount, 0);

        const netBalance = totalIncome - totalExpenses;

        res.json({
            entries,
            summary: {
                totalIncome,
                totalExpenses,
                netBalance,
                entryCount: entries.length
            }
        });
    } catch (error) {
        console.error("Error fetching bookkeeping data:", error);
        res.status(500).json({ message: "Error fetching bookkeeping data" });
    }
});

// ✅ DELETE route to remove an entry
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntry = await Bookkeeping.findByIdAndDelete(id);

        if (!deletedEntry) {
            return res.status(404).json({ message: "Entry not found" });
        }

        res.json({ message: "Entry deleted successfully", deletedEntry });
    } catch (error) {
        console.error("Error deleting bookkeeping entry:", error);
        res.status(500).json({ message: "Error deleting bookkeeping entry", error });
    }
});

// ✅ GET route for financial summary
router.get("/summary", async (req, res) => {
    try {
        const entries = await Bookkeeping.find();

        const totalIncome = entries
            .filter(entry => entry.type === 'Income')
            .reduce((sum, entry) => sum + entry.amount, 0);

        const totalExpenses = entries
            .filter(entry => entry.type === 'Expenses')
            .reduce((sum, entry) => sum + entry.amount, 0);

        const netBalance = totalIncome - totalExpenses;

        // Category-wise breakdown
        const categoryBreakdown = entries.reduce((acc, entry) => {
            if (!acc[entry.category]) {
                acc[entry.category] = { income: 0, expenses: 0 };
            }
            if (entry.type === 'Income') {
                acc[entry.category].income += entry.amount;
            } else {
                acc[entry.category].expenses += entry.amount;
            }
            return acc;
        }, {});

        res.json({
            summary: {
                totalIncome,
                totalExpenses,
                netBalance,
                entryCount: entries.length
            },
            categoryBreakdown
        });
    } catch (error) {
        console.error("Error generating summary:", error);
        res.status(500).json({ message: "Error generating financial summary", error });
    }
});

export default router;