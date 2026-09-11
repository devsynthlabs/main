import express from "express";
import mongoose from "mongoose";
import { runPythonCalculation } from "../utils/pythonBridge.js";

const router = express.Router();

// ✅ Enhanced Payroll Schema with all requirement fields & tenant isolation
const payrollSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  employeeRole: { type: String, required: true },
  employeeDepartment: { type: String, required: true },
  employeeExperience: { type: Number, required: true },
  basicSalary: { type: Number, required: true },
  da: { type: Number, required: true },
  hra: { type: Number, required: true },
  travelAllowance: { type: Number, required: true },
  overtimeAllowance: { type: Number, default: 0 },
  otherAllowance: { type: Number, required: true },
  bonuses: { type: Number, required: true },
  grossSalary: { type: Number, required: true },
  pfDeduction: { type: Number, required: true },
  epfDeduction: { type: Number, required: true },
  esiDeduction: { type: Number, default: 0 },
  taxDeduction: { type: Number, required: true },
  extraLeaveDeduction: { type: Number, default: 0 },
  advanceRecoveryDeduction: { type: Number, default: 0 },
  loanDeduction: { type: Number, default: 0 },
  otherDeduction: { type: Number, default: 0 },
  totalDeductions: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Payroll = mongoose.model("Payroll", payrollSchema);

// ✅ POST route to store enhanced payroll data
router.post("/add", async (req, res) => {
  try {
    const payrollData = {
      ...req.body,
      userId: req.user.id
    };

    // Authoritative calculation via Python Financial Calculation Engine
    try {
      const pyResult = await runPythonCalculation("payroll.calculate", payrollData);
      if (pyResult && !pyResult.error) {
        payrollData.grossSalary = pyResult.grossSalary;
        payrollData.pfDeduction = pyResult.pfDeduction;
        payrollData.epfDeduction = pyResult.epfDeduction;
        payrollData.esiDeduction = pyResult.esiDeduction;
        payrollData.taxDeduction = pyResult.taxDeduction;
        payrollData.totalDeductions = pyResult.totalDeductions;
        payrollData.netSalary = pyResult.netSalary;
      }
    } catch (pyErr) {
      console.warn("⚠️ Python calculation fallback triggered for payroll add:", pyErr.message);
    }

    const newPayroll = new Payroll(payrollData);
    await newPayroll.save();
    res.status(201).json({ message: "Payroll data saved successfully!", payroll: newPayroll });
  } catch (error) {
    console.error("Error saving payroll:", error);
    res.status(500).json({ message: "Error saving payroll data", error });
  }
});

// ✅ GET route to fetch all payroll records for authenticated user
router.get("/all", async (req, res) => {
  try {
    const payrolls = await Payroll.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (error) {
    console.error("Error fetching payroll data:", error);
    res.status(500).json({ message: "Error fetching payroll data" });
  }
});

// ✅ GET route for specific employee payroll history for authenticated user
router.get("/employee/:employeeId", async (req, res) => {
  try {
    const payrolls = await Payroll.find({ 
      employeeId: req.params.employeeId, 
      userId: req.user.id 
    }).sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (error) {
    console.error("Error fetching employee payroll:", error);
    res.status(500).json({ message: "Error fetching employee payroll data" });
  }
});

export default router;