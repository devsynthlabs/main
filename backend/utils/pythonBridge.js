import { execFile } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonScriptPath = path.join(__dirname, "../python_calc_engine.py");

const ALLOWLISTED_ACTIONS = new Set([
  "invoice.calculate",
  "purchase_invoice.calculate",
  "payroll.calculate",
  "gst.calculate",
  "profit_loss.calculate",
  "balance_sheet.calculate",
  "financial_ratios.calculate",
  "gst_analytics.calculate",
  "cash_flow.calculate",
  "bookkeeping.calculate",
  "bank_reconciliation.calculate",
  "inventory.calculate",
  "civil_engineering.calculate",
  "fraud_detection.calculate",
  // Legacy aliases for backward compatibility
  "profit_loss",
  "balance_sheet",
  "financial_ratios",
  "gst_analytics"
]);

/**
 * Invokes the Python calculation engine for financial report computations.
 * Enforces action allowlisting to prevent malicious or arbitrary command execution.
 * @param {string} action - Allowlisted calculation action
 * @param {object} payload - Input metrics data object
 * @returns {Promise<object>} - Parsed Python calculation results
 */
export function runPythonCalculation(action, payload) {
  return new Promise((resolve, reject) => {
    if (!ALLOWLISTED_ACTIONS.has(action)) {
      const err = new Error(`Unauthorized Python calculation action: ${action}`);
      console.error(`❌ Python Security Error: ${err.message}`);
      return reject(err);
    }

    const jsonPayload = JSON.stringify(payload);

    execFile("python3", [pythonScriptPath, action, jsonPayload], (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Python Calculation Bridge Error (${action}):`, stderr || error.message);
        return reject(error);
      }

      try {
        const result = JSON.parse(stdout.trim());
        if (result.error) {
          console.error(`❌ Python Engine Returned Error (${action}):`, result.error);
          return reject(new Error(result.error));
        }
        resolve(result);
      } catch (parseErr) {
        console.error(`❌ Python Bridge JSON Parse Error (${action}):`, stdout);
        reject(parseErr);
      }
    });
  });
}
