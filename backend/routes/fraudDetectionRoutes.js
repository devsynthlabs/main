import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import csvParser from "csv-parser";
import xlsx from "xlsx";
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { uploadToSupabase, deleteFromSupabase } from "../utils/supabaseStorage.js";

const require = createRequire(import.meta.url);
const PDFParser = require("pdf2json");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

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
  supabaseFilePath: { type: String }, // Supabase storage URL
  processingTime: { type: Number }, // in milliseconds
  userId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const FraudRule = mongoose.model("FraudRule", fraudRuleSchema);
const FraudTransaction = mongoose.model("FraudTransaction", fraudTransactionSchema);
const DetectionAnalysis = mongoose.model("DetectionAnalysis", detectionAnalysisSchema);

// ✅ Helper function to extract amount from text
const extractAmount = (text) => {
  // Remove currency symbols and clean the text
  const cleaned = text.replace(/[\$₹€£Rs\.INR]/gi, '').trim();
  // Match numbers like 1,234.56 or 1234.56 or 1234
  const amountMatch = cleaned.match(/([\d,]+\.?\d*)/);
  if (amountMatch) {
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    return isNaN(amount) ? 0 : amount;
  }
  return 0;
};

// ✅ Helper function to extract date from text
const extractDate = (text) => {
  // Match various date formats
  const datePatterns = [
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,  // DD/MM/YYYY or MM/DD/YYYY
    /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/,    // YYYY-MM-DD
    /([A-Za-z]+\s+\d{1,2},?\s*\d{4})/,          // Month DD, YYYY
    /(\d{1,2}\s+[A-Za-z]+\s+\d{4})/             // DD Month YYYY
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// ✅ Helper function to parse PDF lines into transaction data
const parsePDFLines = (lines) => {
  const data = [];

  console.log('📊 Analyzing PDF content for transactions...');
  console.log(`📄 Total lines: ${lines.length}`);
  console.log('📄 First 10 lines:', lines.slice(0, 10));

  // Pattern to match any number that looks like an amount (with or without currency)
  const amountPattern = /(?:[\$₹€£]|Rs\.?|INR)?\s*([\d,]+\.?\d{0,2})\b/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.length < 5) continue;

    // Find all potential amounts in the line
    const amounts = [];
    let match;
    const tempLine = line;
    const regex = /(?:[\$₹€£]|Rs\.?|INR)?\s*([\d,]+\.?\d{0,2})\b/g;
    while ((match = regex.exec(tempLine)) !== null) {
      const amt = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amt) && amt > 0) {
        amounts.push(amt);
      }
    }

    if (amounts.length > 0) {
      // Get the largest amount (likely the transaction amount)
      const maxAmount = Math.max(...amounts);

      // Only consider significant amounts (> 10 to filter out dates/page numbers)
      if (maxAmount > 10) {
        // Try to extract date
        const dateStr = extractDate(line);

        // Clean description
        let description = line
          .replace(/[\$₹€£]?\s*[\d,]+\.?\d*/g, '')
          .replace(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Skip headers and totals
        const skipKeywords = ['total', 'balance', 'summary', 'page', 'statement', 'opening', 'closing', 'header', 'date', 'amount'];
        const isSkipLine = skipKeywords.some(kw => description.toLowerCase() === kw ||
          (description.toLowerCase().includes(kw) && description.length < 20));

        if (!isSkipLine && description.length > 2) {
          data.push({
            Date: dateStr || new Date().toLocaleDateString(),
            Amount: maxAmount,
            Description: description.substring(0, 100) || 'Transaction'
          });
          console.log(`   ✓ Found: "${description.substring(0, 30)}..." = ${maxAmount}`);
        }
      }
    }
  }

  // If no amounts found, try table parsing
  if (data.length === 0) {
    console.log('📋 Trying table-based parsing...');

    let headerIndex = -1;
    const commonHeaders = ['date', 'amount', 'description', 'transaction', 'debit', 'credit', 'balance', 'particulars', 'narration', 'details'];

    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const lineLower = lines[i].toLowerCase();
      const matchCount = commonHeaders.filter(h => lineLower.includes(h)).length;
      if (matchCount >= 2) {
        headerIndex = i;
        console.log(`✅ Found header at line ${i}: "${lines[i]}"`);
        break;
      }
    }

    if (headerIndex >= 0) {
      const header = lines[headerIndex].split(/\s{2,}|\t/).map(h => h.trim()).filter(h => h);

      for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(/\s{2,}|\t/).map(v => v.trim()).filter(v => v);

        if (values.length >= 2) {
          const row = {};
          header.forEach((key, index) => {
            row[key] = values[index] || '';
          });

          let amount = 0;
          for (const val of values) {
            const extracted = extractAmount(val);
            if (extracted > amount) amount = extracted;
          }

          if (amount > 10) {
            row.Amount = amount;
            data.push(row);
          }
        }
      }
    }
  }

  // Last resort: extract any line with numbers > 100 as potential transactions
  if (data.length === 0) {
    console.log('📋 Trying last resort parsing...');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const numbers = line.match(/\d[\d,]*\.?\d*/g);
      if (numbers) {
        for (const num of numbers) {
          const amt = parseFloat(num.replace(/,/g, ''));
          if (amt > 100 && amt < 10000000) { // Reasonable transaction range
            data.push({
              Date: extractDate(line) || new Date().toLocaleDateString(),
              Amount: amt,
              Description: line.replace(/[\d,\.]+/g, '').trim().substring(0, 100) || 'Transaction'
            });
            console.log(`   ✓ Last resort: ${amt}`);
            break; // One per line
          }
        }
      }
    }
  }

  console.log(`✅ Parsed ${data.length} transaction rows`);
  return data;
};

// ✅ Helper function to check if Poppler is available
const isPopperAvailable = () => {
  try {
    execSync('which pdftoppm', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// ✅ Helper function to perform OCR on scanned PDFs
const performOCR = async (filePath) => {
  console.log('🔍 Starting OCR process for scanned PDF...');

  // Check if Poppler is available
  if (!isPopperAvailable()) {
    throw new Error('OCR requires Poppler to be installed. Run: brew install poppler');
  }

  // Create temp directory for images
  const tempDir = path.join(path.dirname(filePath), `ocr_temp_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  let worker = null;

  try {
    // Convert PDF to images using pdftoppm (use 150 DPI for faster processing)
    console.log('📸 Converting PDF to images...');
    const outputPrefix = path.join(tempDir, 'page');

    try {
      execSync(`pdftoppm -png -r 150 "${filePath}" "${outputPrefix}"`, {
        stdio: 'pipe',
        timeout: 30000 // 30 second timeout
      });
    } catch (convertError) {
      console.error('❌ PDF to image conversion failed:', convertError.message);
      throw new Error('Failed to convert PDF to images for OCR');
    }

    // Get all generated images
    const images = fs.readdirSync(tempDir)
      .filter(f => f.endsWith('.png'))
      .sort()
      .map(f => path.join(tempDir, f));

    console.log(`📄 Generated ${images.length} image(s) from PDF`);

    if (images.length === 0) {
      throw new Error('Failed to convert PDF to images - no images generated');
    }

    // Perform OCR on each image
    let fullText = '';

    console.log('🔤 Initializing Tesseract OCR...');
    worker = await Tesseract.createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          console.log(`   OCR progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });

    for (let i = 0; i < images.length; i++) {
      console.log(`🔤 OCR processing page ${i + 1}/${images.length}...`);
      try {
        const { data: { text } } = await worker.recognize(images[i]);
        fullText += text + '\n';
        console.log(`   Page ${i + 1}: extracted ${text.length} characters`);
      } catch (pageError) {
        console.error(`❌ OCR failed for page ${i + 1}:`, pageError.message);
      }
    }

    console.log(`📝 OCR total extracted: ${fullText.length} characters`);
    if (fullText.length > 0) {
      console.log('📄 First 500 chars of OCR text:', fullText.substring(0, 500));
    }

    return fullText;
  } catch (error) {
    console.error('❌ OCR process error:', error.message);
    throw error;
  } finally {
    // Terminate worker if it exists
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {
        console.warn('⚠️ Could not terminate Tesseract worker');
      }
    }

    // Cleanup temp directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.warn('⚠️ Could not clean up temp directory:', e.message);
    }
  }
};

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
    } else if (fileType === 'pdf') {
      console.log('📄 Processing PDF file...');

      let extractedText = '';
      let textExtractionWorked = false;

      // Try pdf-parse first (more reliable for most PDFs)
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);

        console.log(`📊 PDF parsed: ${pdfData.numpages} page(s)`);
        console.log(`📝 Text length: ${pdfData.text.length} characters`);

        if (pdfData.text && pdfData.text.trim().length > 50) {
          extractedText = pdfData.text;
          textExtractionWorked = true;
          console.log('✅ pdf-parse extraction successful');
        } else {
          console.log('⚠️ pdf-parse extraction insufficient, trying pdf2json fallback...');
        }
      } catch (pdfParseError) {
        console.warn('⚠️ pdf-parse failed:', pdfParseError.message);
      }

      // Try pdf2json as fallback for text extraction
      if (!textExtractionWorked) {
        try {
          const pdf2jsonText = await new Promise((resolve, reject) => {
            const pdfParser = new PDFParser();

            pdfParser.on('pdfParser_dataError', (errData) => {
              reject(new Error(errData.parserError));
            });

            pdfParser.on('pdfParser_dataReady', (pdfData) => {
              let text = '';
              if (pdfData.Pages) {
                pdfData.Pages.forEach(page => {
                  if (page.Texts) {
                    page.Texts.forEach(textItem => {
                      if (textItem.R) {
                        textItem.R.forEach(run => {
                          try {
                            text += decodeURIComponent(run.T) + ' ';
                          } catch (e) {}
                        });
                      }
                      text += '\n';
                    });
                  }
                });
              }
              resolve(text);
            });

            pdfParser.loadPDF(filePath);
          });

          console.log(`📝 pdf2json extracted ${pdf2jsonText.length} characters`);

          if (pdf2jsonText.trim().length > 50) {
            extractedText = pdf2jsonText;
            textExtractionWorked = true;
            console.log('✅ pdf2json extraction successful');
          }
        } catch (pdf2jsonError) {
          console.warn('⚠️ pdf2json failed:', pdf2jsonError.message);
        }
      }

      // If text extraction failed, try OCR
      if (!textExtractionWorked) {
        console.log('📷 PDF appears to be scanned/image-based. Attempting OCR...');
        console.log('⏱️ OCR may take 1-2 minutes for scanned documents...');
        try {
          // Add 3 minute timeout for OCR
          const ocrPromise = performOCR(filePath);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('OCR timed out after 3 minutes')), 180000)
          );
          extractedText = await Promise.race([ocrPromise, timeoutPromise]);
          if (extractedText.trim().length > 50) {
            textExtractionWorked = true;
            console.log('✅ OCR extraction successful');
          }
        } catch (ocrError) {
          console.error('❌ OCR failed:', ocrError.message);
          try { fs.unlinkSync(filePath); } catch (e) {}
          throw new Error(`Could not extract text from PDF. OCR failed: ${ocrError.message}`);
        }
      }

      // Clean up file if not already cleaned
      try { fs.unlinkSync(filePath); } catch (e) {}

      if (!textExtractionWorked || extractedText.trim().length < 50) {
        throw new Error('PDF appears to be empty or could not be read. Please try uploading a CSV or Excel file instead.');
      }

      // Parse the extracted text
      console.log('📄 First 500 chars:', extractedText.substring(0, 500));
      const lines = extractedText.split('\n').filter(line => line.trim());
      console.log(`📋 Found ${lines.length} non-empty lines`);

      if (lines.length < 2) {
        throw new Error('PDF has insufficient data. Please upload a PDF with transaction data in table format.');
      }

      const result = parsePDFLines(lines);

      if (result.length === 0) {
        throw new Error('Could not identify transaction data in PDF. Please ensure the PDF contains a table with Date, Amount, and Description columns.');
      }

      console.log(`✅ Successfully extracted ${result.length} transactions from PDF`);
      return result;
    }

    throw new Error('Unsupported file type');
  } catch (error) {
    throw error;
  }
};

// ✅ 1. Upload and Process Transactions File
router.post("/upload", upload.single('file'), async (req, res) => {
  // Set longer timeout for OCR processing (5 minutes)
  req.setTimeout(300000);
  res.setTimeout(300000);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { algorithm, parameters, userId } = req.body;
    console.log('Request Body:', req.body);

    console.log('Algorithm:', algorithm);
    console.log('Parameters:', parameters);
    console.log('User ID:', userId);
    console.log('File:', req.file);
    const filePath = req.file.path;
    const fileType = req.file.originalname.split('.').pop().toLowerCase();

    // Upload to Supabase for backup (auto-deletes after 12 hours)
    let supabaseFile = null;
    try {
      supabaseFile = await uploadToSupabase(filePath, req.file.originalname);
      if (supabaseFile) {
        console.log(`☁️ File backed up to Supabase: ${supabaseFile.fileName}`);
      }
    } catch (supabaseError) {
      console.warn('⚠️ Supabase upload skipped:', supabaseError.message);
    }

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
      supabaseFilePath: supabaseFile?.fileName || null,
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
    // Clean up uploaded file if it still exists
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    // Ensure response is sent
    if (!res.headersSent) {
      res.status(500).json({
        message: "Error processing file",
        error: error.message
      });
    }
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