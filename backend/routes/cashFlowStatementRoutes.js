import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = express.Router();

// ==================== SCHEMAS ====================

// ✅ Dynamic Mode Schema (Original - with items array)
const cashFlowStatementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: "Cash Flow Statement" },
  period: { type: String, required: true },
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

// ✅ Simple Mode Schema (Requirement style - with textarea)
const simpleCashFlowStatementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  period: { type: String, required: true },
  inflowText: { type: String, required: true },
  outflowText: { type: String, required: true },
  totalInflow: { type: Number, required: true },
  totalOutflow: { type: Number, required: true },
  netCashFlow: { type: Number, required: true },
  status: { type: String, enum: ["positive", "negative", "neutral"], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CashFlowStatement = mongoose.model("CashFlowStatement", cashFlowStatementSchema);
const SimpleCashFlowStatement = mongoose.model("SimpleCashFlowStatement", simpleCashFlowStatementSchema);

// ==================== MIDDLEWARE ====================

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

// ==================== DYNAMIC MODE ROUTES (Original) ====================

// ✅ POST - Create dynamic cash flow statement
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

// ✅ GET - Fetch all dynamic statements for user
router.get("/all", verifyToken, async (req, res) => {
  try {
    const statements = await CashFlowStatement.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(statements);
  } catch (error) {
    console.error("Error fetching cash flow statements:", error);
    res.status(500).json({ message: "Error fetching cash flow statements" });
  }
});

// ✅ GET - Fetch specific dynamic statement by ID
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

// ✅ PUT - Update dynamic statement
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

// ✅ DELETE - Remove dynamic statement
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

// ==================== SIMPLE MODE ROUTES (Requirement Style) ====================

// ✅ POST - Create simple cash flow statement (textarea mode)
router.post("/simple/create", verifyToken, async (req, res) => {
  try {
    const { period, inflowText, outflowText, totalInflow, totalOutflow, netCashFlow, status } = req.body;

    if (!period || !inflowText || !outflowText) {
      return res.status(400).json({ message: "Period, inflow text, and outflow text are required" });
    }

    const newStatement = new SimpleCashFlowStatement({
      userId: req.user.id,
      period,
      inflowText,
      outflowText,
      totalInflow: totalInflow || 0,
      totalOutflow: totalOutflow || 0,
      netCashFlow: netCashFlow || 0,
      status: status || "neutral"
    });

    await newStatement.save();

    res.status(201).json({ 
      message: "Cash flow statement saved successfully!",
      data: newStatement
    });
  } catch (error) {
    console.error("Error creating simple cash flow statement:", error);
    res.status(500).json({ message: "Error creating cash flow statement", error: error.message });
  }
});

// ✅ GET - Fetch all simple statements for user
router.get("/simple/all", verifyToken, async (req, res) => {
  try {
    const statements = await SimpleCashFlowStatement.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(statements);
  } catch (error) {
    console.error("Error fetching simple statements:", error);
    res.status(500).json({ message: "Error fetching statements" });
  }
});

// ✅ GET - Fetch specific simple statement by ID
router.get("/simple/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const statement = await SimpleCashFlowStatement.findOne({ _id: id, userId: req.user.id });
    
    if (!statement) {
      return res.status(404).json({ message: "Cash flow statement not found" });
    }
    
    res.json(statement);
  } catch (error) {
    console.error("Error fetching simple statement:", error);
    res.status(500).json({ message: "Error fetching statement" });
  }
});

// ✅ PUT - Update simple statement
router.put("/simple/update/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { period, inflowText, outflowText, totalInflow, totalOutflow, netCashFlow, status } = req.body;

    const existingStatement = await SimpleCashFlowStatement.findOne({ _id: id, userId: req.user.id });
    if (!existingStatement) {
      return res.status(404).json({ message: "Cash flow statement not found" });
    }

    const updatedStatement = await SimpleCashFlowStatement.findByIdAndUpdate(
      id,
      {
        period,
        inflowText,
        outflowText,
        totalInflow: totalInflow || 0,
        totalOutflow: totalOutflow || 0,
        netCashFlow: netCashFlow || 0,
        status: status || "neutral",
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({ 
      message: "Cash flow statement updated successfully!", 
      data: updatedStatement 
    });
  } catch (error) {
    console.error("Error updating simple statement:", error);
    res.status(500).json({ message: "Error updating statement" });
  }
});

// ✅ DELETE - Remove simple statement
router.delete("/simple/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStatement = await SimpleCashFlowStatement.findOneAndDelete({ _id: id, userId: req.user.id });
    
    if (!deletedStatement) {
      return res.status(404).json({ message: "Cash flow statement not found" });
    }

    res.json({ message: "Cash flow statement deleted successfully!" });
  } catch (error) {
    console.error("Error deleting simple statement:", error);
    res.status(500).json({ message: "Error deleting statement" });
  }
});

// ==================== SUMMARY ROUTES ====================

// ✅ GET - Dynamic mode summary
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

// ✅ GET - Simple mode summary
router.get("/simple/summary/overview", verifyToken, async (req, res) => {
  try {
    const summary = await SimpleCashFlowStatement.aggregate([
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
    console.error("Error fetching simple summary:", error);
    res.status(500).json({ message: "Error fetching simple summary" });
  }
});

export default router;