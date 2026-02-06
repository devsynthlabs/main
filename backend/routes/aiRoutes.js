import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadInvoiceFile } from "../utils/invoiceStorage.js";

const router = express.Router();

// Initialize Gemini AI lazily (after env is loaded by server.js)
let genAI = null;
const getGenAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("✅ Gemini AI initialized");
  }
  return genAI;
};

// Invoice OCR extraction prompt
const INVOICE_EXTRACTION_PROMPT = `You are an expert invoice data extractor. Analyze this invoice image and extract ALL information in a structured JSON format.

IMPORTANT RULES:
1. Extract ALL line items you can find in the invoice
2. For amounts, return numbers only (no currency symbols)
3. For dates, use YYYY-MM-DD format
4. If a field is not found, use null
5. Be thorough - extract every item, even if partially visible
6. For GST/Tax: look for SGST, CGST, IGST, VAT, or any tax percentage

Return ONLY valid JSON in this exact structure:
{
  "vendor": {
    "name": "Company/Vendor name from invoice",
    "address": "Full address if available",
    "gstin": "GST number if available",
    "phone": "Phone number if available",
    "email": "Email if available"
  },
  "invoice": {
    "number": "Invoice number",
    "date": "YYYY-MM-DD",
    "dueDate": "YYYY-MM-DD or null"
  },
  "customer": {
    "name": "Customer/Bill To name",
    "address": "Customer address if available",
    "gstin": "Customer GST if available",
    "phone": "Customer phone if available"
  },
  "items": [
    {
      "name": "Item/Product name",
      "description": "Description if available",
      "hsnCode": "HSN/SAC code if available",
      "quantity": 1,
      "unit": "Pcs/Kg/Nos etc",
      "rate": 100.00,
      "discount": 0,
      "taxPercent": 18,
      "taxAmount": 18.00,
      "amount": 118.00
    }
  ],
  "totals": {
    "subtotal": 100.00,
    "discountTotal": 0,
    "sgst": 9.00,
    "cgst": 9.00,
    "igst": 0,
    "taxTotal": 18.00,
    "grandTotal": 118.00,
    "amountPaid": 0,
    "balanceDue": 118.00
  },
  "paymentInfo": {
    "method": "cash/upi/bank_transfer/cheque/credit_card",
    "bankDetails": "Bank account details if available",
    "upiId": "UPI ID if available"
  },
  "notes": "Any additional notes or terms"
}

Analyze the invoice document (image or PDF) carefully and extract all data.`;

// POST /api/ai/invoice-ocr
router.post("/invoice-ocr", async (req, res) => {
  try {
    const { image, mimeType = "image/jpeg" } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image data is required"
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key not configured. Please add GEMINI_API_KEY to your .env file."
      });
    }

    console.log("🤖 Processing invoice with Gemini AI...");
    console.log("📄 File type:", mimeType);

    // Get Gemini AI instance
    const ai = getGenAI();
    if (!ai) {
      return res.status(500).json({
        success: false,
        message: "Gemini AI not initialized. Please check GEMINI_API_KEY in .env"
      });
    }

    // Get the Gemini model - using gemini-1.5-flash-latest for faster processing
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Remove data URL prefix if present (handles both images and PDFs)
    let base64Data = image;
    if (image.includes('base64,')) {
      base64Data = image.split('base64,')[1];
    }

    // Create the file part for Gemini (works for both images and PDFs)
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    // Generate content with the image
    const result = await model.generateContent([INVOICE_EXTRACTION_PROMPT, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log("📄 Raw Gemini Response:", text.substring(0, 500) + "...");

    // Parse the JSON response
    let extractedData;
    try {
      // Try to extract JSON from the response (it might have markdown code blocks)
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
        text.match(/```\s*([\s\S]*?)\s*```/) ||
        [null, text];

      const jsonStr = jsonMatch[1] || text;
      extractedData = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Try to salvage partial data
      try {
        // Remove any non-JSON text before/after
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          extractedData = JSON.parse(text.substring(jsonStart, jsonEnd));
        } else {
          throw new Error("Could not find valid JSON in response");
        }
      } catch (e) {
        return res.status(422).json({
          success: false,
          message: "Failed to parse AI response. The invoice may be unclear or in an unsupported format.",
          rawResponse: text.substring(0, 1000)
        });
      }
    }

    console.log("✅ Successfully extracted invoice data");

    // Store the uploaded file in Supabase (auto-deletes after 5 hours)
    let storageInfo = null;
    try {
      storageInfo = await uploadInvoiceFile(image, mimeType, 'invoice');
      if (storageInfo) {
        console.log(`📁 File stored in Supabase: ${storageInfo.fileName} (expires: ${storageInfo.expiresAt})`);
      }
    } catch (storageError) {
      console.warn("⚠️ Failed to store file in Supabase:", storageError.message);
      // Continue without storage - not critical
    }

    res.json({
      success: true,
      data: extractedData,
      message: "Invoice data extracted successfully",
      storage: storageInfo
    });

  } catch (error) {
    console.error("❌ Gemini AI Error:", error);

    // Handle specific Gemini errors
    if (error.message?.includes("API_KEY")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Gemini API key. Please check your configuration."
      });
    }

    if (error.message?.includes("SAFETY")) {
      return res.status(400).json({
        success: false,
        message: "Image was flagged by safety filters. Please try a different image."
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to process invoice with AI",
      error: error.message
    });
  }
});

// POST /api/ai/extract-text - Simple text extraction from image
router.post("/extract-text", async (req, res) => {
  try {
    const { image, mimeType = "image/jpeg" } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image data is required"
      });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key not configured"
      });
    }

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([
      "Extract all text from this image. Return only the text content, preserving the layout as much as possible.",
      imagePart
    ]);

    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      text: text,
      message: "Text extracted successfully"
    });

  } catch (error) {
    console.error("Text extraction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to extract text",
      error: error.message
    });
  }
});

export default router;
