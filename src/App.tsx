import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Payroll from "./pages/Payroll";
import TaxGST from "./pages/TaxGST";

import BalanceSheet from "./pages/BalanceSheet";
import ProfitLoss from "./pages/ProfitLoss";
import CashFlow from "./pages/CashFlow";
import NotFound from "./pages/NotFound";
import CivilEngineering from "./pages/CivilEngineering";

import CashFlowStatement from "./pages/CashFlowStatement";
import FinancialRatios from "./pages/FinancialRatios";
import Bookkeeping from "./pages/Bookkeeping";
import Inventory from "./pages/Inventory";
import BankReconciliation from "./pages/BankReconciliation";
import FraudDetection from "./pages/FraudDetection";
import AutomationInvoice from "./pages/AutomationInvoice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/tax-gst" element={<TaxGST />} />

          <Route path="/balance-sheet" element={<BalanceSheet />} />
          <Route path="/profit-loss" element={<ProfitLoss />} />
          <Route path="/cashflow" element={<CashFlow />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/civil-engineering" element={<CivilEngineering />} />

          <Route path="/cashflow-statement" element={<CashFlowStatement />} />
          <Route path="/financial-ratios" element={<FinancialRatios />} />
          <Route path="/bookkeeping" element={<Bookkeeping />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/bank-reconciliation" element={<BankReconciliation />} />
          <Route path="/fraud-detection" element={<FraudDetection />} />
          <Route path="/invoice" element={<AutomationInvoice />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
