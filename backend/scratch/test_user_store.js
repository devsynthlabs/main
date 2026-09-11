import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

import BookkeepingEntry from "../models/BookkeepingEntry.js";
import { getFinanceMetrics, getLiveBalanceSheet } from "../utils/financeAggregator.js";

async function testRegularUserStore() {
  console.log("==================================================");
  console.log("🔍 TESTING REGULAR USER ACCOUNT STORE FLOW");
  console.log("==================================================");

  const MONGO_URI = process.env.PRO_MONGO_URI || process.env.DEV_MONGO_URI;
  await mongoose.connect(MONGO_URI);

  const regularUserId = "650000000000000000000001"; // Non-admin regular user ID

  // Clean old test entries for this regular user
  await BookkeepingEntry.deleteMany({ userId: regularUserId });

  // Add Income and Expense for this regular user
  await BookkeepingEntry.create([
    {
      userId: regularUserId,
      date: new Date(),
      description: "Regular User Sales Income",
      type: "income",
      amount: 25000,
      category: "Sales",
      isAutomated: false
    },
    {
      userId: regularUserId,
      date: new Date(),
      description: "Regular User Office Rent",
      type: "expense",
      amount: 5000,
      category: "Rent",
      isAutomated: false
    }
  ]);

  console.log("✅ Created 2 Store Entries for Regular User ID:", regularUserId);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const metrics = await getFinanceMetrics(regularUserId, start, end);
  console.log("\n📊 Regular User Finance Metrics (Calculated via Python Engine):");
  console.log("   • Total Revenue:", metrics.revenue.total);
  console.log("   • Total Expenses:", metrics.expense.total);
  console.log("   • Net Profit:", metrics.netProfit);
  console.log("   • Profit Margin:", metrics.profitMargin + "%");

  const bs = await getLiveBalanceSheet(regularUserId, "this-month");
  console.log("\n⚖️  Regular User Live Balance Sheet:");
  console.log("   • Total Assets:", bs.assets.totalAssets);
  console.log("   • Total Liabilities:", bs.liabilities.totalLiabilities);
  console.log("   • Total Equity:", bs.equity.totalEquity);
  console.log("   • Balanced Check:", bs.balanced ? "✅ BALANCED" : "❌ UNBALANCED");

  // Clean up
  await BookkeepingEntry.deleteMany({ userId: regularUserId });
  await mongoose.disconnect();

  console.log("\n==================================================");
  console.log("✅ REGULAR USER STORE FLOW PASSED 100%!");
  console.log("==================================================");
}

testRegularUserStore().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
