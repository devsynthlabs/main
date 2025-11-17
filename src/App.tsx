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

import CashFlowStatement from "./pages/CashFlowStatement";
import FinancialRatios from "./pages/FinancialRatios";

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

          <Route path="/cashflow-statement" element={<CashFlowStatement />} />
          <Route path="/financial-ratios" element={<FinancialRatios />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
