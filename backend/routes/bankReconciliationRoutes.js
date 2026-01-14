import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Bank Reconciliation Schema
const reconciliationSchema = new mongoose.Schema({
    ledgerEntry: {
        date: { type: Date, required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        type: { type: String, enum: ['Income', 'Expense'], required: true },
        reference: { type: String }
    },
    bankEntry: {
        date: { type: Date, required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        type: { type: String, enum: ['Credit', 'Debit'], required: true },
        reference: { type: String }
    },
    status: {
        type: String,
        enum: ['Matched', 'Unmatched Ledger', 'Unmatched Bank', 'Pending'],
        default: 'Pending'
    },
    matchScore: { type: Number, min: 0, max: 100 },
    notes: { type: String },
    reconciledAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

const Reconciliation = mongoose.model("Reconciliation", reconciliationSchema);

// ✅ POST route to upload and reconcile data
router.post("/upload-reconcile", async (req, res) => {
    try {
        const { ledgerData, bankData } = req.body;

        if (!ledgerData || !bankData || !Array.isArray(ledgerData) || !Array.isArray(bankData)) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        const reconciliationResults = [];

        // Simple reconciliation logic (can be enhanced)
        for (const ledgerEntry of ledgerData) {
            let bestMatch = null;
            let bestScore = 0;

            for (const bankEntry of bankData) {
                // Calculate match score based on amount and date proximity
                let score = 0;

                // Amount match (40 points)
                if (Math.abs(ledgerEntry.amount - bankEntry.amount) < 0.01) {
                    score += 40;
                }

                // Date proximity (30 points)
                const dateDiff = Math.abs(new Date(ledgerEntry.date) - new Date(bankEntry.date));
                const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
                if (daysDiff <= 1) score += 30;
                else if (daysDiff <= 3) score += 20;
                else if (daysDiff <= 7) score += 10;

                // Description similarity (30 points - simple check)
                const ledgerDesc = ledgerEntry.description?.toLowerCase() || '';
                const bankDesc = bankEntry.description?.toLowerCase() || '';
                if (ledgerDesc.includes(bankDesc.substring(0, 5)) ||
                    bankDesc.includes(ledgerDesc.substring(0, 5))) {
                    score += 30;
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = bankEntry;
                }
            }

            if (bestMatch && bestScore >= 70) {
                // Matched transaction
                reconciliationResults.push({
                    ledgerEntry,
                    bankEntry: bestMatch,
                    status: "Matched",
                    matchScore: bestScore
                });
            } else {
                // Unmatched ledger entry
                reconciliationResults.push({
                    ledgerEntry,
                    bankEntry: null,
                    status: "Unmatched Ledger",
                    matchScore: 0
                });
            }
        }

        // Find unmatched bank entries
        const matchedBankIds = reconciliationResults
            .filter(r => r.bankEntry)
            .map(r => r.bankEntry.id || r.bankEntry.description + r.bankEntry.amount);

        for (const bankEntry of bankData) {
            const bankId = bankEntry.id || bankEntry.description + bankEntry.amount;
            if (!matchedBankIds.includes(bankId)) {
                reconciliationResults.push({
                    ledgerEntry: null,
                    bankEntry,
                    status: "Unmatched Bank",
                    matchScore: 0
                });
            }
        }

        // Save results to database
        const savedResults = await Reconciliation.insertMany(reconciliationResults);

        // Calculate reconciliation summary
        const summary = {
            totalLedgerEntries: ledgerData.length,
            totalBankEntries: bankData.length,
            matchedEntries: reconciliationResults.filter(r => r.status === "Matched").length,
            unmatchedLedger: reconciliationResults.filter(r => r.status === "Unmatched Ledger").length,
            unmatchedBank: reconciliationResults.filter(r => r.status === "Unmatched Bank").length,
            reconciliationRate: ((reconciliationResults.filter(r => r.status === "Matched").length /
                Math.max(ledgerData.length, bankData.length)) * 100).toFixed(2)
        };

        res.status(200).json({
            message: "Reconciliation completed successfully",
            summary,
            results: savedResults
        });

    } catch (error) {
        console.error("Error during reconciliation:", error);
        res.status(500).json({ message: "Error processing reconciliation", error });
    }
});

// ✅ GET route to fetch reconciliation history
router.get("/history", async (req, res) => {
    try {
        const reconciliations = await Reconciliation.find()
            .sort({ reconciledAt: -1 })
            .limit(50);

        res.json(reconciliations);
    } catch (error) {
        console.error("Error fetching reconciliation history:", error);
        res.status(500).json({ message: "Error fetching reconciliation history", error });
    }
});

// ✅ GET route for reconciliation summary
router.get("/summary", async (req, res) => {
    try {
        const reconciliations = await Reconciliation.find();

        const summary = {
            totalReconciliations: reconciliations.length,
            matched: reconciliations.filter(r => r.status === "Matched").length,
            unmatchedLedger: reconciliations.filter(r => r.status === "Unmatched Ledger").length,
            unmatchedBank: reconciliations.filter(r => r.status === "Unmatched Bank").length,
            pending: reconciliations.filter(r => r.status === "Pending").length,
            averageMatchScore: reconciliations.reduce((sum, r) => sum + (r.matchScore || 0), 0) / reconciliations.length || 0
        };

        res.json(summary);
    } catch (error) {
        console.error("Error fetching reconciliation summary:", error);
        res.status(500).json({ message: "Error fetching reconciliation summary", error });
    }
});

// ✅ PUT route to update reconciliation status
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const reconciliation = await Reconciliation.findById(id);
        if (!reconciliation) {
            return res.status(404).json({ message: "Reconciliation entry not found" });
        }

        if (status) reconciliation.status = status;
        if (notes) reconciliation.notes = notes;

        await reconciliation.save();
        res.json({ message: "Reconciliation updated successfully", reconciliation });
    } catch (error) {
        console.error("Error updating reconciliation:", error);
        res.status(500).json({ message: "Error updating reconciliation", error });
    }
});

export default router;