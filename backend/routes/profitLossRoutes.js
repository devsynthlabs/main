import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Define ProfitLoss schema - UPDATED to match Python file with 8 expenses
const profitLossSchema = new mongoose.Schema({
  companyName: { type: String },
  financialYear: { type: String },
  // Revenue fields
  sales: { type: Number, required: true, default: 0 },
  serviceIncome: { type: Number, required: true, default: 0 },
  interestIncome: { type: Number, required: true, default: 0 },
  otherIncome: { type: Number, required: true, default: 0 },
  totalRevenue: { type: Number, required: true, default: 0 },
  
  // Expense fields - EXPANDED to 8 fields matching Python
  costOfMaterials: { type: Number, required: true, default: 0 },  // NEW
  salaries: { type: Number, required: true, default: 0 },
  rent: { type: Number, required: true, default: 0 },
  utilities: { type: Number, required: true, default: 0 },
  financeCost: { type: Number, required: true, default: 0 },      // NEW
  depreciation: { type: Number, required: true, default: 0 },     // NEW
  amortization: { type: Number, required: true, default: 0 },     // NEW
  otherExpenses: { type: Number, required: true, default: 0 },
  totalExpenses: { type: Number, required: true, default: 0 },
  
  // Result fields
  netProfit: { type: Number, required: true, default: 0 },
  profitMargin: { type: Number, required: true, default: 0 },     // NEW
  profitable: { type: Boolean, required: true, default: false },
  
  // AI Insights (store for history)
  aiInsights: { type: [String], default: [] },                    // NEW
  aiRecommendations: { type: [String], default: [] },             // NEW
  
  createdAt: { type: Date, default: Date.now },
});

const ProfitLoss = mongoose.model("ProfitLoss", profitLossSchema);

// ✅ Helper function to generate AI insights (mirrors Python logic)
function generateAIInsights(revenue, expenses, netProfit, profitMargin, cogs) {
  const insights = [];
  const recommendations = [];
  
  if (netProfit < 0) {
    insights.push("⚠️ Business is operating at a LOSS");
    recommendations.push("Review all expenses immediately");
    recommendations.push("Consider cost reduction measures");
    recommendations.push("Increase revenue streams");
  } else if (profitMargin < 15) {
    insights.push("⚠️ Low Profit Margin business (below 15%)");
    recommendations.push("Improve pricing strategy");
    recommendations.push("Reduce operational expenses by 10-15%");
    recommendations.push("Focus on high-margin products/services");
  } else if (profitMargin < 25) {
    insights.push("✅ Moderate Profit Margin (15-25%)");
    recommendations.push("Maintain current cost structure");
    recommendations.push("Explore expansion opportunities");
  } else {
    insights.push("🎉 Excellent Profit Margin (above 25%)");
    recommendations.push("Consider reinvesting profits");
    recommendations.push("Scale successful operations");
  }
  
  const expenseRatio = (expenses / revenue * 100) || 0;
  if (expenseRatio > 70) {
    insights.push(`⚠️ Expenses are ${expenseRatio.toFixed(1)}% of revenue - too high`);
    recommendations.push("Identify top 3 expense categories for reduction");
  } else if (expenseRatio > 50) {
    insights.push(`📊 Expenses are ${expenseRatio.toFixed(1)}% of revenue - moderate`);
    recommendations.push("Monitor expense growth closely");
  } else {
    insights.push(`✅ Excellent cost control - expenses only ${expenseRatio.toFixed(1)}% of revenue`);
  }
  
  if (cogs && revenue && cogs > revenue * 0.6) {
    insights.push("⚠️ COGS is high compared to revenue");
    recommendations.push("Negotiate supplier costs");
    recommendations.push("Explore alternative vendors");
  }
  
  return { insights, recommendations };
}

// ✅ POST route to store Profit & Loss data
router.post("/add", async (req, res) => {
  try {
    const plData = req.body;

    // Calculate total revenue
    const totalRevenue = (plData.sales || 0) + (plData.serviceIncome || 0) + 
                         (plData.interestIncome || 0) + (plData.otherIncome || 0);
    
    // Calculate total expenses - using 8 expense fields
    const totalExpenses = (plData.costOfMaterials || 0) + (plData.salaries || 0) + 
                          (plData.rent || 0) + (plData.utilities || 0) +
                          (plData.financeCost || 0) + (plData.depreciation || 0) +
                          (plData.amortization || 0) + (plData.otherExpenses || 0);
    
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = (netProfit / totalRevenue * 100) || 0;
    const profitable = netProfit > 0;
    
    // Generate AI insights
    const { insights, recommendations } = generateAIInsights(
      totalRevenue, totalExpenses, netProfit, profitMargin, plData.costOfMaterials || 0
    );

    const dataToSave = {
      companyName: plData.companyName || "",
      financialYear: plData.financialYear || "",
      // Revenue
      sales: plData.sales || 0,
      serviceIncome: plData.serviceIncome || 0,
      interestIncome: plData.interestIncome || 0,
      otherIncome: plData.otherIncome || 0,
      totalRevenue: totalRevenue,
      
      // Expenses (8 fields)
      costOfMaterials: plData.costOfMaterials || 0,
      salaries: plData.salaries || 0,
      rent: plData.rent || 0,
      utilities: plData.utilities || 0,
      financeCost: plData.financeCost || 0,
      depreciation: plData.depreciation || 0,
      amortization: plData.amortization || 0,
      otherExpenses: plData.otherExpenses || 0,
      totalExpenses: totalExpenses,
      
      // Results
      netProfit: netProfit,
      profitMargin: profitMargin,
      profitable: profitable,
      
      // AI data
      aiInsights: insights,
      aiRecommendations: recommendations,
    };

    const newPL = new ProfitLoss(dataToSave);
    await newPL.save();

    res.status(201).json({ 
      message: "✅ Profit & Loss data saved successfully!",
      data: dataToSave,
      insights,
      recommendations
    });
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
          avgProfitMargin: { $avg: "$profitMargin" },
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

// ✅ NEW: GET route to fetch AI insights for a specific record
router.get("/insights/:id", async (req, res) => {
  try {
    const record = await ProfitLoss.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({
      insights: record.aiInsights,
      recommendations: record.aiRecommendations,
      profitMargin: record.profitMargin,
      netProfit: record.netProfit
    });
  } catch (error) {
    console.error("❌ Error fetching AI insights:", error);
    res.status(500).json({ message: "Error fetching insights", error });
  }
});

export default router;
