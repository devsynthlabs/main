import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Financial Ratios Schema
const financialRatiosSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  period: { type: String, required: true },
  currentAssets: { type: Number, required: true },
  currentLiabilities: { type: Number, required: true },
  totalAssets: { type: Number, required: true },
  totalLiabilities: { type: Number, required: true },
  equity: { type: Number, required: true },
  totalEquity: { type: Number, required: true },
  revenue: { type: Number, required: true },
  expenses: { type: Number, required: true },
  netIncome: { type: Number, required: true },
  totalDebt: { type: Number, required: true },
  sharesOutstanding: { type: Number, required: true },
  inventory: { type: Number, required: true },
  ratios: {
    currentRatio: Number,
    debtToEquity: Number,
    debtRatio: Number,
    quickRatio: Number,
    grossProfitMargin: Number,
    netProfitMargin: Number,
    roe: Number,
    roa: Number,
    assetsTurnover: Number,
    eps: Number
  },
  createdAt: { type: Date, default: Date.now },
});

const FinancialRatios = mongoose.model("FinancialRatios", financialRatiosSchema);

// POST route to calculate and store financial ratios
router.post("/calculate", async (req, res) => {
  try {
    const financialData = req.body;
    
    // Calculate ratios
    const ratios = {
      currentRatio: financialData.currentLiabilities ? financialData.currentAssets / financialData.currentLiabilities : 0,
      debtToEquity: financialData.totalEquity ? financialData.totalDebt / financialData.totalEquity : 0,
      debtRatio: financialData.totalAssets ? financialData.totalDebt / financialData.totalAssets : 0,
      quickRatio: financialData.currentLiabilities ? (financialData.currentAssets - financialData.inventory) / financialData.currentLiabilities : 0,
      grossProfitMargin: financialData.revenue ? ((financialData.revenue - financialData.expenses) / financialData.revenue) * 100 : 0,
      netProfitMargin: financialData.revenue ? (financialData.netIncome / financialData.revenue) * 100 : 0,
      roe: financialData.totalEquity ? (financialData.netIncome / financialData.totalEquity) * 100 : 0,
      roa: financialData.totalAssets ? (financialData.netIncome / financialData.totalAssets) * 100 : 0,
      assetsTurnover: financialData.totalAssets ? financialData.revenue / financialData.totalAssets : 0,
      eps: financialData.sharesOutstanding ? financialData.netIncome / financialData.sharesOutstanding : 0,
    };

    const financialRecord = new FinancialRatios({
      ...financialData,
      ratios: ratios
    });

    await financialRecord.save();
    res.status(201).json({ 
      message: "Financial ratios calculated and saved successfully!",
      ratios: ratios
    });
  } catch (error) {
    console.error("Error calculating financial ratios:", error);
    res.status(500).json({ message: "Error calculating financial ratios", error });
  }
});

// GET route to fetch financial ratios history
router.get("/history", async (req, res) => {
  try {
    const financialRatios = await FinancialRatios.find().sort({ createdAt: -1 });
    res.json(financialRatios);
  } catch (error) {
    console.error("Error fetching financial ratios:", error);
    res.status(500).json({ message: "Error fetching financial ratios" });
  }
});

// GET route to fetch specific financial ratios by ID
router.get("/:id", async (req, res) => {
  try {
    const financialRatio = await FinancialRatios.findById(req.params.id);
    if (!financialRatio) {
      return res.status(404).json({ message: "Financial ratios record not found" });
    }
    res.json(financialRatio);
  } catch (error) {
    console.error("Error fetching financial ratios:", error);
    res.status(500).json({ message: "Error fetching financial ratios" });
  }
});

export default router;