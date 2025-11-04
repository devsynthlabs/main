import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Define Balance Sheet Schema - Updated to match Python file structure
const balanceSheetSchema = new mongoose.Schema({
  // Assets
  currentAssets: { type: Number, required: true, default: 0 },
  nonCurrentAssets: { type: Number, required: true, default: 0 },
  totalAssets: { type: Number, required: true, default: 0 },
  
  // Liabilities
  currentLiabilities: { type: Number, required: true, default: 0 },
  nonCurrentLiabilities: { type: Number, required: true, default: 0 },
  totalLiabilities: { type: Number, required: true, default: 0 },
  
  // Equity
  equity: { type: Number, required: true, default: 0 },
  
  // Results
  totalLiabilitiesEquity: { type: Number, required: true, default: 0 },
  balanced: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const BalanceSheet = mongoose.model("BalanceSheet", balanceSheetSchema);

// ✅ POST route — Save balance sheet data
router.post("/add", async (req, res) => {
  try {
    const balanceData = req.body;

    // Fill missing fields with 0 to avoid validation errors
    const dataToSave = {
      // Assets
      currentAssets: balanceData.currentAssets || 0,
      nonCurrentAssets: balanceData.nonCurrentAssets || 0,
      totalAssets: balanceData.totalAssets || 0,
      
      // Liabilities
      currentLiabilities: balanceData.currentLiabilities || 0,
      nonCurrentLiabilities: balanceData.nonCurrentLiabilities || 0,
      totalLiabilities: balanceData.totalLiabilities || 0,
      
      // Equity
      equity: balanceData.equity || 0,
      
      // Results
      totalLiabilitiesEquity: balanceData.totalLiabilitiesEquity || 0,
      balanced: balanceData.balanced || false,
    };

    const newBalance = new BalanceSheet(dataToSave);
    await newBalance.save();
    
    res.status(201).json({ 
      message: "Balance sheet saved successfully!",
      data: newBalance 
    });
  } catch (error) {
    console.error("Error saving balance sheet:", error);
    res.status(500).json({ 
      message: "Error saving balance sheet data", 
      error: error.message 
    });
  }
});

// ✅ GET route — Fetch all balance sheets
router.get("/", async (req, res) => {
  try {
    const sheets = await BalanceSheet.find().sort({ createdAt: -1 });
    res.status(200).json(sheets);
  } catch (error) {
    console.error("Error fetching balance sheets:", error);
    res.status(500).json({ 
      message: "Error fetching balance sheets", 
      error: error.message 
    });
  }
});

// ✅ GET route — Fetch balance sheet summary
router.get("/summary", async (req, res) => {
  try {
    const summary = await BalanceSheet.aggregate([
      {
        $group: {
          _id: null,
          totalAssets: { $sum: "$totalAssets" },
          totalLiabilities: { $sum: "$totalLiabilities" },
          totalEquity: { $sum: "$equity" },
          balancedCount: {
            $sum: { $cond: ["$balanced", 1, 0] }
          },
          totalRecords: { $sum: 1 }
        }
      }
    ]);

    res.json(summary[0] || {});
  } catch (error) {
    console.error("Error fetching balance sheet summary:", error);
    res.status(500).json({ 
      message: "Error fetching balance sheet summary", 
      error: error.message 
    });
  }
});

export default router;