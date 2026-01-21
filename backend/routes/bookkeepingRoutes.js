import express from "express";
import BookkeepingEntry from "../models/BookkeepingEntry.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify token (local definition since server.js isn't exporting it)
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

// ✅ POST route to add bookkeeping entry
router.post("/add", verifyToken, async (req, res) => {
    try {
        const { date, description, type, amount, category } = req.body;
        const newEntry = new BookkeepingEntry({
            userId: req.user.id,
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

// ✅ GET route to fetch all bookkeeping entries (for the logged-in user)
router.get("/all", verifyToken, async (req, res) => {
    try {
        const entries = await BookkeepingEntry.find({ userId: req.user.id }).sort({ date: -1 });

        // Calculate totals
        const totalIncome = entries
            .filter(entry => entry.type === 'income') // Note: model uses lowercase 'income'
            .reduce((sum, entry) => sum + entry.amount, 0);

        const totalExpenses = entries
            .filter(entry => entry.type === 'expense') // Note: model uses lowercase 'expense'
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
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntry = await BookkeepingEntry.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!deletedEntry) {
            return res.status(404).json({ message: "Entry not found or unauthorized" });
        }

        res.json({ message: "Entry deleted successfully", deletedEntry });
    } catch (error) {
        console.error("Error deleting bookkeeping entry:", error);
        res.status(500).json({ message: "Error deleting bookkeeping entry", error });
    }
});

// ✅ GET route for financial summary
router.get("/summary", verifyToken, async (req, res) => {
    try {
        const entries = await BookkeepingEntry.find({ userId: req.user.id });

        const totalIncome = entries
            .filter(entry => entry.type === 'income')
            .reduce((sum, entry) => sum + entry.amount, 0);

        const totalExpenses = entries
            .filter(entry => entry.type === 'expense')
            .reduce((sum, entry) => sum + entry.amount, 0);

        const netBalance = totalIncome - totalExpenses;

        // Category-wise breakdown
        const categoryBreakdown = entries.reduce((acc, entry) => {
            if (!acc[entry.category]) {
                acc[entry.category] = { income: 0, expenses: 0 };
            }
            if (entry.type === 'income') {
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