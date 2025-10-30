import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Define ProfitLoss schema
const profitLossSchema = new mongoose.Schema({
  revenue: { type: Number, required: true, default: 0 },
  costOfGoodsSold: { type: Number, required: true, default: 0 },
  operatingExpenses: { type: Number, required: true, default: 0 },
  otherIncome: { type: Number, required: true, default: 0 },
  taxes: { type: Number, required: true, default: 0 },
  netProfit: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const ProfitLoss = mongoose.model("ProfitLoss", profitLossSchema);

// ✅ POST route to store Profit & Loss data
router.post("/add", async (req, res) => {
  try {
    const plData = req.body;

    // Fill missing fields with 0 to avoid validation errors
    const dataToSave = {
      revenue: plData.revenue || 0,
      costOfGoodsSold: plData.costOfGoodsSold || 0,
      operatingExpenses: plData.operatingExpenses || 0,
      otherIncome: plData.otherIncome || 0,
      taxes: plData.taxes || 0,
      netProfit: plData.netProfit || 0,
    };

    const newPL = new ProfitLoss(dataToSave);
    await newPL.save();

    res.status(201).json({ message: "✅ Profit & Loss data saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving P&L data:", error);
    res.status(500).json({ message: "Error saving Profit & Loss data", error });
  }
});

export default router;
