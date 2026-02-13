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
import PublicInvoiceView from "./pages/PublicInvoiceView";
import PublicPurchaseInvoiceView from "./pages/PublicPurchaseInvoiceView";
import ServerIssues from "./pages/ServerIssues";




const queryClient = new QueryClient();

const App = () => {
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "true";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Maintenance Mode Gates */}
            <Route
              path="/auth"
              element={isMaintenanceMode ? <ServerIssues /> : <Auth />}
            />

            <Route
              path="/dashboard"
              element={isMaintenanceMode ? <ServerIssues /> : <Dashboard />}
            />

            <Route path="/payroll" element={isMaintenanceMode ? <ServerIssues /> : <Payroll />} />
            <Route path="/tax-gst" element={isMaintenanceMode ? <ServerIssues /> : <TaxGST />} />
            <Route path="/balance-sheet" element={isMaintenanceMode ? <ServerIssues /> : <BalanceSheet />} />
            <Route path="/profit-loss" element={isMaintenanceMode ? <ServerIssues /> : <ProfitLoss />} />
            <Route path="/cashflow" element={isMaintenanceMode ? <ServerIssues /> : <CashFlow />} />
            <Route path="/civil-engineering" element={isMaintenanceMode ? <ServerIssues /> : <CivilEngineering />} />
            <Route path="/cashflow-statement" element={isMaintenanceMode ? <ServerIssues /> : <CashFlowStatement />} />
            <Route path="/financial-ratios" element={isMaintenanceMode ? <ServerIssues /> : <FinancialRatios />} />
            <Route path="/bookkeeping" element={isMaintenanceMode ? <ServerIssues /> : <Bookkeeping />} />
            <Route path="/inventory" element={isMaintenanceMode ? <ServerIssues /> : <Inventory />} />
            <Route path="/bank-reconciliation" element={isMaintenanceMode ? <ServerIssues /> : <BankReconciliation />} />
            <Route path="/fraud-detection" element={isMaintenanceMode ? <ServerIssues /> : <FraudDetection />} />
            <Route path="/invoice" element={isMaintenanceMode ? <ServerIssues /> : <AutomationInvoice />} />
            <Route path="/invoice/ocr" element={isMaintenanceMode ? <ServerIssues /> : <AutomationInvoice />} />
            <Route path="/invoice/view/:id" element={<PublicInvoiceView />} />
            <Route path="/purchase-invoice/view/:id" element={<PublicPurchaseInvoiceView />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};


export default App;
