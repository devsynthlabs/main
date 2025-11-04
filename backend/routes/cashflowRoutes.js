import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ CashFlow Entry Schema
const cashflowEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: String, required: true },
  month: { type: String, required: true },
  cashInflow: { type: Number, required: true },
  cashOutflow: { type: Number, required: true },
  netCashFlow: { type: Number, required: true },
  time: { type: Number, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ✅ Add index for better query performance
cashflowEntrySchema.index({ userId: 1, year: 1, month: 1 });

const CashFlowEntry = mongoose.model("CashFlowEntry", cashflowEntrySchema);

// ✅ Middleware to verify JWT token (same as server.js)
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

// ✅ POST route to store cash flow entry (Protected) - Updated for multiple entries
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { year, month, cashInflow, cashOutflow, description, category } = req.body;
    
    // Validation
    if (!year || !month || cashInflow === undefined || cashOutflow === undefined) {
      return res.status(400).json({ message: "Year, month, cash inflow, and cash outflow are required" });
    }

    // Parse arrays for multiple entries
    const monthArray = Array.isArray(month) ? month : month.split(',').map(m => m.trim());
    const inflowArray = Array.isArray(cashInflow) ? cashInflow : cashInflow.split(',').map(val => parseFloat(val.trim()) || 0);
    const outflowArray = Array.isArray(cashOutflow) ? cashOutflow : cashOutflow.split(',').map(val => parseFloat(val.trim()) || 0);
    const descriptionArray = Array.isArray(description) ? description : [description || ""];
    const categoryArray = Array.isArray(category) ? category : [category || "General"];

    // Validate array lengths
    if (monthArray.length !== inflowArray.length || monthArray.length !== outflowArray.length) {
      return res.status(400).json({ message: "Number of months, cash inflows, and cash outflows must match" });
    }

    // Get the last time index for this user
    const lastEntry = await CashFlowEntry.findOne({ userId: req.user.id }).sort({ time: -1 });
    let nextTime = lastEntry ? lastEntry.time + 1 : 0;

    // Create multiple entries
    const newEntries = [];
    for (let i = 0; i < monthArray.length; i++) {
      const netCashFlow = parseFloat(inflowArray[i]) - parseFloat(outflowArray[i]);
      
      const newCashFlow = new CashFlowEntry({
        userId: req.user.id,
        year,
        month: monthArray[i],
        cashInflow: parseFloat(inflowArray[i]),
        cashOutflow: parseFloat(outflowArray[i]),
        netCashFlow,
        time: nextTime + i,
        description: descriptionArray[i] || "",
        category: categoryArray[i] || "General"
      });
      
      newEntries.push(newCashFlow);
    }

    // Save all entries
    await CashFlowEntry.insertMany(newEntries);

    res.status(201).json({ 
      message: `${newEntries.length} cash flow entries saved successfully!`,
      data: newEntries 
    });
  } catch (error) {
    console.error("Error saving cash flow entry:", error);
    res.status(500).json({ 
      message: "Error saving cash flow entry", 
      error: error.message 
    });
  }
});

// ✅ POST route to add multiple cash flow entries at once (Protected)
router.post("/add-bulk", verifyToken, async (req, res) => {
  try {
    const { entries } = req.body; // Array of entry objects
    
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: "Entries array is required" });
    }

    // Get the last time index for this user
    const lastEntry = await CashFlowEntry.findOne({ userId: req.user.id }).sort({ time: -1 });
    let nextTime = lastEntry ? lastEntry.time + 1 : 0;

    // Prepare entries with calculated fields
    const newEntries = entries.map((entry, index) => {
      const netCashFlow = parseFloat(entry.cashInflow) - parseFloat(entry.cashOutflow);
      
      return {
        userId: req.user.id,
        year: entry.year,
        month: entry.month,
        cashInflow: parseFloat(entry.cashInflow),
        cashOutflow: parseFloat(entry.cashOutflow),
        netCashFlow,
        time: nextTime + index,
        description: entry.description || "",
        category: entry.category || "General",
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Save all entries
    await CashFlowEntry.insertMany(newEntries);

    res.status(201).json({ 
      message: `${newEntries.length} cash flow entries saved successfully!`,
      data: newEntries 
    });
  } catch (error) {
    console.error("Error saving bulk cash flow entries:", error);
    res.status(500).json({ 
      message: "Error saving bulk cash flow entries", 
      error: error.message 
    });
  }
});

// ✅ GET route to fetch all cash flow entries for logged-in user (Protected)
router.get("/all", verifyToken, async (req, res) => {
  try {
    const cashflows = await CashFlowEntry.find({ userId: req.user.id }).sort({ time: 1 });
    res.json(cashflows);
  } catch (error) {
    console.error("Error fetching cash flow data:", error);
    res.status(500).json({ 
      message: "Error fetching cash flow data",
      error: error.message 
    });
  }
});

// ✅ GET route to fetch entries for a specific year (Protected)
router.get("/year/:year", verifyToken, async (req, res) => {
  try {
    const { year } = req.params;
    const cashflows = await CashFlowEntry.find({ 
      userId: req.user.id, 
      year 
    }).sort({ time: 1 });
    
    res.json(cashflows);
  } catch (error) {
    console.error("Error fetching cash flow data for year:", error);
    res.status(500).json({ 
      message: "Error fetching cash flow data",
      error: error.message 
    });
  }
});

// ✅ GET route to fetch cash flow summary (Protected)
router.get("/summary", verifyToken, async (req, res) => {
  try {
    const summary = await CashFlowEntry.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: "$year",
          totalInflow: { $sum: "$cashInflow" },
          totalOutflow: { $sum: "$cashOutflow" },
          totalNetFlow: { $sum: "$netCashFlow" },
          entryCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(summary);
  } catch (error) {
    console.error("Error fetching cash flow summary:", error);
    res.status(500).json({ 
      message: "Error fetching cash flow summary",
      error: error.message 
    });
  }
});

// ✅ PUT route to update a cash flow entry (Protected)
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month, cashInflow, cashOutflow, description, category } = req.body;

    // Find the entry and verify ownership
    const existingEntry = await CashFlowEntry.findOne({ _id: id, userId: req.user.id });
    if (!existingEntry) {
      return res.status(404).json({ message: "Cash flow entry not found" });
    }

    // Calculate new net cash flow
    const netCashFlow = parseFloat(cashInflow) - parseFloat(cashOutflow);

    // Update the entry
    const updatedEntry = await CashFlowEntry.findByIdAndUpdate(
      id,
      {
        year,
        month,
        cashInflow: parseFloat(cashInflow),
        cashOutflow: parseFloat(cashOutflow),
        netCashFlow,
        description: description || existingEntry.description,
        category: category || existingEntry.category,
        updatedAt: new Date()
      },
      { new: true } // Return updated document
    );

    res.json({ 
      message: "Cash flow entry updated successfully!", 
      data: updatedEntry 
    });
  } catch (error) {
    console.error("Error updating cash flow entry:", error);
    res.status(500).json({ 
      message: "Error updating cash flow entry",
      error: error.message 
    });
  }
});

// ✅ DELETE route to remove a cash flow entry (Protected)
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership before deleting
    const deletedEntry = await CashFlowEntry.findOneAndDelete({ 
      _id: id, 
      userId: req.user.id 
    });
    
    if (!deletedEntry) {
      return res.status(404).json({ message: "Cash flow entry not found" });
    }

    res.json({ message: "Cash flow entry deleted successfully!" });
  } catch (error) {
    console.error("Error deleting cash flow entry:", error);
    res.status(500).json({ 
      message: "Error deleting cash flow entry",
      error: error.message 
    });
  }
});

// ✅ DELETE route to clear all entries for user (Protected)
router.delete("/clear", verifyToken, async (req, res) => {
  try {
    await CashFlowEntry.deleteMany({ userId: req.user.id });
    res.json({ message: "All cash flow entries cleared successfully!" });
  } catch (error) {
    console.error("Error clearing cash flow entries:", error);
    res.status(500).json({ 
      message: "Error clearing cash flow entries",
      error: error.message 
    });
  }
});

export default router;