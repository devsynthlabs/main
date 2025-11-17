import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Cash Flow Statement Schema
const cashFlowStatementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: "Cash Flow Statement" },
  period: { type: String, required: true }, // e.g., "Q1 2024", "January 2024"
  inflowItems: [{
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: "Revenue" }
  }],
  outflowItems: [{
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: "Expense" }
  }],
  totalInflow: { type: Number, required: true },
  totalOutflow: { type: Number, required: true },
  netCashFlow: { type: Number, required: true },
  status: { type: String, enum: ["positive", "negative", "neutral"], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CashFlowStatement = mongoose.model("CashFlowStatement", cashFlowStatementSchema);

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "fallback_jwt_secret_2024_finance_app";
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(400).json({ message: "Invalid token" });
  }
};

// ✅ POST route to create cash flow statement
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { period, inflowItems, outflowItems } = req.body;

    if (!period || !inflowItems || !outflowItems) {
      return res.status(400).json({ message: "Period, inflow items, and outflow items are required" });
    }

    // Calculate totals
    const totalInflow = inflowItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalOutflow = outflowItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const netCashFlow = totalInflow - totalOutflow;
    
    // Determine status
    let status = "neutral";
    if (netCashFlow > 0) status = "positive";
    if (netCashFlow < 0) status = "negative";

    const newStatement = new CashFlowStatement({
      userId: req.user.id,
      period,
      inflowItems,
      outflowItems,
      totalInflow,
      totalOutflow,
      netCashFlow,
      status
    });

    await newStatement.save();

    res.status(201).json({ 
      message: "Cash flow statement created successfully!",
      data: newStatement
    });
  } catch (error) {
    console.error("Error creating cash flow statement:", error);
    res.status(500).json({ message: "Error creating cash flow statement", error: error.message });
  }
});

// ✅ GET route to fetch all cash flow statements for user
router.get("/all", verifyToken, async (req, res) => {
  try {
    const statements = await CashFlowStatement.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(statements);
  } catch (error) {
    console.error("Error fetching cash flow statements:", error);
    res.status(500).json({ message: "Error fetching cash flow statements" });
  }
});

// ✅ GET route to fetch specific statement by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const statement = await CashFlowStatement.findOne({ _id: id, userId: req.user.id });
    
    if (!statement) {
      return res.status(404).json({ message: "Cash flow statement not found" });
    }
    
    res.json(statement);
  } catch (error) {
    console.error("Error fetching cash flow statement:", error);
    res.status(500).json({ message: "Error fetching cash flow statement" });
  }
});

// ✅ PUT route to update cash flow statement
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { period, inflowItems, outflowItems } = req.body;

    const existingStatement = await CashFlowStatement.findOne({ _id: id, userId: req.user.id });
    if (!existingStatement) {
      return res.status(404).json({ message: "Cash flow statement not found" });
    }

    // Recalculate totals
    const totalInflow = inflowItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalOutflow = outflowItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const netCashFlow = totalInflow - totalOutflow;
    
    let status = "neutral";
    if (netCashFlow > 0) status = "positive";
    if (netCashFlow < 0) status = "negative";

    const updatedStatement = await CashFlowStatement.findByIdAndUpdate(
      id,
      {
        period,
        inflowItems,
        outflowItems,
        totalInflow,
        totalOutflow,
        netCashFlow,
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({ 
      message: "Cash flow statement updated successfully!", 
      data: updatedStatement 
    });
  } catch (error) {
    console.error("Error updating cash flow statement:", error);
    res.status(500).json({ message: "Error updating cash flow statement" });
  }
});

// ✅ DELETE route to remove cash flow statement
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStatement = await CashFlowStatement.findOneAndDelete({ _id: id, userId: req.user.id });
    
    if (!deletedStatement) {
      return res.status(404).json({ message: "Cash flow statement not found" });
    }

    res.json({ message: "Cash flow statement deleted successfully!" });
  } catch (error) {
    console.error("Error deleting cash flow statement:", error);
    res.status(500).json({ message: "Error deleting cash flow statement" });
  }
});

// ✅ GET route for cash flow statement summary
router.get("/summary/overview", verifyToken, async (req, res) => {
  try {
    const summary = await CashFlowStatement.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: null,
          totalStatements: { $sum: 1 },
          averageInflow: { $avg: "$totalInflow" },
          averageOutflow: { $avg: "$totalOutflow" },
          averageNetFlow: { $avg: "$netCashFlow" },
          positiveStatements: {
            $sum: { $cond: [{ $eq: ["$status", "positive"] }, 1, 0] }
          },
          negativeStatements: {
            $sum: { $cond: [{ $eq: ["$status", "negative"] }, 1, 0] }
          },
          totalInflowSum: { $sum: "$totalInflow" },
          totalOutflowSum: { $sum: "$totalOutflow" }
        }
      }
    ]);

    res.json(summary.length > 0 ? summary[0] : {});
  } catch (error) {
    console.error("Error fetching cash flow summary:", error);
    res.status(500).json({ message: "Error fetching cash flow summary" });
  }
});

export default router;