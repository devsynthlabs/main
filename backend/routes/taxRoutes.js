import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Define GST Schema
const gstSchema = new mongoose.Schema({
  baseAmount: { type: Number, required: true }, // frontend sends baseAmount
  gstRate: { type: Number, required: true },
  transactionType: { type: String, enum: ["intrastate", "interstate"], required: true },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Create model
const TaxGST = mongoose.model("TaxGST", gstSchema);

// ✅ POST route to save GST calculation
router.post("/add", async (req, res) => {
  try {
    const gstData = req.body;

    // Log for debugging
    console.log("📩 Received GST Data:", gstData);

    // Ensure baseAmount is sent
    if (gstData.baseAmount === undefined) {
      return res.status(400).json({ message: "baseAmount is required" });
    }

    const newGst = new TaxGST(gstData);
    await newGst.save();

    res.status(201).json({ message: "✅ GST data saved successfully!", gstData: newGst });
  } catch (error) {
    console.error("❌ Error saving GST data:", error);
    res.status(500).json({ message: "Error saving GST data", error });
  }
});

// ✅ GET route to fetch all stored GST data
router.get("/all", async (req, res) => {
  try {
    const data = await TaxGST.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error fetching GST data:", error);
    res.status(500).json({ message: "Error fetching GST data", error });
  }
});

export default router;
