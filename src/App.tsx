import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
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
import InvoiceTemplates from "./pages/InvoiceTemplates";
import InvoiceTemplateEditor from "./pages/InvoiceTemplateEditor";
import ThankYou from "./pages/ThankYou";

import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { SubscriptionGuard } from "@/components/SubscriptionGuard";

const queryClient = new QueryClient();

const RootRedirect = () => {
  const token = localStorage.getItem("token");
  return <Navigate to={token ? "/dashboard" : "/auth"} replace />;
};

const App = () => {
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "true";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SubscriptionProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootRedirect />} />

              {/* Maintenance Mode Gates */}
              <Route
                path="/auth"
                element={isMaintenanceMode ? <ServerIssues /> : <Auth />}
              />

              <Route
                path="/dashboard"
                element={isMaintenanceMode ? <ServerIssues /> : <Dashboard />}
              />

              <Route
                path="/profile"
                element={isMaintenanceMode ? <ServerIssues /> : <ProfileSettings />}
              />

              <Route
                path="/payroll"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="payroll"><Payroll /></SubscriptionGuard>}
              />
              <Route
                path="/tax-gst"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="tax-gst"><TaxGST /></SubscriptionGuard>}
              />
              <Route
                path="/balance-sheet"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="balance-sheet"><BalanceSheet /></SubscriptionGuard>}
              />
              <Route
                path="/profit-loss"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="profit-loss"><ProfitLoss /></SubscriptionGuard>}
              />
              <Route
                path="/cashflow"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="cashflow"><CashFlow /></SubscriptionGuard>}
              />
              <Route
                path="/civil-engineering"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="civil-engineering"><CivilEngineering /></SubscriptionGuard>}
              />
              <Route
                path="/cashflow-statement"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="cashflow-statement"><CashFlowStatement /></SubscriptionGuard>}
              />
              <Route
                path="/financial-ratios"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="financial-ratios"><FinancialRatios /></SubscriptionGuard>}
              />
              <Route
                path="/bookkeeping"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="bookkeeping"><Bookkeeping /></SubscriptionGuard>}
              />
              <Route
                path="/inventory"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="inventory"><Inventory /></SubscriptionGuard>}
              />
              <Route
                path="/bank-reconciliation"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="bank-reconciliation"><BankReconciliation /></SubscriptionGuard>}
              />
              <Route
                path="/fraud-detection"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="fraud-detection"><FraudDetection /></SubscriptionGuard>}
              />
              <Route
                path="/invoice"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="invoice"><AutomationInvoice /></SubscriptionGuard>}
              />
              <Route
                path="/invoice/templates"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="invoice"><InvoiceTemplates /></SubscriptionGuard>}
              />
              <Route
                path="/invoice/templates/create"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="invoice"><InvoiceTemplateEditor /></SubscriptionGuard>}
              />
              <Route
                path="/invoice/ocr"
                element={isMaintenanceMode ? <ServerIssues /> : <SubscriptionGuard module="invoice"><AutomationInvoice /></SubscriptionGuard>}
              />
              <Route path="/invoice/view/:id" element={<PublicInvoiceView />} />
              <Route path="/purchase-invoice/view/:id" element={<PublicPurchaseInvoiceView />} />
              <Route path="/thank-you" element={<ThankYou />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SubscriptionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
