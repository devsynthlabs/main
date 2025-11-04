import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Define ProfitLoss schema - Updated to match Python file structure
const profitLossSchema = new mongoose.Schema({
  // Revenue fields
  sales: { type: Number, required: true, default: 0 },
  serviceIncome: { type: Number, required: true, default: 0 },
  interestIncome: { type: Number, required: true, default: 0 },
  otherIncome: { type: Number, required: true, default: 0 },
  totalRevenue: { type: Number, required: true, default: 0 },
  
  // Expense fields
  salaries: { type: Number, required: true, default: 0 },
  rent: { type: Number, required: true, default: 0 },
  utilities: { type: Number, required: true, default: 0 },
  otherExpenses: { type: Number, required: true, default: 0 },
  totalExpenses: { type: Number, required: true, default: 0 },
  
  // Result fields
  netProfit: { type: Number, required: true, default: 0 },
  profitable: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
});

const ProfitLoss = mongoose.model("ProfitLoss", profitLossSchema);

// ✅ POST route to store Profit & Loss data
router.post("/add", async (req, res) => {
  try {
    const plData = req.body;

    // Fill missing fields with 0 to avoid validation errors
    const dataToSave = {
      // Revenue
      sales: plData.sales || 0,
      serviceIncome: plData.serviceIncome || 0,
      interestIncome: plData.interestIncome || 0,
      otherIncome: plData.otherIncome || 0,
      totalRevenue: plData.totalRevenue || 0,
      
      // Expenses
      salaries: plData.salaries || 0,
      rent: plData.rent || 0,
      utilities: plData.utilities || 0,
      otherExpenses: plData.otherExpenses || 0,
      totalExpenses: plData.totalExpenses || 0,
      
      // Results
      netProfit: plData.netProfit || 0,
      profitable: plData.profitable || false,
    };

    const newPL = new ProfitLoss(dataToSave);
    await newPL.save();

    res.status(201).json({ message: "✅ Profit & Loss data saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving P&L data:", error);
    res.status(500).json({ message: "Error saving Profit & Loss data", error });
  }
});

// ✅ GET route to fetch all P&L records
router.get("/all", async (req, res) => {
  try {
    const records = await ProfitLoss.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    console.error("❌ Error fetching P&L data:", error);
    res.status(500).json({ message: "Error fetching Profit & Loss data", error });
  }
});

// ✅ GET route to fetch P&L summary
router.get("/summary", async (req, res) => {
  try {
    const summary = await ProfitLoss.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalRevenue" },
          totalExpenses: { $sum: "$totalExpenses" },
          totalNetProfit: { $sum: "$netProfit" },
          profitableCount: {
            $sum: { $cond: ["$profitable", 1, 0] }
          },
          totalRecords: { $sum: 1 }
        }
      }
    ]);

    res.json(summary[0] || {});
  } catch (error) {
    console.error("❌ Error fetching P&L summary:", error);
    res.status(500).json({ message: "Error fetching Profit & Loss summary", error });
  }
});

export default router;