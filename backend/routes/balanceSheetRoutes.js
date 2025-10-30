import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Define Balance Sheet Schema
const balanceSheetSchema = new mongoose.Schema({
  currentAssets: { type: Number, required: true },
  nonCurrentAssets: { type: Number, required: true },
  totalAssets: { type: Number, required: true },
  currentLiabilities: { type: Number, required: true },
  nonCurrentLiabilities: { type: Number, required: true },
  totalLiabilities: { type: Number, required: true },
  equity: { type: Number, required: true },
  totalEquityLiabilities: { type: Number, required: true },
  balanced: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const BalanceSheet = mongoose.model("BalanceSheet", balanceSheetSchema);

// ✅ POST route — Save balance sheet data
router.post("/add", async (req, res) => {
  try {
    const newBalance = new BalanceSheet(req.body);
    await newBalance.save();
    res.status(201).json({ message: "Balance sheet saved successfully!" });
  } catch (error) {
    console.error("Error saving balance sheet:", error);
    res.status(500).json({ message: "Error saving balance sheet data", error: error.message });
  }
});

// ✅ GET route — Fetch all balance sheets
router.get("/", async (req, res) => {
  try {
    const sheets = await BalanceSheet.find().sort({ createdAt: -1 });
    res.status(200).json(sheets);
  } catch (error) {
    console.error("Error fetching balance sheets:", error);
    res.status(500).json({ message: "Error fetching balance sheets", error: error.message });
  }
});

export default router;
