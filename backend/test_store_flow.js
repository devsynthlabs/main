import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import { getFinanceMetrics, getLiveBalanceSheet, resolvePeriod } from "./utils/financeAggregator.js";

async function verifyCentralStoreFlow() {
  console.log("==================================================");
  console.log("🔍 TESTING CENTRALIZED STORE FLOW (MongoDB -> Python Engines)");
  console.log("==================================================");

  const MONGO_URI = process.env.PRO_MONGO_URI || process.env.DEV_MONGO_URI || "mongodb://127.0.0.1:27017/Financialautomation";
  console.log("Connecting to MongoDB Store at:", MONGO_URI.substring(0, 35) + "...");
  await mongoose.connect(MONGO_URI);

  const testUserId = "000000000000000000000000";
  const period = resolvePeriod("this-month");

  console.log("\n1. Fetching Central Store Finance Metrics...");
  const metrics = await getFinanceMetrics(testUserId, period.startDate, period.endDate);
  console.log("📊 Store Metrics Aggregated:");
  console.log("   • Total Revenue (from Store): ₹" + metrics.revenue.total);
  console.log("   • Total Expenses (from Store): ₹" + metrics.expense.total);
  console.log("   • COGS:", metrics.expense.cogs);
  console.log("   • Net Profit (Python Calculated): ₹" + metrics.netProfit);
  console.log("   • Profit Margin (Python Calculated): " + metrics.profitMargin + "%");

  console.log("\n2. Fetching Central Store Live Balance Sheet...");
  const liveBS = await getLiveBalanceSheet(testUserId, "this-month");
  console.log("⚖️  Live Balance Sheet (Python Calculated from Store):");
  console.log("   • Total Assets: ₹" + liveBS.assets.totalAssets);
  console.log("   • Total Liabilities: ₹" + liveBS.liabilities.totalLiabilities);
  console.log("   • Total Equity: ₹" + liveBS.equity.totalEquity);
  console.log("   • Total Liabilities & Equity: ₹" + liveBS.totalLiabilitiesEquity);
  console.log("   • Accounting Equation Balance Check:", liveBS.balanced ? "✅ BALANCED (Assets = Liabilities + Equity)" : "❌ NOT BALANCED");

  console.log("\n==================================================");
  console.log("✅ CENTRALIZED DB STORE FLOW VERIFICATION COMPLETE!");
  console.log("==================================================");

  await mongoose.disconnect();
}

verifyCentralStoreFlow().catch(err => {
  console.error("❌ Central Store Test Error:", err);
  process.exit(1);
});
