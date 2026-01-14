import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import csvParser from "csv-parser";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ✅ Fraud Detection Rule Schema
const fraudRuleSchema = new mongoose.Schema({
  ruleName: { type: String, required: true },
  ruleType: { 
    type: String, 
    enum: ['amount_threshold', 'time_based', 'frequency', 'pattern', 'custom'], 
    required: true 
  },
  conditions: { type: Object, required: true }, // JSON conditions
  threshold: { type: Number, required: true },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Fraud Transaction Schema
const fraudTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String },
  merchant: { type: String },
  accountNumber: { type: String },
  detectionMethod: { 
    type: String, 
    enum: ['rule_based', 'zscore', 'isolation_forest', 'ml_model', 'manual'] 
  },
  fraudScore: { type: Number, min: 0, max: 1 },
  status: { 
    type: String, 
    enum: ['pending', 'reviewing', 'confirmed_fraud', 'confirmed_legit', 'false_positive'], 
    default: 'pending' 
  },
  appliedRules: [{ type: String }],
  metadata: { type: Object },
  analyzedAt: { type: Date, default: Date.now }
});

// ✅ Detection Analysis Schema
const detectionAnalysisSchema = new mongoose.Schema({
  analysisId: { type: String, required: true, unique: true },
  algorithm: { 
    type: String, 
    enum: ['rule_based', 'zscore', 'isolation_forest', 'ensemble'], 
    required: true 
  },
  parameters: { type: Object, required: true },
  totalTransactions: { type: Number, required: true },
  flaggedTransactions: { type: Number, required: true },
  falsePositives: { type: Number, default: 0 },
  accuracy: { type: Number, min: 0, max: 1 },
  fileOriginalName: { type: String },
  processingTime: { type: Number }, // in milliseconds
  userId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const FraudRule = mongoose.model("FraudRule", fraudRuleSchema);
const FraudTransaction = mongoose.model("FraudTransaction", fraudTransactionSchema);
const DetectionAnalysis = mongoose.model("DetectionAnalysis", detectionAnalysisSchema);

// ✅ Helper function to process uploaded file
const processUploadedFile = async (filePath, fileType) => {
  try {
    let data = [];
    
    if (fileType === 'csv') {
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (row) => data.push(row))
          .on('end', () => {
            fs.unlinkSync(filePath); // Clean up file
            resolve(data);
          })
          .on('error', reject);
      });
    } else if (fileType === 'xlsx' || fileType === 'xls') {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      fs.unlinkSync(filePath); // Clean up file
      return data;
    }
    
    throw new Error('Unsupported file type');
  } catch (error) {
    throw error;
  }
};

// ✅ 1. Upload and Process Transactions File
router.post("/upload", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { algorithm, parameters, userId } = req.body;
    const filePath = req.file.path;
    const fileType = req.file.originalname.split('.').pop().toLowerCase();

    // Process the uploaded file
    const transactions = await processUploadedFile(filePath, fileType);
    
    // Apply fraud detection based on algorithm
    let flaggedTransactions = [];
    
    switch (algorithm) {
      case 'rule_based':
        flaggedTransactions = await applyRuleBasedDetection(transactions, parameters);
        break;
      case 'zscore':
        flaggedTransactions = await applyZScoreDetection(transactions, parameters);
        break;
      case 'isolation_forest':
        flaggedTransactions = await applyIsolationForestDetection(transactions, parameters);
        break;
      default:
        flaggedTransactions = await applyRuleBasedDetection(transactions, parameters);
    }

    // Save analysis record
    const analysisId = `ANALYSIS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const analysis = new DetectionAnalysis({
      analysisId,
      algorithm,
      parameters: JSON.parse(parameters || '{}'),
      totalTransactions: transactions.length,
      flaggedTransactions: flaggedTransactions.length,
      fileOriginalName: req.file.originalname,
      userId,
      processingTime: 0 // Could calculate actual processing time
    });
    await analysis.save();

    // Save flagged transactions
    const savedTransactions = await FraudTransaction.insertMany(flaggedTransactions);

    res.status(200).json({
      message: "File processed successfully",
      analysisId,
      totalTransactions: transactions.length,
      flaggedCount: flaggedTransactions.length,
      transactions: savedTransactions.slice(0, 50), // Return first 50 for preview
      analysisSummary: {
        fraudRate: (flaggedTransactions.length / transactions.length * 100).toFixed(2) + '%',
        algorithmUsed: algorithm
      }
    });

  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ 
      message: "Error processing file", 
      error: error.message 
    });
  }
});

// ✅ 2. Apply Rule-Based Detection
const applyRuleBasedDetection = async (transactions, params) => {
  const parameters = typeof params === 'string' ? JSON.parse(params) : params;
  const threshold = parameters.threshold || 10000;
  const dateColumn = parameters.dateColumn || 'Date';
  const amountColumn = parameters.amountColumn || 'Amount';
  const descColumn = parameters.descColumn || 'Description';

  const flagged = transactions
    .filter(tx => {
      const amount = parseFloat(tx[amountColumn] || tx.amount || 0);
      return amount >= threshold;
    })
    .map(tx => {
      const amount = parseFloat(tx[amountColumn] || tx.amount || 0);
      return new FraudTransaction({
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date(tx[dateColumn] || tx.date || Date.now()),
        amount: amount,
        description: tx[descColumn] || tx.description || 'Unknown',
        detectionMethod: 'rule_based',
        fraudScore: amount >= threshold * 2 ? 1.0 : 0.8,
        status: 'pending',
        appliedRules: [`Amount exceeds ${threshold}`]
      });
    });

  return flagged;
};

// ✅ 3. Apply Z-Score Detection
const applyZScoreDetection = async (transactions, params) => {
  const parameters = typeof params === 'string' ? JSON.parse(params) : params;
  const zThreshold = parameters.zThreshold || 3.0;
  const dateColumn = parameters.dateColumn || 'Date';
  const amountColumn = parameters.amountColumn || 'Amount';
  const descColumn = parameters.descColumn || 'Description';

  // Extract amounts
  const amounts = transactions
    .map(tx => parseFloat(tx[amountColumn] || tx.amount || 0))
    .filter(amount => !isNaN(amount));

  if (amounts.length === 0) return [];

  // Calculate mean and standard deviation
  const mean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);

  const flagged = transactions
    .filter(tx => {
      const amount = parseFloat(tx[amountColumn] || tx.amount || 0);
      if (isNaN(amount) || stdDev === 0) return false;
      const zScore = Math.abs((amount - mean) / stdDev);
      return zScore > zThreshold;
    })
    .map(tx => {
      const amount = parseFloat(tx[amountColumn] || tx.amount || 0);
      const zScore = Math.abs((amount - mean) / stdDev);
      return new FraudTransaction({
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date(tx[dateColumn] || tx.date || Date.now()),
        amount: amount,
        description: tx[descColumn] || tx.description || 'Unknown',
        detectionMethod: 'zscore',
        fraudScore: Math.min(zScore / 10, 1.0), // Normalize to 0-1
        status: 'pending',
        appliedRules: [`Z-Score: ${zScore.toFixed(2)} > ${zThreshold}`],
        metadata: { zScore: zScore.toFixed(2) }
      });
    });

  return flagged;
};

// ✅ 4. Apply Isolation Forest Detection (Mock implementation)
const applyIsolationForestDetection = async (transactions, params) => {
  const parameters = typeof params === 'string' ? JSON.parse(params) : params;
  const contamination = parameters.contamination || 0.01;
  const dateColumn = parameters.dateColumn || 'Date';
  const amountColumn = parameters.amountColumn || 'Amount';
  const descColumn = parameters.descColumn || 'Description';

  // Mock Isolation Forest - in production, use sklearn-isolation-forest or similar
  const flaggedCount = Math.max(1, Math.floor(transactions.length * contamination));
  
  // Simple heuristic: flag transactions with highest amounts
  const transactionsWithIndex = transactions
    .map((tx, index) => ({
      ...tx,
      originalIndex: index,
      amount: parseFloat(tx[amountColumn] || tx.amount || 0)
    }))
    .filter(tx => !isNaN(tx.amount))
    .sort((a, b) => b.amount - a.amount);

  const flagged = transactionsWithIndex
    .slice(0, flaggedCount)
    .map(tx => new FraudTransaction({
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date(tx[dateColumn] || tx.date || Date.now()),
      amount: tx.amount,
      description: tx[descColumn] || tx.description || 'Unknown',
      detectionMethod: 'isolation_forest',
      fraudScore: Math.random() * 0.5 + 0.5, // Random score 0.5-1.0
      status: 'pending',
      appliedRules: ['Isolation Forest (ML)'],
      metadata: { contamination, algorithm: 'isolation_forest_mock' }
    }));

  return flagged;
};

// ✅ 5. Manage Fraud Detection Rules
router.post("/rules/add", async (req, res) => {
  try {
    const ruleData = req.body;
    const newRule = new FraudRule(ruleData);
    await newRule.save();
    res.status(201).json({ 
      message: "Fraud rule added successfully!", 
      rule: newRule 
    });
  } catch (error) {
    console.error("Error adding fraud rule:", error);
    res.status(500).json({ message: "Error adding fraud rule", error });
  }
});

router.get("/rules", async (req, res) => {
  try {
    const rules = await FraudRule.find().sort({ createdAt: -1 });
    res.json(rules);
  } catch (error) {
    console.error("Error fetching fraud rules:", error);
    res.status(500).json({ message: "Error fetching fraud rules" });
  }
});

router.put("/rules/:id/toggle", async (req, res) => {
  try {
    const rule = await FraudRule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }
    
    rule.isActive = !rule.isActive;
    await rule.save();
    
    res.json({ 
      message: `Rule ${rule.isActive ? 'activated' : 'deactivated'}`, 
      rule 
    });
  } catch (error) {
    console.error("Error toggling rule:", error);
    res.status(500).json({ message: "Error toggling rule", error });
  }
});

// ✅ 6. Get Flagged Transactions
router.get("/transactions", async (req, res) => {
  try {
    const { 
      status, 
      startDate, 
      endDate, 
      minAmount, 
      maxAmount,
      page = 1, 
      limit = 50 
    } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const transactions = await FraudTransaction.find(query)
      .sort({ analyzedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await FraudTransaction.countDocuments(query);
    
    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// ✅ 7. Update Transaction Status
router.put("/transactions/:id/status", async (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'reviewing', 'confirmed_fraud', 'confirmed_legit', 'false_positive'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const transaction = await FraudTransaction.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(notes && { $push: { notes } })
      },
      { new: true }
    );
    
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    res.json({ 
      message: "Transaction status updated", 
      transaction 
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Error updating transaction", error });
  }
});

// ✅ 8. Get Detection Analysis History
router.get("/analysis", async (req, res) => {
  try {
    const { 
      userId, 
      algorithm, 
      startDate, 
      endDate,
      page = 1, 
      limit = 20 
    } = req.query;
    
    const query = {};
    
    if (userId) query.userId = userId;
    if (algorithm) query.algorithm = algorithm;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const analyses = await DetectionAnalysis.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await DetectionAnalysis.countDocuments(query);
    
    res.json({
      analyses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    res.status(500).json({ message: "Error fetching analysis history" });
  }
});

// ✅ 9. Get Statistics Dashboard
router.get("/stats", async (req, res) => {
  try {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get basic counts
    const totalTransactions = await FraudTransaction.countDocuments();
    const flaggedTransactions = await FraudTransaction.countDocuments({ status: { $ne: 'confirmed_legit' } });
    const confirmedFraud = await FraudTransaction.countDocuments({ status: 'confirmed_fraud' });
    const falsePositives = await FraudTransaction.countDocuments({ status: 'false_positive' });
    
    // Get recent analysis
    const recentAnalyses = await DetectionAnalysis.find({
      createdAt: { $gte: last30Days }
    }).sort({ createdAt: -1 }).limit(10);
    
    // Get status distribution
    const statusDistribution = await FraudTransaction.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    // Get detection method distribution
    const methodDistribution = await FraudTransaction.aggregate([
      { $group: { _id: "$detectionMethod", count: { $sum: 1 } } }
    ]);
    
    // Get amount statistics
    const amountStats = await FraudTransaction.aggregate([
      {
        $group: {
          _id: null,
          avgAmount: { $avg: "$amount" },
          maxAmount: { $max: "$amount" },
          minAmount: { $min: "$amount" },
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);
    
    res.json({
      overview: {
        totalTransactions,
        flaggedTransactions,
        fraudRate: totalTransactions > 0 ? (flaggedTransactions / totalTransactions * 100).toFixed(2) + '%' : '0%',
        confirmedFraud,
        falsePositives,
        accuracy: confirmedFraud > 0 ? (confirmedFraud / (confirmedFraud + falsePositives) * 100).toFixed(2) + '%' : '0%'
      },
      recentAnalyses,
      distributions: {
        status: statusDistribution,
        method: methodDistribution
      },
      amountStats: amountStats[0] || {}
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Error fetching statistics", error });
  }
});

// ✅ 10. Export Flagged Transactions
router.get("/export", async (req, res) => {
  try {
    const { format = 'csv', startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const transactions = await FraudTransaction.find(query).sort({ date: -1 });
    
    if (format === 'csv') {
      let csvContent = "Transaction ID,Date,Amount,Description,Detection Method,Fraud Score,Status\n";
      
      transactions.forEach(tx => {
        csvContent += `"${tx.transactionId}","${tx.date.toISOString()}","${tx.amount}","${tx.description}","${tx.detectionMethod}","${tx.fraudScore}","${tx.status}"\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=fraud_transactions_${Date.now()}.csv`);
      res.send(csvContent);
    } else if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=fraud_transactions_${Date.now()}.json`);
      res.json(transactions);
    } else {
      res.status(400).json({ message: "Unsupported export format" });
    }
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ message: "Error exporting data", error });
  }
});

export default router;