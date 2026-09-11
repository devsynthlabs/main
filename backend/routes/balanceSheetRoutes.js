import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { getLiveBalanceSheet } from "../utils/financeAggregator.js";
import { runPythonCalculation } from "../utils/pythonBridge.js";

const router = express.Router();

const verifyTokenOptional = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_jwt_secret_2024_finance_app";

  if (!token || token === "null" || token === "undefined") {
    req.user = { id: "000000000000000000000000" };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    req.user = { id: "000000000000000000000000" };
    next();
  }
};

// ✅ Define Balance Sheet Schema - Updated to match Python file structure
const balanceSheetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: { type: String },
  financialYear: { type: String },
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
  breakdown: {
    assets: {
      currentAssets: [{ label: String, value: Number }],
      nonCurrentAssets: [{ label: String, value: Number }],
    },
    liabilities: {
      currentLiabilities: [{ label: String, value: Number }],
      nonCurrentLiabilities: [{ label: String, value: Number }],
    },
    equity: [{ label: String, value: Number }],
  },
  createdAt: { type: Date, default: Date.now },
});

const BalanceSheet = mongoose.model("BalanceSheet", balanceSheetSchema);

// ✅ POST route — Save balance sheet data
router.post("/add", verifyTokenOptional, async (req, res) => {
  try {
    const balanceData = req.body;

    let pyResult = null;
    try {
      pyResult = await runPythonCalculation("balance_sheet.calculate", {
        cashAndBank: balanceData.currentAssets || 0,
        accountsReceivable: 0,
        inventory: 0,
        fixedAssets: balanceData.nonCurrentAssets || 0,
        accountsPayable: balanceData.currentLiabilities || 0,
        nonCurrentLiabilities: balanceData.nonCurrentLiabilities || 0,
        ownerEquity: balanceData.equity || 0
      });
    } catch (pyErr) {
      console.warn("⚠️ Python balance sheet calculation failed, falling back:", pyErr.message);
    }

    const currentAssets = balanceData.currentAssets || 0;
    const nonCurrentAssets = balanceData.nonCurrentAssets || 0;
    const totalAssets = pyResult ? pyResult.assets.totalAssets : (currentAssets + nonCurrentAssets);

    const currentLiabilities = balanceData.currentLiabilities || 0;
    const nonCurrentLiabilities = balanceData.nonCurrentLiabilities || 0;
    const totalLiabilities = pyResult ? pyResult.liabilities.totalLiabilities : (currentLiabilities + nonCurrentLiabilities);

    const equity = pyResult ? pyResult.equity.totalEquity : (balanceData.equity || 0);
    const totalLiabilitiesEquity = pyResult ? pyResult.totalLiabilitiesEquity : (totalLiabilities + equity);
    const balanced = pyResult ? pyResult.balanced : (Math.abs(totalAssets - totalLiabilitiesEquity) < 1);

    const dataToSave = {
      userId: req.user ? req.user.id : undefined,
      companyName: balanceData.companyName || "",
      financialYear: balanceData.financialYear || "",
      // Assets
      currentAssets: currentAssets,
      nonCurrentAssets: nonCurrentAssets,
      totalAssets: totalAssets,
      
      // Liabilities
      currentLiabilities: currentLiabilities,
      nonCurrentLiabilities: nonCurrentLiabilities,
      totalLiabilities: totalLiabilities,
      
      // Equity
      equity: equity,
      
      // Results
      totalLiabilitiesEquity: totalLiabilitiesEquity,
      balanced: balanced,
      breakdown: balanceData.breakdown || {
        assets: { currentAssets: [], nonCurrentAssets: [] },
        liabilities: { currentLiabilities: [], nonCurrentLiabilities: [] },
        equity: [],
      },
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

// ✅ GET route — Fetch all balance sheets for authenticated user
router.get("/", verifyTokenOptional, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(200).json([]);
    }
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    const sheets = await BalanceSheet.find({
      $or: [
        { userId: userObjectId },
        { userId: req.user.id }
      ]
    }).sort({ createdAt: -1 });
    res.status(200).json(sheets);
  } catch (error) {
    console.error("Error fetching balance sheets:", error);
    res.status(500).json({ 
      message: "Error fetching balance sheets", 
      error: error.message 
    });
  }
});

// ✅ GET route — Fetch balance sheet summary for authenticated user
router.get("/summary", verifyTokenOptional, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.json({ totalAssets: 0, totalLiabilities: 0, totalEquity: 0, balancedCount: 0, totalRecords: 0 });
    }
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    const summary = await BalanceSheet.aggregate([
      {
        $match: {
          $or: [
            { userId: userObjectId },
            { userId: req.user.id }
          ]
        }
      },
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

    res.json(summary[0] || { totalAssets: 0, totalLiabilities: 0, totalEquity: 0, balancedCount: 0, totalRecords: 0 });
  } catch (error) {
    console.error("Error fetching balance sheet summary:", error);
    res.status(500).json({ 
      message: "Error fetching balance sheet summary", 
      error: error.message 
    });
  }
});

// ✅ GET route — Generate Live Balance Sheet connected to centralized finance flow
router.get("/generate", verifyTokenOptional, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(200).json({
        companyName: "Your Company",
        financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        period: req.query.period || "this-month",
        assets: { cashAndBank: 0, accountsReceivable: 0, inventory: 0, currentAssets: 0, fixedAssets: 0, totalAssets: 0 },
        liabilities: { accountsPayable: 0, currentLiabilities: 0, nonCurrentLiabilities: 0, totalLiabilities: 0 },
        equity: { ownerEquity: 0, retainedEarnings: 0, totalEquity: 0 },
        totalLiabilitiesEquity: 0,
        balanced: true,
        breakdown: { assets: { currentAssets: [], nonCurrentAssets: [] }, liabilities: { currentLiabilities: [], nonCurrentLiabilities: [] }, equity: [] }
      });
    }
    const period = req.query.period || "this-month";
    const liveBS = await getLiveBalanceSheet(req.user.id, period);
    res.status(200).json(liveBS);
  } catch (error) {
    console.error("Error generating live balance sheet:", error);
    res.status(500).json({ message: "Error generating live balance sheet", error: error.message });
  }
});

export default router;
