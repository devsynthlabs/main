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

// OpenRouter fallback - uses OpenAI-compatible API
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
// Vision-capable models to try in order
const OPENROUTER_MODELS = [
  "openrouter/free",                      // Auto-routes to free models with vision
  "google/gemini-3-flash-preview",        // Latest Gemini on OpenRouter
  "google/gemini-2.0-flash",              // Gemini 2.0 on OpenRouter
];

const callOpenRouter = async (prompt, base64Data, mimeType) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  console.log("🔄 Falling back to OpenRouter...");

  let lastError = null;

  for (const model of OPENROUTER_MODELS) {
    try {
      console.log(`🔷 Trying OpenRouter model: ${model}`);

      const response = await fetch(OPENROUTER_BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5001",
          "X-Title": "Invoice OCR"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Data}`
                  }
                }
              ]
            }
          ],
          max_tokens: 4096
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.log(`⚠️ OpenRouter model ${model} failed: ${response.status}`);
        lastError = new Error(`OpenRouter API error ${response.status}: ${errorBody}`);
        continue;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text) {
        console.log(`⚠️ OpenRouter model ${model}: No content in response`);
        lastError = new Error("No content in OpenRouter response");
        continue;
      }

      console.log(`✅ OpenRouter success with model: ${model}`);
      return text;
    } catch (error) {
      console.log(`⚠️ OpenRouter model ${model} error: ${error.message}`);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All OpenRouter models failed");
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

// Helper: parse AI response text into structured JSON
const parseAIResponse = (text) => {
  // Try to extract JSON from the response (it might have markdown code blocks)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
    text.match(/```\s*([\s\S]*?)\s*```/) ||
    [null, text];

  const jsonStr = jsonMatch[1] || text;
  try {
    return JSON.parse(jsonStr.trim());
  } catch (parseError) {
    // Try to salvage partial data
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      return JSON.parse(text.substring(jsonStart, jsonEnd));
    }
    throw new Error("Could not find valid JSON in response");
  }
};

// Helper: process invoice with Gemini (primary)
const processWithGemini = async (base64Data, mimeType) => {
  const ai = getGenAI();
  if (!ai) throw new Error("Gemini AI not initialized");

  // Try multiple model options in order of preference
  // Note: 1.5 models are deprecated, only 2.0 models available
  const modelOptions = [
    "gemini-2.0-flash-lite",    // Lighter model (different quota pool)
    "gemini-2.0-flash",         // Latest flash model
  ];

  let lastError = null;

  for (const modelName of modelOptions) {
    try {
      console.log(`🔷 Trying model: ${modelName}`);
      const model = ai.getGenerativeModel({ model: modelName });

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };

      const result = await model.generateContent([INVOICE_EXTRACTION_PROMPT, imagePart]);
      const response = await result.response;
      console.log(`✅ Success with model: ${modelName}`);
      return response.text();
    } catch (error) {
      console.log(`⚠️ Model ${modelName} failed: ${error.message}`);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All Gemini models failed");
};

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

    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;

    if (!hasGemini && !hasOpenRouter) {
      return res.status(500).json({
        success: false,
        message: "No AI provider configured. Add GEMINI_API_KEY or OPENROUTER_API_KEY to .env"
      });
    }

    console.log("🤖 Processing invoice...");
    console.log("📄 File type:", mimeType);

    // Remove data URL prefix if present (handles both images and PDFs)
    let base64Data = image;
    if (image.includes('base64,')) {
      base64Data = image.split('base64,')[1];
    }

    let text = null;
    let provider = null;

    // Try Gemini first (primary)
    if (hasGemini) {
      try {
        console.log("🔷 Trying Gemini AI...");
        text = await processWithGemini(base64Data, mimeType);
        provider = "gemini";
        console.log("✅ Gemini response received");
      } catch (geminiError) {
        console.warn("⚠️ Gemini failed:", geminiError.message);

        // If OpenRouter is available, fall back to it
        if (hasOpenRouter) {
          console.log("🔄 Gemini failed, trying OpenRouter fallback...");
        } else {
          throw geminiError; // No fallback available
        }
      }
    }

    // Fallback to OpenRouter if Gemini failed or unavailable
    if (!text && hasOpenRouter) {
      try {
        console.log("🟠 Trying OpenRouter...");
        text = await callOpenRouter(INVOICE_EXTRACTION_PROMPT, base64Data, mimeType);
        provider = "openrouter";
        console.log("✅ OpenRouter response received");
      } catch (openRouterError) {
        console.error("❌ OpenRouter also failed:", openRouterError.message);
        throw openRouterError;
      }
    }

    if (!text) {
      return res.status(500).json({
        success: false,
        message: "All AI providers failed to process the invoice"
      });
    }

    console.log(`📄 Raw ${provider} Response:`, text.substring(0, 500) + "...");

    // Parse the JSON response
    let extractedData;
    try {
      extractedData = parseAIResponse(text);
    } catch (e) {
      return res.status(422).json({
        success: false,
        message: "Failed to parse AI response. The invoice may be unclear or in an unsupported format.",
        rawResponse: text.substring(0, 1000)
      });
    }

    console.log(`✅ Successfully extracted invoice data via ${provider}`);

    // Store the uploaded file in Supabase (auto-deletes after 5 hours)
    let storageInfo = null;
    try {
      storageInfo = await uploadInvoiceFile(image, mimeType, 'invoice');
      if (storageInfo) {
        console.log(`📁 File stored in Supabase: ${storageInfo.fileName} (expires: ${storageInfo.expiresAt})`);
      }
    } catch (storageError) {
      console.warn("⚠️ Failed to store file in Supabase:", storageError.message);
    }

    res.json({
      success: true,
      data: extractedData,
      message: `Invoice data extracted successfully via ${provider}`,
      provider: provider,
      storage: storageInfo
    });

  } catch (error) {
    console.error("❌ AI Processing Error:", error);

    if (error.message?.includes("API_KEY")) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key. Please check your configuration."
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

    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;

    if (!hasGemini && !hasOpenRouter) {
      return res.status(500).json({
        success: false,
        message: "No AI provider configured"
      });
    }

    const base64Image = image.includes('base64,') ? image.split('base64,')[1] : image;
    const extractPrompt = "Extract all text from this image. Return only the text content, preserving the layout as much as possible.";

    let text = null;

    // Try Gemini first with multiple model fallbacks
    if (hasGemini) {
      const modelOptions = ["gemini-2.0-flash-lite", "gemini-2.0-flash"];

      for (const modelName of modelOptions) {
        try {
          const ai = getGenAI();
          if (ai) {
            console.log(`🔷 Trying text extraction with: ${modelName}`);
            const model = ai.getGenerativeModel({ model: modelName });
            const result = await model.generateContent([
              extractPrompt,
              { inlineData: { data: base64Image, mimeType } }
            ]);
            text = (await result.response).text();
            console.log(`✅ Text extraction success with: ${modelName}`);
            break;
          }
        } catch (geminiError) {
          console.warn(`⚠️ ${modelName} failed:`, geminiError.message);
          continue;
        }
      }
    }

    // Fallback to OpenRouter
    if (!text && hasOpenRouter) {
      try {
        text = await callOpenRouter(extractPrompt, base64Image, mimeType);
      } catch (openRouterError) {
        console.error("❌ OpenRouter text extraction failed:", openRouterError.message);
        throw openRouterError;
      }
    }

    if (!text) {
      return res.status(500).json({
        success: false,
        message: "All AI providers failed"
      });
    }

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
