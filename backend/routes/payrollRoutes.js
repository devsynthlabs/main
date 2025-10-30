import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Payroll Schema
const payrollSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, required: true },
  deductions: { type: Number, required: true },
  bonuses: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Payroll = mongoose.model("Payroll", payrollSchema);

// ✅ POST route to store payroll data
router.post("/add", async (req, res) => {
  try {
    const payrollData = req.body;
    const newPayroll = new Payroll(payrollData);
    await newPayroll.save();
    res.status(201).json({ message: "Payroll data saved successfully!" });
  } catch (error) {
    console.error("Error saving payroll:", error);
    res.status(500).json({ message: "Error saving payroll data", error });
  }
});

// ✅ GET route to fetch payroll data (optional)
router.get("/all", async (req, res) => {
  try {
    const payrolls = await Payroll.find().sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (error) {
    console.error("Error fetching payroll data:", error);
    res.status(500).json({ message: "Error fetching payroll data" });
  }
});

export default router;
