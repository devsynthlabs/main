import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Boxes, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Calculator, 
  HelpCircle, 
  ArrowUp, 
  Layers, 
  Check, 
  FileText,
  FileCheck2, 
  Building2, 
  RefreshCw, 
  AlertTriangle, 
  BarChart3, 
  BookOpen, 
  Store, 
  Factory, 
  HardHat, 
  Truck, 
  Pill, 
  Laptop, 
  MessageSquare, 
  Mic, 
  Search, 
  ChevronRight, 
  Plus, 
  Minus, 
  Clock, 
  Sliders, 
  TrendingDown, 
  CheckCircle,
  Database,
  ArrowRightLeft,
  Warehouse,
  Flame,
  Shield,
  Activity,
  DollarSign,
  ShoppingCart,
  Link2,
  Eye,
  ArrowDown,
  Landmark,
  Award,
  Cloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrialFormModal } from "@/components/TrialFormModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// --- Sample Interactive Voice/Text Command Data ---
const INVENTORY_COMMANDS = [
  {
    id: "current-stock",
    title: "Check Current Stock",
    icon: Boxes,
    textCommand: "“Show my current stock.”",
    voiceCommand: "“Show my current stock.”",
    aiResponse: "The platform displays available inventory information based on the stock records maintained in AIBASS.",
    tag: "Live Stock Overview",
    color: "indigo"
  },
  {
    id: "product-quantity",
    title: "Review a Product Quantity",
    icon: Package,
    textCommand: "“Show the available quantity of this product.”",
    voiceCommand: "“Show the available quantity of this product.”",
    aiResponse: "AIBASS displays the available quantity recorded for the selected product.",
    tag: "Product Level Query",
    color: "sky"
  },
  {
    id: "low-stock",
    title: "Identify Low Stock Products",
    icon: AlertTriangle,
    textCommand: "“Show my low stock products.”",
    voiceCommand: "“Show my low stock products.”",
    aiResponse: "The platform displays available products identified with lower stock quantities.",
    tag: "Proactive Warning",
    color: "amber"
  }
];



// --- Stock Changes 6-Step Process Flow Data ---
const STOCK_FLOW_STEPS = [
  {
    step: "01",
    line1: "Purchase",
    line2: "Recorded",
    badgeBg: "bg-[#00c988]",
    circleStyle: "border-[#00c988]/30 shadow-[0_0_24px_rgba(0,201,136,0.18)] text-[#00c988]",
    icon: FileCheck2
  },
  {
    step: "02",
    line1: "Stock",
    line2: "Added",
    badgeBg: "bg-[#00c988]",
    circleStyle: "border-[#00c988]/30 shadow-[0_0_24px_rgba(0,201,136,0.18)] text-[#00c988]",
    icon: Plus
  },
  {
    step: "03",
    line1: "Product",
    line2: "Sold",
    badgeBg: "bg-[#1d75f2]",
    circleStyle: "border-[#1d75f2]/30 shadow-[0_0_24px_rgba(29,117,242,0.18)] text-[#1d75f2]",
    icon: ShoppingCart
  },
  {
    step: "04",
    line1: "Quantity",
    line2: "Reduced",
    badgeBg: "bg-[#ef4444]",
    circleStyle: "border-[#ef4444]/30 shadow-[0_0_24px_rgba(239,68,68,0.18)] text-[#ef4444]",
    icon: TrendingDown
  },
  {
    step: "05",
    line1: "Current",
    line2: "Stock Updated",
    badgeBg: "bg-[#9333ea]",
    circleStyle: "border-[#9333ea]/30 shadow-[0_0_24px_rgba(147,51,234,0.18)] text-[#9333ea]",
    icon: RefreshCw
  },
  {
    step: "06",
    line1: "Low",
    line2: "Stock Identified",
    badgeBg: "bg-[#f59e0b]",
    circleStyle: "border-[#f59e0b]/30 shadow-[0_0_24px_rgba(245,158,11,0.18)] text-[#f59e0b]",
    icon: AlertTriangle
  }
];

// --- 8 Core AI Inventory Management Software Features ---
const INVENTORY_SOFTWARE_FEATURES = [
  {
    title: "Inventory Linked with Accounting",
    desc: "Connect supported inventory activity with the wider accounting workflow instead of maintaining stock as a completely separate business record.",
    icon: Link2,
    iconBg: "bg-[#00c988]"
  },
  {
    title: "Text and Voice Commands",
    desc: "Use simple text or voice commands to request supported inventory information without navigating multiple software screens.",
    icon: Mic,
    iconBg: "bg-[#8b5cf6]"
  },
  {
    title: "Purchase Based Stock Updates",
    desc: "Record supported purchases and connect the relevant product quantities with inventory, reducing the need to update the same stock information separately.",
    icon: ShoppingCart,
    iconBg: "bg-[#1d75f2]"
  },
  {
    title: "Sales Based Inventory Updates",
    desc: "When supported product sales are recorded, AIBASS can reduce the corresponding quantities from available inventory.",
    icon: TrendingDown,
    iconBg: "bg-[#f04438]"
  },
  {
    title: "Current Stock Visibility",
    desc: "Review available product quantities using the inventory information recorded within AIBASS.",
    icon: Eye,
    iconBg: "bg-[#2563eb]"
  },
  {
    title: "Low Stock Identification",
    desc: "Identify products with lower available quantities so potential replenishment requirements become easier to review.",
    icon: AlertTriangle,
    iconBg: "bg-[#f59e0b]"
  },
  {
    title: "Connected Purchase Records",
    desc: "Connect supported product purchases with related supplier and purchase information.",
    icon: Building2,
    iconBg: "bg-[#00c988]"
  },
  {
    title: "Connected Sales Records",
    desc: "Keep supported product sales connected with relevant inventory reductions and sales information.",
    icon: FileText,
    iconBg: "bg-[#8b5cf6]"
  }
];

// --- How AIBASS Inventory Management Works (7-Step Workflow Data) ---
const INVENTORY_WORKFLOW_STEPS = [
  {
    step: "1",
    title: "Record a Purchase",
    desc: "Enter supported purchase and product information.",
    badgeBg: "bg-[#00c988]",
    circleStyle: "border-[#00c988]/30 shadow-[0_0_24px_rgba(0,201,136,0.16)] text-[#00c988]",
    icon: FileText
  },
  {
    step: "2",
    title: "Add Relevant Stock",
    desc: "The applicable product quantity is added to available inventory.",
    badgeBg: "bg-[#00c988]",
    circleStyle: "border-[#00c988]/30 shadow-[0_0_24px_rgba(0,201,136,0.16)] text-[#00c988]",
    icon: Plus
  },
  {
    step: "3",
    title: "Record Product Sales",
    desc: "Create or record a supported sales transaction containing the relevant product.",
    badgeBg: "bg-[#1d75f2]",
    circleStyle: "border-[#1d75f2]/30 shadow-[0_0_24px_rgba(29,117,242,0.16)] text-[#1d75f2]",
    icon: ShoppingCart
  },
  {
    step: "4",
    title: "Reduce Sold Quantities",
    desc: "The applicable quantity is reduced from available inventory.",
    badgeBg: "bg-[#f04438]",
    circleStyle: "border-[#f04438]/30 shadow-[0_0_24px_rgba(240,68,56,0.16)] text-[#f04438]",
    icon: ArrowDown
  },
  {
    step: "5",
    title: "Update Current Stock",
    desc: "Inventory information reflects the recorded purchase and sales activity.",
    badgeBg: "bg-[#9333ea]",
    circleStyle: "border-[#9333ea]/30 shadow-[0_0_24px_rgba(147,51,234,0.16)] text-[#9333ea]",
    icon: RefreshCw
  },
  {
    step: "6",
    title: "Identify Low Stock",
    desc: "Products with lower available quantities can be identified for further attention.",
    badgeBg: "bg-[#f59e0b]",
    circleStyle: "border-[#f59e0b]/30 shadow-[0_0_24px_rgba(245,158,11,0.16)] text-[#f59e0b]",
    icon: AlertTriangle
  },
  {
    step: "7",
    title: "Keep Financial Information Connected",
    desc: "Relevant purchase, sales and inventory information remains connected with supported accounting records.",
    badgeBg: "bg-[#0ea5e9]",
    circleStyle: "border-[#0ea5e9]/30 shadow-[0_0_24px_rgba(14,165,233,0.16)] text-[#0ea5e9]",
    icon: Landmark
  }
];

// --- Connect Inventory with Purchases, Sales and Accounting ---
const CONNECTED_INVENTORY_CARDS = [
  {
    title: "Purchases Add Stock",
    desc: "When a supported purchase is recorded, the relevant product quantity can be added to available inventory while the purchase information remains connected with bookkeeping records.",
    icon: Plus,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 border-emerald-100",
    badge: "Inward Sync"
  },
  {
    title: "Sales Reduce Stock",
    desc: "Supported product sales can reduce the relevant stock quantities while keeping sales, invoice and accounting information connected.",
    icon: TrendingDown,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50 border-rose-100",
    badge: "Outward Sync"
  },
  {
    title: "Low Stock Identification",
    desc: "AIBASS helps identify products with lower available quantities so businesses can review potential replenishment needs before stock becomes unavailable.",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 border-amber-100",
    badge: "Stock Alerts"
  },
  {
    title: "Connected GST Invoicing",
    desc: "For supported sales, applicable CGST and SGST for intrastate transactions or IGST for interstate transactions can be calculated while sold quantities remain connected with inventory.",
    icon: FileText,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50 border-indigo-100",
    badge: "GST Compliance"
  },
  {
    title: "Connected Financial Information",
    desc: "Purchase, sales and inventory activity can remain connected with bookkeeping and contribute to available monthly financial reports, category wise views and cash flow information.",
    icon: Landmark,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50 border-sky-100",
    badge: "Accounting Link"
  }
];

const CONNECTED_COMMERCE_PIPELINE = [
  {
    step: "01",
    label: "Purchase",
    detail: "Bill Recorded",
    icon: ShoppingCart,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50/80 border-blue-100",
  },
  {
    step: "02",
    label: "Stock Added",
    detail: "Qty Increased",
    icon: Plus,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50/80 border-emerald-100",
  },
  {
    step: "03",
    label: "Sale",
    detail: "Order Created",
    icon: TrendingUp,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50/80 border-indigo-100",
  },
  {
    step: "04",
    label: "GST & Invoice",
    detail: "Tax Computed",
    icon: FileText,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50/80 border-purple-100",
  },
  {
    step: "05",
    label: "Stock Reduced",
    detail: "Qty Deducted",
    icon: Minus,
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50/80 border-rose-100",
  },
  {
    step: "06",
    label: "Bookkeeping",
    detail: "Auto Journal",
    icon: BookOpen,
    iconColor: "text-cyan-600",
    bgColor: "bg-cyan-50/80 border-cyan-100",
  },
  {
    step: "07",
    label: "Financial Reports",
    detail: "P&L & Assets",
    icon: BarChart3,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50/80 border-amber-100",
  }
];

// --- Benefits of AIBASS AI Inventory Management Software ---
const INVENTORY_BENEFITS = [
  {
    title: "Reduce Separate Stock Updates",
    desc: "Connect supported purchase and sales activity with inventory quantities instead of updating stock separately after every transaction.",
    icon: RefreshCw,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50 border-indigo-100",
  },
  {
    title: "Know Current Stock Availability",
    desc: "Review available product quantities using connected inventory information.",
    icon: Eye,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 border-emerald-100",
  },
  {
    title: "Understand Why Stock Changed",
    desc: "Connect stock additions with purchases and stock reductions with sales.",
    icon: Activity,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50 border-purple-100",
  },
  {
    title: "Identify Low Stock Earlier",
    desc: "Find products with lower available quantities before they become unavailable.",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 border-amber-100",
  },
  {
    title: "Keep Purchases and Sales Connected",
    desc: "Maintain relevant purchase, sales and inventory information within one connected workflow.",
    icon: Link2,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50 border-sky-100",
  },
  {
    title: "Connect Inventory with Accounting",
    desc: "Keep stock activity connected with relevant bookkeeping and financial information.",
    icon: Landmark,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 border-blue-100",
  },
];

// --- AI Inventory Accounting Software for Different Businesses ---
const BUSINESS_INVENTORY_TYPES = [
  {
    id: "small-businesses",
    name: "Small Businesses",
    tagline: "Simplified Stock & Ledger",
    desc: "Manage available products, purchases and sales without maintaining completely separate stock and accounting records.",
    icon: Store,
    badge: "Unified Record",
    metrics: { inAction: "Purchase & Sales Auto-Sync", advantage: "Zero Duplicate Entry" },
    iconBg: "bg-indigo-50 border-indigo-100 text-indigo-600",
  },
  {
    id: "retailers",
    name: "Retailers",
    tagline: "Fast Counter & POS Updates",
    desc: "Connect product sales with stock reductions and identify products that may require replenishment.",
    icon: ShoppingCart,
    badge: "POS Integration",
    metrics: { inAction: "Sales Decrement & Restock Alert", advantage: "Prevent Stockouts" },
    iconBg: "bg-blue-50 border-blue-100 text-blue-600",
  },
  {
    id: "traders",
    name: "Traders",
    tagline: "Clear Movement Visibility",
    desc: "Maintain clearer stock visibility while connecting supported purchases and sales with inventory information.",
    icon: ArrowRightLeft,
    badge: "Trade Velocity",
    metrics: { inAction: "Real-time Buy/Sell Margin Link", advantage: "Full Inward/Outward Sync" },
    iconBg: "bg-emerald-50 border-emerald-100 text-emerald-600",
  },
  {
    id: "distributors",
    name: "Distributors",
    tagline: "Bulk Quantities & Multi-Location",
    desc: "Track available product quantities as supported purchase and sales activity is recorded.",
    icon: Truck,
    badge: "Depot Tracking",
    metrics: { inAction: "Batch & Route Stock Movement", advantage: "Multi-Godown Control" },
    iconBg: "bg-purple-50 border-purple-100 text-purple-600",
  },
  {
    id: "manufacturing",
    name: "Manufacturing Businesses",
    tagline: "Connected Production Accounting",
    desc: "Connect supported purchases, product sales and inventory information with the wider accounting workflow.",
    icon: Factory,
    badge: "Production Ledger",
    metrics: { inAction: "Raw Material to Finished Asset", advantage: "Automated COGS & Ledger" },
    iconBg: "bg-rose-50 border-rose-100 text-rose-600",
  },
  {
    id: "smes",
    name: "SMEs",
    tagline: "Scale Without Disconnection",
    desc: "Manage increasing purchase, sales and inventory activity through a connected business accounting platform.",
    icon: Building2,
    badge: "Scalable Suite",
    metrics: { inAction: "High Volume Commerce & GST Link", advantage: "Complete Financial Control" },
    iconBg: "bg-amber-50 border-amber-100 text-amber-600",
  }
];

// --- AIBASS Versus Manual Inventory Management Comparison Data ---
const AIBASS_VS_MANUAL_COMPARISON = [
  {
    dimension: "Stock Additions",
    manualType: "Manual inventory management",
    manualDesc: "Purchased quantities may need to be added to a separate inventory spreadsheet or system.",
    aibassType: "AIBASS",
    aibassDesc: "Supported purchase activity can add relevant quantities to inventory.",
    icon: Plus,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50 border-blue-100",
  },
  {
    dimension: "Stock Reductions",
    manualType: "Manual inventory management",
    manualDesc: "Sold products may need to be manually removed from stock records.",
    aibassType: "AIBASS",
    aibassDesc: "Supported product sales can reduce relevant available quantities.",
    icon: Minus,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50 border-rose-100",
  },
  {
    dimension: "Current Stock Visibility",
    manualType: "Manual inventory management",
    manualDesc: "Stock information may become outdated when purchase, sales and inventory records are maintained separately.",
    aibassType: "AIBASS",
    aibassDesc: "Available stock information reflects supported purchase and sales activity recorded within the connected workflow.",
    icon: Eye,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 border-emerald-100",
  },
  {
    dimension: "Low Stock Identification",
    manualType: "Manual inventory management",
    manualDesc: "Businesses may identify low stock only after manually reviewing product quantities.",
    aibassType: "AIBASS",
    aibassDesc: "Products with lower available quantities can be identified using current inventory information.",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 border-amber-100",
  },
  {
    dimension: "Accounting Connection",
    manualType: "Manual inventory management",
    manualDesc: "Stock and financial information may be maintained in separate systems.",
    aibassType: "AIBASS",
    aibassDesc: "Supported inventory activity remains connected with relevant accounting information.",
    icon: Landmark,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50 border-indigo-100",
  },
  {
    dimension: "Software Navigation",
    manualType: "Traditional inventory software",
    manualDesc: "Users may need to navigate multiple menus to find stock information.",
    aibassType: "AIBASS",
    aibassDesc: "Supported inventory information can be requested using simple text or voice commands.",
    icon: Mic,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50 border-purple-100",
  },
];

// --- Why Businesses Choose AIBASS Inventory Management Data ---
const WHY_CHOOSE_AIBASS_INVENTORY = [
  {
    id: "visibility",
    number: "01",
    title: "Current Inventory Visibility",
    desc: "Review available quantities without depending entirely on separate spreadsheets.",
    icon: Eye,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50 border-indigo-100",
    badge: "Real-Time Tracking",
  },
  {
    id: "low-stock",
    number: "02",
    title: "Low Stock Identification",
    desc: "Identify products that may require replenishment based on available stock information.",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50 border-amber-100",
    badge: "Proactive Warning",
  },
  {
    id: "voice-access",
    number: "03",
    title: "Text and Voice Access",
    desc: "Request supported inventory information using simple text or voice commands.",
    icon: Mic,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50 border-purple-100",
    badge: "Conversational AI",
  },
  {
    id: "accounting-sync",
    number: "04",
    title: "Connected Accounting",
    desc: "Keep inventory activity connected with relevant invoicing, bookkeeping, GST and financial information.",
    icon: Landmark,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50 border-emerald-100",
    badge: "Unified Ledgers",
  },
  {
    id: "aws-infra",
    number: "05",
    title: "Built on AWS Infrastructure",
    desc: "AIBASS runs on AWS infrastructure to support its cloud-based AI accounting, inventory and connected business workflows.",
    icon: Cloud,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50 border-sky-100",
    badge: "Cloud-Native Power",
  },
];

// --- See AIBASS Inventory Management in Action Data ---
const DEMO_FLOW_STEPS = [
  {
    step: "01",
    action: "Record a supported product purchase",
    detail: "Upload bill or enter purchase note with vendor, batch and tax info.",
    badge: "Inward Flow",
    icon: Plus,
    iconColor: "text-blue-600 bg-blue-50 border-blue-100",
    screenMatch: 2, // Purchase based stock addition
  },
  {
    step: "02",
    action: "Add the relevant quantity to inventory",
    detail: "Inventory quantities increment automatically across designated godowns.",
    badge: "Auto Increment",
    icon: Boxes,
    iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
    screenMatch: 1, // Current product quantities
  },
  {
    step: "03",
    action: "Review available stock",
    detail: "Inspect real-time product quantities, batch expiration and depot breakdown.",
    badge: "Live Visibility",
    icon: Eye,
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    screenMatch: 0, // Inventory dashboard
  },
  {
    step: "04",
    action: "Record a supported product sale",
    detail: "Generate customer GST invoice or POS billing entry with automatic tax calculation.",
    badge: "Outward Flow",
    icon: ShoppingCart,
    iconColor: "text-purple-600 bg-purple-50 border-purple-100",
    screenMatch: 5, // Connected sales information
  },
  {
    step: "05",
    action: "Reduce the sold quantity",
    detail: "Sold products decrement instantly from current stock without double entry.",
    badge: "Auto Deduct",
    icon: Minus,
    iconColor: "text-rose-600 bg-rose-50 border-rose-100",
    screenMatch: 3, // Sales based stock reduction
  },
  {
    step: "06",
    action: "Review the updated stock level",
    detail: "Verify remaining quantity, reorder threshold proximity, and stock velocity.",
    badge: "Real-Time Balance",
    icon: RefreshCw,
    iconColor: "text-sky-600 bg-sky-50 border-sky-100",
    screenMatch: 1, // Current product quantities
  },
  {
    step: "07",
    action: "Identify low stock products",
    detail: "Proactive AI highlights fast-depleting SKUs before they run out.",
    badge: "Proactive Warning",
    icon: AlertTriangle,
    iconColor: "text-amber-600 bg-amber-50 border-amber-100",
    screenMatch: 4, // Low stock identification
  },
  {
    step: "08",
    action: "Review connected accounting information",
    detail: "COGS, inventory asset balance, and GST ledgers update in sync.",
    badge: "Ledger Update",
    icon: Landmark,
    iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
    screenMatch: 6, // Connected purchase information
  },
  {
    step: "09",
    action: "Request supported inventory information using text or voice commands",
    detail: "Ask 'Show stock of Item X' or 'Which items are low?' for immediate answers.",
    badge: "Conversational AI",
    icon: Mic,
    iconColor: "text-violet-600 bg-violet-50 border-violet-100",
    screenMatch: 8, // Voice command interface
  },
];

const RECOMMENDED_PRODUCT_SCREENS = [
  { id: "dashboard", label: "Inventory dashboard", icon: BarChart3 },
  { id: "quantities", label: "Current product quantities", icon: Package },
  { id: "purchase-add", label: "Purchase based stock addition", icon: Plus },
  { id: "sales-reduce", label: "Sales based stock reduction", icon: Minus },
  { id: "low-stock", label: "Low stock identification", icon: AlertTriangle },
  { id: "connected-sales", label: "Connected sales information", icon: ShoppingCart },
  { id: "connected-purchase", label: "Connected purchase information", icon: FileText },
  { id: "text-cmd", label: "Text command interface", icon: MessageSquare },
  { id: "voice-cmd", label: "Voice command interface", icon: Mic },
];

export const AiInventoryManagementSoftware = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();



  // Interactive Voice/Text Command State
  const [activeCommandIdx, setActiveCommandIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [typingStage, setTypingStage] = useState<"typing" | "thinking" | "done">("typing");
  const [commandMode, setCommandMode] = useState<"text" | "voice">("text");



  // Interactive Commerce Pipeline Step Animation State
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [isPipelinePaused, setIsPipelinePaused] = useState(false);

  useEffect(() => {
    if (isPipelinePaused) return;
    const interval = setInterval(() => {
      setActivePipelineStep((prev) => (prev + 1) % CONNECTED_COMMERCE_PIPELINE.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isPipelinePaused]);

  // Interactive Business Types Showcase Animation State
  const [activeBizIdx, setActiveBizIdx] = useState(0);
  const [isBizPaused, setIsBizPaused] = useState(false);

  useEffect(() => {
    if (isBizPaused) return;
    const interval = setInterval(() => {
      setActiveBizIdx((prev) => (prev + 1) % BUSINESS_INVENTORY_TYPES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isBizPaused]);

  // Why Businesses Choose AIBASS Active State
  const [activeChooseIdx, setActiveChooseIdx] = useState(0);

  // See AIBASS in Action Demonstration State
  const [activeDemoStep, setActiveDemoStep] = useState(0);
  const [isDemoPaused, setIsDemoPaused] = useState(false);
  const [activeScreenTab, setActiveScreenTab] = useState(0);

  useEffect(() => {
    if (isDemoPaused) return;
    const interval = setInterval(() => {
      setActiveDemoStep((prev) => {
        const next = (prev + 1) % DEMO_FLOW_STEPS.length;
        setActiveScreenTab(DEMO_FLOW_STEPS[next].screenMatch);
        return next;
      });
    }, 3600);
    return () => clearInterval(interval);
  }, [isDemoPaused]);

  // Meta Title & Meta Description for SEO
  useEffect(() => {
    const title = "AI Inventory Management Software for Connected Stock | AIBASS";
    const description = "Track stock, connect purchases and sales with inventory quantities, identify low stock products and manage inventory with AIBASS AI inventory management software.";

    document.title = title;

    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      let el = document.querySelector(selector);
      if (el) {
        el.setAttribute(attribute, content);
      } else {
        el = document.createElement("meta");
        if (selector.includes('property=')) {
          const propName = selector.match(/property="([^"]+)"/)?.[1];
          if (propName) el.setAttribute("property", propName);
        } else if (selector.includes('name=')) {
          const nameVal = selector.match(/name="([^"]+)"/)?.[1];
          if (nameVal) el.setAttribute("name", nameVal);
        }
        el.setAttribute(attribute, content);
        document.head.appendChild(el);
      }
    };

    updateMetaTag('meta[name="description"]', "content", description);
    updateMetaTag('meta[property="og:title"]', "content", title);
    updateMetaTag('meta[property="og:description"]', "content", description);
    updateMetaTag('meta[name="twitter:title"]', "content", title);
    updateMetaTag('meta[name="twitter:description"]', "content", description);

    // Scroll top listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Typewriter effect for command simulation
  useEffect(() => {
    const currentCmd = INVENTORY_COMMANDS[activeCommandIdx];
    const textToType = commandMode === "text" ? currentCmd.textCommand : currentCmd.voiceCommand;
    
    setTypedText("");
    setTypingStage("typing");

    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= textToType.length) {
        setTypedText(textToType.slice(0, idx));
        idx++;
      } else {
        clearInterval(interval);
        setTypingStage("thinking");
        const timer = setTimeout(() => {
          setTypingStage("done");
        }, 600);
        return () => clearTimeout(timer);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [activeCommandIdx, commandMode]);




  // FAQ Schema JSON-LD Data for SEO
  const faqData = [
    {
      q: "What Is AI Inventory Management Software?",
      a: "AI inventory management software uses automation to help businesses organise stock information and simplify inventory activities. AIBASS connects supported purchases, sales and inventory quantities within its wider AI accounting platform."
    },
    {
      q: "What Should Businesses Look for in the Best AI Inventory Management Software?",
      a: "The best AI inventory management software should make stock easier to track, connect inventory changes with purchases and sales, provide current stock visibility and reduce repeated manual updates. AIBASS focuses on these connected inventory and accounting workflows."
    },
    {
      q: "How Does AIBASS Inventory Management Work?",
      a: "Supported purchases can add relevant product quantities to available inventory, while supported product sales can reduce the corresponding quantities. Businesses can then review current stock information and identify low stock products."
    },
    {
      q: "Does AIBASS Identify Low Stock Products?",
      a: "Yes. AIBASS helps identify products with lower available inventory quantities so businesses can review potential replenishment requirements."
    },
    {
      q: "Does AIBASS Connect Inventory with Accounting?",
      a: "Yes. Supported purchase, sales and inventory information can remain connected with relevant bookkeeping and accounting records."
    },
    {
      q: "Can I Use Text or Voice Commands for Inventory Management?",
      a: "Yes. Users can use supported text or voice commands to request available inventory information."
    },
    {
      q: "Is AIBASS Inventory Management Suitable for Small Businesses?",
      a: "Yes. Small businesses can use AIBASS to keep purchases, sales, stock information and relevant accounting records connected within one platform."
    },
    {
      q: "Does AIBASS Automatically Purchase Low Stock Products?",
      a: "No. AIBASS can identify products with low available quantities, but purchasing and replenishment decisions remain with the business."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* JSON-LD Structured Data for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AIBASS AI Inventory Management Software",
            "operatingSystem": "Web, Cloud, Windows, macOS, iOS, Android",
            "applicationCategory": "BusinessApplication",
            "description": "Track stock, connect purchases and sales with inventory quantities, identify low stock products and manage inventory with AIBASS AI inventory management software.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED"
            }
          })
        }}
      />

      {/* Global Header */}
      <Header />

      <main className="relative pt-24 lg:pt-28 pb-16">
        
        {/* ── SECTION 1: HERO SECTION (MATCHING REFERENCE IMAGE) ──────────────────── */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 sm:pt-10 pb-16 lg:pb-20">
          
          {/* Subtle background radial ambient glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-gradient-to-b from-indigo-100/50 via-purple-50/30 to-transparent blur-3xl -z-10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* ── LEFT COLUMN: Text Content & Highlights ── */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-slate-950 leading-[1.18]"
              >
                AI Inventory Management Software for{" "}
                <span className="text-[#5b52f9] bg-gradient-to-r from-[#5b52f9] to-[#7c3aed] bg-clip-text text-transparent">
                  Smarter Stock Tracking
                </span>
              </motion.h1>

              {/* Subtitle / Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl"
              >
                Track stock, purchases and sales in one connected AI inventory system. AIBASS updates stock from recorded purchases and supported sales, identifies low stock products and connects inventory with accounting.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap items-center gap-3.5 pt-1"
              >
                <Button
                  size="lg"
                  onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                  className="h-12 px-7 rounded-xl bg-[#5b52f9] hover:bg-[#4f46e5] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Start 30 Day Free Trial
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                  className="h-12 px-7 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#5b52f9] text-[#5b52f9] text-sm font-bold shadow-xs hover:shadow transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Book a Free Demo
                </Button>
              </motion.div>

              {/* Product Highlights Section */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-4 space-y-3.5"
              >
                <h3 className="text-sm sm:text-base font-extrabold text-[#5b52f9] tracking-tight">
                  Product Highlights
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
                  {/* Highlight 1 */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group"
                  >
                    <div className="h-11 w-11 rounded-xl bg-indigo-50/90 border border-indigo-100 flex items-center justify-center text-[#5b52f9] group-hover:scale-110 transition-transform">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 leading-snug">
                      Purchase based stock additions
                    </span>
                  </motion.div>

                  {/* Highlight 2 */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group"
                  >
                    <div className="h-11 w-11 rounded-xl bg-indigo-50/90 border border-indigo-100 flex items-center justify-center text-[#5b52f9] group-hover:scale-110 transition-transform">
                      <TrendingDown className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 leading-snug">
                      Sales based stock reductions
                    </span>
                  </motion.div>

                  {/* Highlight 3 */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group"
                  >
                    <div className="h-11 w-11 rounded-xl bg-amber-50/90 border border-amber-100 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 leading-snug">
                      Low stock identification
                    </span>
                  </motion.div>

                  {/* Highlight 4 */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group"
                  >
                    <div className="h-11 w-11 rounded-xl bg-cyan-50/90 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                      <Link2 className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 leading-snug">
                      Inventory and accounting connection
                    </span>
                  </motion.div>
                </div>
              </motion.div>

            </div>

            {/* ── RIGHT COLUMN: Reference Dashboard Mockup Card ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              
              {/* Outer Dashboard Card */}
              <div className="bg-white rounded-[28px] border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-5 sm:p-6 space-y-4 sm:space-y-5 relative overflow-hidden">
                
                {/* 1. Header: Inventory Overview */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                    Inventory Overview
                  </h3>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Synced
                  </span>
                </div>

                {/* 2. Top 4 Metric Summary Pills */}
                <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                  {/* Total Products */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-left">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 block leading-tight">
                      Total Products
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900 mt-0.5 block">
                      250
                    </span>
                  </div>

                  {/* In Stock */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-left">
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 block leading-tight">
                      In Stock
                    </span>
                    <span className="text-base sm:text-lg font-black text-emerald-900 mt-0.5 block">
                      186
                    </span>
                  </div>

                  {/* Low Stock */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-left">
                    <span className="text-[9px] sm:text-[10px] font-bold text-amber-700 block leading-tight">
                      Low Stock
                    </span>
                    <span className="text-base sm:text-lg font-black text-amber-900 mt-0.5 block">
                      18
                    </span>
                  </div>

                  {/* Out of Stock */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-left">
                    <span className="text-[9px] sm:text-[10px] font-bold text-rose-700 block leading-tight">
                      Out of Stock
                    </span>
                    <span className="text-base sm:text-lg font-black text-rose-900 mt-0.5 block">
                      6
                    </span>
                  </div>
                </div>

                {/* 3. Middle Section: 2 Charts Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  
                  {/* Stock Summary Area Wave Chart */}
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2 relative">
                    <span className="text-xs font-bold text-slate-800 block">Stock Summary</span>
                    
                    <div className="relative h-24 sm:h-28 w-full pt-2">
                      {/* Floating Tooltip Pin */}
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-0.5 right-2 bg-white/95 border border-slate-200/90 rounded-lg px-2 py-1 shadow-sm text-right z-10"
                      >
                        <span className="text-[8px] font-semibold text-slate-400 block leading-tight">Current Stock</span>
                        <span className="text-[11px] font-extrabold text-slate-900 leading-tight">1,250 Units</span>
                      </motion.div>

                      {/* SVG Spline Wave Curve */}
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="heroStockAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area Fill */}
                        <path
                          d="M 0 60 Q 25 65, 50 40 T 100 50 T 150 20 T 200 35 L 200 80 L 0 80 Z"
                          fill="url(#heroStockAreaGrad)"
                        />
                        {/* Smooth Line */}
                        <path
                          d="M 0 60 Q 25 65, 50 40 T 100 50 T 150 20 T 200 35"
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Interactive Peak Dot */}
                        <circle cx="150" cy="20" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse" />
                      </svg>
                    </div>
                  </div>

                  {/* Stock by Status Donut Chart */}
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Stock by Status</span>
                    
                    <div className="flex items-center justify-between pt-1 gap-2">
                      {/* Animated Donut SVG */}
                      <div className="relative h-20 w-20 shrink-0">
                        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                          {/* Background Circle */}
                          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f1f5f9" strokeWidth="5" />
                          {/* In Stock 75% (Blue/Indigo) */}
                          <motion.circle
                            initial={{ strokeDasharray: "0 100" }}
                            animate={{ strokeDasharray: "66 100" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            cx="18" cy="18" r="14" fill="transparent"
                            stroke="#4f46e5" strokeWidth="5"
                            strokeDashoffset="0"
                          />
                          {/* Low Stock 15% (Amber) */}
                          <motion.circle
                            initial={{ strokeDasharray: "0 100" }}
                            animate={{ strokeDasharray: "13.2 100" }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            cx="18" cy="18" r="14" fill="transparent"
                            stroke="#f59e0b" strokeWidth="5"
                            strokeDashoffset="-66"
                          />
                          {/* Out of Stock 10% (Rose) */}
                          <motion.circle
                            initial={{ strokeDasharray: "0 100" }}
                            animate={{ strokeDasharray: "8.8 100" }}
                            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            cx="18" cy="18" r="14" fill="transparent"
                            stroke="#f43f5e" strokeWidth="5"
                            strokeDashoffset="-79.2"
                          />
                        </svg>
                      </div>

                      {/* Donut Legend */}
                      <div className="space-y-1.5 text-[10px] font-bold">
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="h-2 w-2 rounded-full bg-[#4f46e5]" />
                            In Stock
                          </span>
                          <span className="text-slate-900">75%</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                            Low Stock
                          </span>
                          <span className="text-slate-900">15%</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="h-2 w-2 rounded-full bg-[#f43f5e]" />
                            Out of Stock
                          </span>
                          <span className="text-slate-900">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 4. Bottom Section: Recent Stock Activity Live Feed & 3D Rendered Stock Boxes */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Left Column: Activity List */}
                    <div className="flex-1 space-y-2">
                      <span className="text-xs font-extrabold text-slate-900 block">
                        Recent Stock Activity
                      </span>

                      <div className="space-y-1.5 text-xs">
                        {/* Purchase Recorded */}
                        <div className="flex items-center justify-between py-0.5">
                          <div className="flex items-center gap-2">
                            <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-3 w-3" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700">Purchase Recorded</span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-600 ml-3">+120 Units</span>
                        </div>

                        {/* Stock Added */}
                        <div className="flex items-center justify-between py-0.5">
                          <div className="flex items-center gap-2">
                            <div className="h-4.5 w-4.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <Plus className="h-3 w-3" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700">Stock Added</span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-600 ml-3">+120 Units</span>
                        </div>

                        {/* Product Sold */}
                        <div className="flex items-center justify-between py-0.5">
                          <div className="flex items-center gap-2">
                            <div className="h-4.5 w-4.5 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                              <TrendingDown className="h-3 w-3" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700">Product Sold</span>
                          </div>
                          <span className="text-[11px] font-bold text-rose-600 ml-3">-30 Units</span>
                        </div>

                        {/* Stock Reduced */}
                        <div className="flex items-center justify-between py-0.5">
                          <div className="flex items-center gap-2">
                            <div className="h-4.5 w-4.5 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                              <Minus className="h-3 w-3" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700">Stock Reduced</span>
                          </div>
                          <span className="text-[11px] font-bold text-rose-600 ml-3">-30 Units</span>
                        </div>

                        {/* Current Stock Updated */}
                        <div className="flex items-center justify-between py-0.5">
                          <div className="flex items-center gap-2">
                            <div className="h-4.5 w-4.5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                              <RefreshCw className="h-3 w-3" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700">Current Stock Updated</span>
                          </div>
                          <span className="text-[11px] font-extrabold text-slate-900 ml-3">1,250 Units</span>
                        </div>

                        {/* Low Stock Identified */}
                        <div className="flex items-center justify-between py-0.5">
                          <div className="flex items-center gap-2">
                            <div className="h-4.5 w-4.5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                              <AlertTriangle className="h-3 w-3" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700">Low Stock Identified</span>
                          </div>
                          <span className="text-[11px] font-bold text-amber-600 ml-3">18 Products</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: 3D Rendered Delivery Boxes (Static, crisp, zero overlap) */}
                    <div className="w-32 sm:w-36 lg:w-40 shrink-0 self-center flex items-center justify-center pointer-events-none select-none">
                      <img
                        src="/images/inventory-boxes-3d.jpg"
                        alt="Inventory stock cartons"
                        className="w-full h-auto object-contain drop-shadow-sm rounded-2xl"
                      />
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </section>


        {/* ── SECTION 2: TRACK STOCK CHANGES FLOW SECTION (ENHANCED OPEN LAYOUT) ── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 lg:py-20 space-y-10">
          
          {/* Header & Subtitle */}
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#5b52f9] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Real-Time Inventory Lifecycle</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-black tracking-tight text-slate-950 leading-[1.2]">
              Track Stock Changes with{" "}
              <span className="text-[#5b52f9] bg-gradient-to-r from-[#5b52f9] via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Inventory Management Software
              </span>
            </h2>
            
            <div className="space-y-3 text-sm sm:text-base lg:text-[17px] text-slate-600 font-medium leading-relaxed">
              <p>
                AIBASS connects inventory movements with the purchase and sales activity behind them, helping businesses understand not only the available quantity but also why stock increased or decreased.
              </p>
              <p>
                When supported purchases are recorded, relevant product quantities can be added to inventory. When products are included in supported sales transactions, the corresponding quantities can be reduced.
              </p>
            </div>
          </div>

          {/* Horizontal 6-Step Process Flow matching 2nd image */}
          <div className="relative pt-4 pb-2">
            <div className="overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="min-w-[760px] lg:min-w-full relative">
                
                {/* Continuous Connecting Line Passing Through Exact Center of Circles & Chevrons */}
                <div className="absolute top-[48px] sm:top-[56px] left-[50px] right-[50px] h-[1.5px] bg-slate-200 z-0 pointer-events-none" />

                <div className="flex items-start justify-between relative z-10">
                  {STOCK_FLOW_STEPS.map((stepItem, idx) => {
                    const Icon = stepItem.icon;

                    return (
                      <React.Fragment key={stepItem.step}>
                        {/* Step Column */}
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: idx * 0.06 }}
                          className="flex flex-col items-center text-center flex-1 group"
                        >
                          {/* Circle Row Area (Height matches Chevron Row to ensure 100% middle alignment) */}
                          <div className="h-24 sm:h-28 flex items-center justify-center relative w-full">
                            <div className="relative">
                              {/* Top Centered Step Number Badge */}
                              <span
                                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-xs z-20 ${stepItem.badgeBg}`}
                              >
                                {stepItem.step}
                              </span>

                              {/* Main Circular Node */}
                              <motion.div
                                whileHover={{ scale: 1.06 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-2 flex items-center justify-center transition-all ${stepItem.circleStyle}`}
                              >
                                <Icon className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={2} />
                              </motion.div>
                            </div>
                          </div>

                          {/* Title Label Below */}
                          <div className="mt-2 text-center">
                            <span className="text-xs sm:text-[13px] lg:text-sm font-bold text-slate-800 leading-snug block tracking-tight">
                              {stepItem.line1}
                              <br />
                              {stepItem.line2}
                            </span>
                          </div>
                        </motion.div>

                        {/* Connecting Chevron Circle */}
                        {idx < STOCK_FLOW_STEPS.length - 1 && (
                          <div className="h-24 sm:h-28 flex items-center justify-center shrink-0 px-0.5 sm:px-1 z-10">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-slate-400 shadow-2xs">
                              <ChevronRight className="h-4 w-4 stroke-[2.2] text-slate-400" />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ── SECTION 3: OUR AI INVENTORY MANAGEMENT SOFTWARE FEATURES (8-CARD GRID) ── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 lg:py-16">
          
          {/* Header & Subtitle */}
          <div className="text-center space-y-3 max-w-4xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black tracking-tight text-slate-900 leading-tight">
              Our AI Inventory Management Software Features
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              AIBASS provides an AI based inventory management approach that connects stock tracking with purchase, sales and accounting information to simplify everyday inventory control.
            </p>
          </div>

          {/* 8-Card Responsive Grid (4 columns x 2 rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {INVENTORY_SOFTWARE_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-start"
                >
                  {/* Top Row: Icon + Title */}
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${feature.iconBg}`}>
                      <Icon className="h-6 w-6" strokeWidth={2.2} />
                    </div>
                    <h3 className="text-[15px] sm:text-base font-bold text-slate-900 leading-snug tracking-tight">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>





        {/* ── SECTION 4: MANAGE INVENTORY THROUGH TEXT OR VOICE COMMANDS ─────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-slate-50/70 border-y border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Title, Subtitle, Command Selection Buttons, CTA */}
              <div className="lg:col-span-5 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#5b52f9] text-xs font-bold uppercase tracking-wider">
                  <Mic className="h-3.5 w-3.5" />
                  <span>Conversational Control</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                  Manage Inventory Through Text or Voice Commands
                </h2>

                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  With AI powered inventory management, AIBASS allows users to request supported inventory information using simple text or voice instructions.
                </p>

                {/* Command Selection Buttons */}
                <div className="flex flex-col gap-2.5 pt-2">
                  {INVENTORY_COMMANDS.map((cmd, idx) => {
                    const isSelected = activeCommandIdx === idx;
                    const IconComponent = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => setActiveCommandIdx(idx)}
                        className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.02]"
                            : "bg-white border-slate-200/90 text-slate-800 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"
                          }`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold">
                            {cmd.title}
                          </span>
                        </div>
                        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? "translate-x-1 text-indigo-400" : "text-slate-400 group-hover:translate-x-0.5"
                        }`} />
                      </button>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <div className="pt-3">
                  <Button
                    onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                    className="rounded-xl bg-[#5b52f9] hover:bg-indigo-600 text-white font-bold px-7 h-12 text-sm shadow-md hover:shadow-indigo-500/25 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                  >
                    <span>Experience AI Inventory Management</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Animated SoundWave Visualizer + Live Terminal */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Audio Wave Visualizer Box */}
                <div className="relative w-full h-44 sm:h-52 bg-slate-950 rounded-3xl flex flex-col items-center justify-center overflow-hidden border border-slate-800 shadow-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#312e81,transparent_70%)] opacity-40" />
                  
                  {/* Animated Sound Waves */}
                  <div className="flex items-end gap-1.5 h-16 mb-3 relative z-10">
                    {[1.2, 2.5, 1.7, 3.2, 0.8, 2.1, 3.8, 1.4, 2.9, 1.1, 2.4, 1.6, 2.0, 3.1, 1.3].map((speed, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-indigo-500 rounded-full"
                        animate={{ height: [10, 48, 10] }}
                        transition={{
                          repeat: Infinity,
                          duration: speed,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-indigo-300 relative z-10">
                    <Mic className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                    <span>AI Voice & Natural Language Processor Active</span>
                  </div>
                </div>

                {/* Simulation Output Terminal Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 text-left space-y-4 shadow-lg">
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Sparkles className="h-3.5 w-3.5 text-[#5b52f9]" />
                      Selected Simulation Terminal
                    </span>
                    <span className="text-[#5b52f9] font-bold">Active Instruction</span>
                  </div>

                  {/* User Command */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      User command:
                    </span>
                    <div className="bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm p-3.5 rounded-xl border border-slate-800 flex items-center min-h-[44px]">
                      <span>{typedText}</span>
                      {typingStage === "typing" && (
                        <span className="inline-block w-2 h-4 bg-indigo-400 ml-1 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* AIBASS Response */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">
                      AIBASS response:
                    </span>
                    <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-100/90 text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed min-h-[58px] flex items-center">
                      {typingStage === "thinking" ? (
                        <div className="flex items-center gap-2 text-indigo-600 font-mono text-xs">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Processing instruction...</span>
                        </div>
                      ) : (
                        <p>{INVENTORY_COMMANDS[activeCommandIdx].aiResponse}</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ── SECTION 5: HOW AIBASS INVENTORY MANAGEMENT WORKS (7-STEP WORKFLOW) ── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 lg:py-20 space-y-12">
          
          {/* Header & Subtitle */}
          <div className="text-center space-y-3 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-slate-900 leading-tight">
              How AIBASS Inventory Management Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              The AIBASS AI inventory management system connects supported purchase and sales activity with relevant stock information so inventory changes remain linked with the transactions behind them.
            </p>
          </div>

          {/* 7-Step Responsive Horizontal Process Flow */}
          <div className="overflow-x-auto pb-6 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-start justify-between min-w-[980px] lg:min-w-full gap-1 sm:gap-2">
              {INVENTORY_WORKFLOW_STEPS.map((stepItem, idx) => {
                const Icon = stepItem.icon;
                return (
                  <React.Fragment key={stepItem.step}>
                    {/* Step Node Column */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      className="flex flex-col items-center text-center flex-1 max-w-[170px]"
                    >
                      {/* Circle Row with Top Number Badge */}
                      <div className="h-20 sm:h-24 flex items-center justify-center relative w-full">
                        <div className="relative">
                          {/* Top Centered Step Number Badge */}
                          <span
                            className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-black text-white shadow-xs z-20 ${stepItem.badgeBg}`}
                          >
                            {stepItem.step}
                          </span>

                          {/* Circular Node */}
                          <motion.div
                            whileHover={{ scale: 1.06 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-2 flex items-center justify-center transition-all ${stepItem.circleStyle}`}
                          >
                            <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Title & Description Below */}
                      <div className="mt-3 space-y-1 text-center px-1">
                        <h3 className="text-xs sm:text-[13px] lg:text-sm font-bold text-slate-900 leading-snug tracking-tight">
                          {stepItem.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-normal leading-relaxed">
                          {stepItem.desc}
                        </p>
                      </div>
                    </motion.div>

                    {/* Dashed Arrow Connector between steps */}
                    {idx < INVENTORY_WORKFLOW_STEPS.length - 1 && (
                      <div className="h-20 sm:h-24 flex items-center justify-center shrink-0 px-0.5 z-10">
                        <svg
                          className="w-5 sm:w-7 lg:w-9 h-3 text-indigo-400/80 shrink-0"
                          viewBox="0 0 40 12"
                          fill="none"
                        >
                          <path
                            d="M0 6h34m-4-4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeDasharray="3 2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Bottom Callout Text & CTA Button */}
          <div className="text-center space-y-6 pt-4 max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              This workflow helps businesses move from recording commercial activity to understanding current stock availability without maintaining disconnected processes.
            </p>
            <div>
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="rounded-xl bg-[#5b52f9] hover:bg-indigo-600 text-white font-bold px-8 h-12 text-sm shadow-md hover:shadow-indigo-500/25 transition-all hover:scale-105 cursor-pointer inline-flex items-center gap-2"
              >
                <span>See AIBASS Inventory in Action</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </section>


        {/* ── SECTION 6: BUILT BY A RECOGNIZED AI ACCOUNTING COMPANY ────────────── */}
        <section className="py-16 sm:py-20 lg:py-24 bg-slate-50/60 border-y border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Header & Subtitle */}
            <div className="text-center space-y-3 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#5b52f9] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Credibility & Heritage</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-slate-900 leading-tight">
                Built by a Recognized AI Accounting Company
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
                AIBASS is developed by Shree Andal AI Software Solutions (OPC) Private Limited, the company behind its connected AI accounting and inventory workflows.
              </p>
            </div>

            {/* 2 Key Recognition Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
              
              {/* Card 1: DPIIT Recognized Startup */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all space-y-4 text-left relative overflow-hidden group"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shadow-2xs">
                  <img
                    src="/images/download 1.png"
                    alt="DPIIT Recognized Startup Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      DPIIT Recognized Startup
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Govt of India
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    Shree Andal AI Software Solutions is a DPIIT-recognized startup in the AI and Machine Learning sector, providing a clear company and technology foundation behind AIBASS.
                  </p>
                </div>
              </motion.div>

              {/* Card 2: AI Company of the Year */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all space-y-4 text-left relative overflow-hidden group"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform shadow-2xs">
                  <Award className="h-7 w-7 text-amber-600" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      AI Company of the Year – Accounting Software 2026
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      SiliconIndia
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    Shree Andal AI Software Solutions was also recognized by SiliconIndia Magazine as AI Company of the Year – Accounting Software 2026, reflecting its focus on applying AI and practical methodologies to accounting and business requirements.
                  </p>
                </div>
              </motion.div>

            </div>

            {/* Bottom Highlight Callout Statement */}
            <div className="max-w-4xl mx-auto p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
              <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                AIBASS brings this foundation into inventory management by connecting supported purchases, sales, stock quantities and accounting information within one business workflow.
              </p>
            </div>

          </div>
        </section>


        {/* ── SECTION 7: CONNECT INVENTORY WITH PURCHASES, SALES AND ACCOUNTING ─── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 lg:py-20 space-y-12">
          
          {/* Header & Subtitle */}
          <div className="text-center space-y-3 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#5b52f9] text-xs font-bold uppercase tracking-wider">
              <Link2 className="h-3.5 w-3.5" />
              <span>Unified Commerce & Ledger</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-slate-900 leading-tight">
              Connect Inventory with Purchases, Sales and Accounting
            </h2>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              AIBASS brings purchases, product sales, stock quantities and accounting information into one connected AI inventory accounting software, helping businesses understand what entered inventory, what was sold, what remains available and how those activities affect financial records.
            </p>
          </div>

          {/* 5 Feature Cards (3 on top row, 2 centered in middle on second row) */}
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {CONNECTED_INVENTORY_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all space-y-4 text-left flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.iconBg} ${card.iconColor} shadow-2xs`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {card.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Connected Commerce Pipeline: Open Layout, Simple & Clean (No Outer Container) */}
          <div className="max-w-6xl mx-auto pt-2 space-y-4">
            {/* Header with Title and Live Sync Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#5b52f9]" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800">
                  End-to-End Connected Commerce Pipeline
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-semibold w-fit">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Real-Time Synchronized</span>
              </div>
            </div>

            {/* Responsive 7-Step Pipeline Grid with Stable, Non-Jittering Animations */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {CONNECTED_COMMERCE_PIPELINE.map((item, idx) => {
                const StepIcon = item.icon;
                const isActive = activePipelineStep === idx;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    onMouseEnter={() => {
                      setActivePipelineStep(idx);
                      setIsPipelinePaused(true);
                    }}
                    onMouseLeave={() => setIsPipelinePaused(false)}
                    className={`relative rounded-2xl p-3.5 sm:p-4 border transition-colors duration-200 flex flex-col justify-between cursor-pointer group h-full ${
                      isActive
                        ? "bg-indigo-50/40 border-[#5b52f9] shadow-sm"
                        : "bg-white border-slate-200/90 hover:border-indigo-300 hover:bg-slate-50/50 shadow-2xs"
                    }`}
                  >
                    {/* Top Row: Step Number + Icon Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5b52f9] animate-pulse" />
                        )}
                        <span
                          className={`text-[11px] font-mono font-bold transition-colors ${
                            isActive
                              ? "text-[#5b52f9]"
                              : "text-slate-400 group-hover:text-indigo-600"
                          }`}
                        >
                          {item.step}
                        </span>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border shadow-2xs transition-all duration-200 group-hover:scale-110 ${
                          isActive
                            ? "bg-[#5b52f9] border-[#5b52f9] text-white shadow-xs"
                            : `${item.bgColor} ${item.iconColor}`
                        }`}
                      >
                        <StepIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
                      </div>
                    </div>

                    {/* Step Label and Detail */}
                    <div className="space-y-0.5">
                      <h4
                        className={`text-xs sm:text-[13px] font-bold leading-snug transition-colors ${
                          isActive
                            ? "text-[#5b52f9]"
                            : "text-slate-900 group-hover:text-[#5b52f9]"
                        }`}
                      >
                        {item.label}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] font-medium text-slate-500">
                        {item.detail}
                      </p>
                    </div>

                    {/* Connector Arrow (Visible on large screens between steps) */}
                    {idx < CONNECTED_COMMERCE_PIPELINE.length - 1 && (
                      <div
                        className={`hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-white border items-center justify-center shadow-2xs pointer-events-none transition-colors ${
                          isActive
                            ? "border-[#5b52f9] text-[#5b52f9]"
                            : "border-slate-200 text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-500"
                        }`}
                      >
                        <ChevronRight className="h-3 w-3 stroke-[2.5]" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

        </section>


        {/* ── SECTION: BENEFITS OF AIBASS AI INVENTORY MANAGEMENT SOFTWARE ─────── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 lg:py-20 space-y-12">
          
          {/* Header & Subtitle */}
          <div className="text-center space-y-3 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#5b52f9] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Core Value & Impact</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-slate-900 leading-tight">
              Benefits of AIBASS AI Inventory Management Software
            </h2>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              For businesses exploring inventory management using AI, AIBASS brings stock updates, low stock visibility and connected accounting information into one practical workflow.
            </p>
          </div>

          {/* 6-Card Grid (3 cols x 2 rows on lg, 2 cols on md, 1 col on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {INVENTORY_BENEFITS.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all space-y-4 text-left flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${benefit.iconBg} ${benefit.iconColor} shadow-2xs group-hover:scale-105 transition-transform`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-[#5b52f9] transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </section>


        {/* ── SECTION: AI INVENTORY ACCOUNTING SOFTWARE FOR DIFFERENT BUSINESSES ── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 lg:py-20 space-y-12">
          
          {/* Header & Subtitle */}
          <div className="text-center space-y-3 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#5b52f9] text-xs font-bold uppercase tracking-wider">
              <Building2 className="h-3.5 w-3.5" />
              <span>Tailored Business Architectures</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-slate-900 leading-tight">
              AI Inventory Accounting Software for Different Businesses
            </h2>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              Whether managing retail counters, wholesale distribution batches, raw material production, or multi-location stock, AIBASS connects inventory quantities with the wider accounting workflow.
            </p>
          </div>

          {/* Interactive Business Segment Selection Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {BUSINESS_INVENTORY_TYPES.map((biz, idx) => {
              const Icon = biz.icon;
              const isSelected = activeBizIdx === idx;
              return (
                <button
                  key={biz.id}
                  onClick={() => {
                    setActiveBizIdx(idx);
                    setIsBizPaused(true);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                      : "bg-white text-slate-600 border border-slate-200/90 hover:border-indigo-200 hover:text-slate-900 hover:bg-slate-50/70"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                  <span>{biz.name}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Interactive Spotlight Showcase Box */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-950 rounded-3xl p-6 sm:p-8 lg:p-10 text-white border border-indigo-900/60 shadow-2xl relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left: Active Business Details */}
                <div className="lg:col-span-7 space-y-4 text-left">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-indigo-300 border border-white/15 text-[11px] font-bold uppercase tracking-wider">
                      {BUSINESS_INVENTORY_TYPES[activeBizIdx].badge}
                    </span>
                    <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Tailored Architecture
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {BUSINESS_INVENTORY_TYPES[activeBizIdx].name}
                  </h3>

                  <p className="text-sm sm:text-base text-indigo-100/90 font-medium leading-relaxed max-w-xl">
                    {BUSINESS_INVENTORY_TYPES[activeBizIdx].desc}
                  </p>

                  {/* Feature Pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-indigo-300 block">
                        Connected Flow
                      </span>
                      <span className="text-xs font-bold text-white block">
                        {BUSINESS_INVENTORY_TYPES[activeBizIdx].metrics.inAction}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-emerald-300 block">
                        Business Advantage
                      </span>
                      <span className="text-xs font-bold text-white block">
                        {BUSINESS_INVENTORY_TYPES[activeBizIdx].metrics.advantage}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Live Interactive Workflow Simulation Card */}
                <div className="lg:col-span-5 bg-white/10 border border-white/15 rounded-2xl p-5 sm:p-6 backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                    <span className="font-bold text-indigo-200 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      Connected Stock & Ledger
                    </span>
                    <span className="text-[11px] font-mono text-slate-300">
                      Segment 0{activeBizIdx + 1}/06
                    </span>
                  </div>

                  {/* Flow Simulation Items */}
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-6 w-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold font-mono text-[10px]">
                          IN
                        </div>
                        <span className="font-semibold text-slate-200">Purchases & Inward Stock</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400">+ Auto Added</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-6 w-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold font-mono text-[10px]">
                          OUT
                        </div>
                        <span className="font-semibold text-slate-200">Sales Invoices & Billing</span>
                      </div>
                      <span className="text-[11px] font-bold text-rose-400">- Auto Deducted</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold font-mono text-[10px]">
                          SYNC
                        </div>
                        <span className="font-semibold text-slate-200">Bookkeeping & GST Ledgers</span>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-300">✓ Updated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6-Card Interactive Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {BUSINESS_INVENTORY_TYPES.map((biz, idx) => {
              const Icon = biz.icon;
              const isSelected = activeBizIdx === idx;

              return (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  onClick={() => {
                    setActiveBizIdx(idx);
                    setIsBizPaused(true);
                  }}
                  onMouseEnter={() => {
                    setActiveBizIdx(idx);
                    setIsBizPaused(true);
                  }}
                  onMouseLeave={() => setIsBizPaused(false)}
                  className={`relative rounded-3xl p-6 sm:p-7 border transition-colors duration-200 text-left flex flex-col justify-between cursor-pointer group h-full ${
                    isSelected
                      ? "bg-indigo-50/40 border-[#5b52f9] shadow-md"
                      : "bg-white border-slate-200/90 hover:border-indigo-300 hover:bg-slate-50/50 shadow-sm"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs transition-all duration-200 group-hover:scale-105 ${
                        isSelected
                          ? "bg-[#5b52f9] border-[#5b52f9] text-white shadow-xs"
                          : `${biz.iconBg}`
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-colors ${
                        isSelected
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {biz.badge}
                      </span>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-1.5">
                      <h3 className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                        isSelected ? "text-[#5b52f9]" : "text-slate-900 group-hover:text-[#5b52f9]"
                      }`}>
                        {biz.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                        {biz.desc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Hint */}
                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className={`text-[11px] transition-colors ${
                      isSelected ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}>
                      {biz.tagline}
                    </span>
                    <ArrowRight className={`h-3.5 w-3.5 transition-transform ${
                      isSelected ? "translate-x-1 text-[#5b52f9]" : "text-slate-400 group-hover:translate-x-0.5"
                    }`} />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </section>


        {/* ── SECTION: AIBASS VERSUS MANUAL INVENTORY MANAGEMENT ────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 lg:py-20 space-y-12">
          
          {/* Header & Subtitle */}
          <div className="text-center space-y-3 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#5b52f9] text-xs font-bold uppercase tracking-wider">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Comparative Advantage</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-slate-900 leading-tight">
              AIBASS Versus Manual Inventory Management
            </h2>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              Compare how traditional manual stock recording contrasts with AIBASS connected AI inventory and accounting workflows.
            </p>
          </div>

          {/* Comparison Cards Matrix (Responsive & Clean) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {AIBASS_VS_MANUAL_COMPARISON.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.dimension}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all space-y-5 flex flex-col justify-between"
                >
                  {/* Top: Icon + Dimension Title */}
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${item.iconBg} ${item.iconColor} shadow-2xs shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                      {item.dimension}
                    </h3>
                  </div>

                  {/* Body: Side-by-Side or Stacked Manual vs AIBASS Comparison */}
                  <div className="space-y-4 flex-1">
                    {/* Manual Way */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {item.manualType}:
                      </span>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed">
                        {item.manualDesc}
                      </p>
                    </div>

                    {/* AIBASS Way */}
                    <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1.5">
                      <span className="text-[10px] uppercase font-extrabold text-[#5b52f9] tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#5b52f9]" />
                        {item.aibassType}:
                      </span>
                      <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                        {item.aibassDesc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </section>


        {/* ── SECTION: WHY BUSINESSES CHOOSE AIBASS INVENTORY MANAGEMENT ─────────── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 lg:py-24 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Sticky Narrative & AWS Cloud Hero Pillar */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5b52f9] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Strategic Business Value</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-slate-900 leading-[1.15]">
                Why Businesses Choose AIBASS Inventory Management
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                AIBASS bridges the critical gap between daily physical stock movements and real-time financial ledgers. Built on robust AWS cloud infrastructure, it empowers teams with instant visibility and conversational AI control.
              </p>

              {/* AWS Cloud Infrastructure Highlight Badge (Open Flat Layout) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-800/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-indigo-300">
                    <Cloud className="h-4 w-4 text-sky-400" />
                    <span>AWS Cloud Architecture</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    99.99% Uptime
                  </span>
                </div>
                <p className="text-xs text-indigo-100/90 leading-relaxed font-normal">
                  Enterprise-grade data encryption, automated backups, and low-latency response times for high-volume inventory sync.
                </p>
              </div>

              {/* Action Link */}
              <div className="pt-2">
                <Button
                  onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                  className="rounded-full bg-[#5b52f9] hover:bg-indigo-600 text-white px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>Experience Connected Inventory</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Column: 5 Open Connected Feature Rows (Zero Card Box Containers) */}
            <div className="lg:col-span-7 divide-y divide-slate-200/90 text-left">
              {WHY_CHOOSE_AIBASS_INVENTORY.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    className="py-7 first:pt-0 last:pb-0 group cursor-pointer"
                  >
                    <div className="flex items-start gap-4 sm:gap-6 group-hover:translate-x-1.5 transition-transform duration-200">
                      {/* Monospace Step Number */}
                      <span className="text-2xl sm:text-3xl font-black font-mono text-slate-300 group-hover:text-[#5b52f9] transition-colors shrink-0 pt-0.5">
                        {item.number}
                      </span>

                      {/* Content Area */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${item.iconBg} ${item.iconColor} shadow-2xs group-hover:scale-110 transition-transform`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-[#5b52f9] transition-colors">
                            {item.badge}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight group-hover:text-[#5b52f9] transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </section>


        {/* ── SECTION: SEE AIBASS INVENTORY MANAGEMENT IN ACTION ─────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 lg:py-24 space-y-12">
          
          {/* Header & Subtitle */}
          <div className="text-center space-y-3 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#5b52f9] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interactive Workflow Tour</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-black tracking-tight text-slate-900 leading-tight">
              See AIBASS Inventory Management in Action
            </h2>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              See how AIBASS connects purchases, sales and available stock through one inventory and accounting workflow.
            </p>
          </div>

          {/* Recommended Product Screens Navigation Bar */}
          <div className="space-y-3 max-w-5xl mx-auto">
            <div className="flex items-center justify-between px-2 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-400 text-[11px] flex items-center gap-1.5">
                <Boxes className="h-3.5 w-3.5 text-[#5b52f9]" />
                Recommended Product Screens
              </span>
              <span className="font-mono font-bold text-indigo-600 text-[11px]">
                Screen 0{activeScreenTab + 1} / 09
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {RECOMMENDED_PRODUCT_SCREENS.map((screen, idx) => {
                const Icon = screen.icon;
                const isSelected = activeScreenTab === idx;
                return (
                  <button
                    key={screen.id}
                    onClick={() => {
                      setActiveScreenTab(idx);
                      const matchingStepIdx = DEMO_FLOW_STEPS.findIndex((s) => s.screenMatch === idx);
                      if (matchingStepIdx !== -1) setActiveDemoStep(matchingStepIdx);
                      setIsDemoPaused(true);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-[1.02]"
                        : "bg-white text-slate-600 border border-slate-200/90 hover:border-indigo-300 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                    <span>{screen.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Demonstration Station: Left Vertical Flow Stepper + Right Dynamic Live Screen Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto pt-2">
            
            {/* Left Column: Product Demonstration Flow (9 Connected Steps) */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#5b52f9]" />
                  Product Demonstration Flow
                </span>
                <span className="text-[11px] font-mono font-bold text-indigo-600">
                  Step 0{activeDemoStep + 1} of 09
                </span>
              </div>

              {/* Vertical Linear Step Stream (Open Non-scrollable layout) */}
              <div className="space-y-2 relative">
                {DEMO_FLOW_STEPS.map((st, idx) => {
                  const isActive = activeDemoStep === idx;

                  return (
                    <div
                      key={st.step}
                      onClick={() => {
                        setActiveDemoStep(idx);
                        setActiveScreenTab(st.screenMatch);
                        setIsDemoPaused(true);
                      }}
                      className={`p-3.5 rounded-2xl transition-all duration-200 cursor-pointer flex items-start gap-3 border ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-50/90 via-purple-50/40 to-white border-[#5b52f9] shadow-sm ring-1 ring-indigo-500/20"
                          : "bg-white border-slate-200/80 hover:bg-slate-50/80 hover:border-indigo-200"
                      }`}
                    >
                      {/* Step Number Badge */}
                      <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-xl shrink-0 transition-colors ${
                        isActive 
                          ? "bg-[#5b52f9] text-white shadow-xs" 
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {st.step}
                      </span>

                      {/* Text */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                            isActive ? "text-[#5b52f9]" : "text-slate-900"
                          }`}>
                            {st.action}
                          </h4>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                            isActive 
                              ? "bg-indigo-100/90 text-indigo-700 font-extrabold" 
                              : "bg-slate-100 text-slate-500 font-semibold"
                          }`}>
                            {st.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {st.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Dynamic Live Product Screen Console Viewport (Expanded Full Height) */}
            <div className="lg:col-span-7 bg-slate-950 text-white rounded-3xl p-7 sm:p-8 lg:p-9 border border-slate-800 shadow-2xl space-y-6 text-left relative overflow-hidden lg:sticky lg:top-24 h-full min-h-[640px] flex flex-col justify-between">
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-5 relative z-10">
                {/* Console Header Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block shadow-sm" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block shadow-sm" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block shadow-sm" />
                    <span className="text-xs sm:text-sm font-mono text-slate-300 ml-2 font-bold">
                      aibass-console // {RECOMMENDED_PRODUCT_SCREENS[activeScreenTab].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400">AWS Cloud</span>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Sync Active
                    </div>
                  </div>
                </div>

                {/* Active Action Header */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-indigo-300 font-bold block">
                      Active Demonstration Operation
                    </span>
                    <p className="text-sm sm:text-base font-bold text-white leading-snug">
                      {DEMO_FLOW_STEPS[activeDemoStep].action}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 shrink-0">
                    Step {DEMO_FLOW_STEPS[activeDemoStep].step}/09
                  </span>
                </div>

                {/* ── DYNAMIC SCREEN CONTENT BASED ON activeScreenTab ── */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono text-xs">
                  
                  {/* Screen 0: Inventory Dashboard */}
                  {activeScreenTab === 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                          <span className="text-[10px] uppercase text-slate-400 block font-bold">Total SKUs</span>
                          <span className="text-base font-bold text-white">1,420 Items</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                          <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Valuation</span>
                          <span className="text-base font-bold text-emerald-400">₹48,20,500</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 col-span-2 sm:col-span-1">
                          <span className="text-[10px] uppercase text-slate-400 block font-bold">Low Stock Risk</span>
                          <span className="text-base font-bold text-amber-400">3 SKUs Flagged</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5 text-xs">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Warehouse Stock Distribution</span>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-slate-200">
                            <span>Godown Central (HQ)</span>
                            <span className="font-bold text-indigo-300">720 Units (₹24.4L)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full w-[65%]" />
                          </div>

                          <div className="flex justify-between items-center text-slate-200 pt-1">
                            <span>Hub West (Regional)</span>
                            <span className="font-bold text-indigo-300">480 Units (₹16.2L)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full w-[40%]" />
                          </div>

                          <div className="flex justify-between items-center text-slate-200 pt-1">
                            <span>Transit Stock (Inward PO)</span>
                            <span className="font-bold text-emerald-400">220 Units (₹7.6L)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[25%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Screen 1: Current Product Quantities */}
                  {activeScreenTab === 1 && (
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                        <span className="text-slate-300 flex items-center gap-2">
                          <Search className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Search: SKU-409 (Motor 5HP)</span>
                        </span>
                        <span className="text-indigo-400 font-bold">Filter: All Depots</span>
                      </div>
                      <div className="space-y-2.5 text-xs">
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <p className="text-white font-bold text-sm">SKU-409 // Industrial Motor 5HP</p>
                            <span className="text-slate-400 text-[11px]">HSN: 8483 // Godown Central</span>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-400 font-bold block text-base">308 Available</span>
                            <span className="text-slate-400 text-[10px]">12 Reserved for Billing</span>
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <p className="text-white font-bold text-sm">SKU-104 // Heavy Steel Bearings</p>
                            <span className="text-slate-400 text-[11px]">HSN: 8482 // Hub West</span>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-400 font-bold block text-base">140 Available</span>
                            <span className="text-slate-400 text-[10px]">Optimal Stock Level</span>
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <p className="text-white font-bold text-sm">SKU-884 // 12mm High-Tensile Rods</p>
                            <span className="text-slate-400 text-[11px]">HSN: 7214 // Godown Central</span>
                          </div>
                          <div className="text-right">
                            <span className="text-amber-400 font-bold block text-base">14 Available</span>
                            <span className="text-rose-400 text-[10px]">⚠️ Reorder Needed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Screen 2: Purchase Based Stock Addition */}
                  {activeScreenTab === 2 && (
                    <div className="space-y-3.5 text-xs">
                      <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 space-y-1.5">
                        <div className="flex justify-between text-indigo-200">
                          <span className="font-bold text-sm">Supplier Inward: Apex Industrial Ltd</span>
                          <span className="text-emerald-400 font-bold">Bill #PO-9842</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>GSTIN: 27AABCA1234F1Z5</span>
                          <span>Payment Terms: 30 Days Net</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span>+50 Units Industrial Motor 5HP</span>
                          <span className="font-bold">₹1,60,000 + GST</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Unit Cost: ₹3,200 | Tax: 18% IGST (₹28,800)</p>
                        
                        <div className="flex justify-between text-emerald-400 font-bold text-xs pt-2 border-t border-white/10">
                          <span>✓ Inventory Auto-Incremented</span>
                          <span>270 → 320 Units in Godown Central</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center justify-between">
                        <span>Balance Sheet Asset Synchronized</span>
                        <span className="font-bold">+₹1,60,000 Asset Value</span>
                      </div>
                    </div>
                  )}

                  {/* Screen 3: Sales Based Stock Reduction */}
                  {activeScreenTab === 3 && (
                    <div className="space-y-3.5 text-xs">
                      <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/30 space-y-1.5">
                        <div className="flex justify-between text-purple-200">
                          <span className="font-bold text-sm">Customer: Zenith Retailers</span>
                          <span className="text-rose-400 font-bold">Tax Invoice #INV-2024-881</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Billing Counter 1 // GST B2B Invoice</span>
                          <span>State: Maharashtra</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <div className="flex justify-between text-white text-sm">
                          <span>-12 Units Industrial Motor 5HP</span>
                          <span className="font-bold">₹63,720 (Incl. 18% GST)</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Sales Rate: ₹4,500/unit | CGST ₹4,860 + SGST ₹4,860</p>
                        
                        <div className="flex justify-between text-rose-400 font-bold text-xs pt-2 border-t border-white/10">
                          <span>✓ Inventory Auto-Decremented</span>
                          <span>320 → 308 Units in Real-Time</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-center justify-between">
                        <span>Debtor Ledger Updated (Zenith Retail)</span>
                        <span className="font-bold">Debit ₹63,720</span>
                      </div>
                    </div>
                  )}

                  {/* Screen 4: Low Stock Identification */}
                  {activeScreenTab === 4 && (
                    <div className="space-y-3.5 text-xs">
                      <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/30 space-y-1.5">
                        <div className="flex justify-between text-amber-200 font-bold text-sm">
                          <span className="flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                            AI Proactive Depletion Warning
                          </span>
                          <span className="text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded text-[10px]">High Risk</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">SKU-884 (12mm High-Tensile Rods) reached critical threshold</p>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                        <div className="flex justify-between text-slate-200">
                          <span>Available Quantity: <b className="text-amber-400 text-sm">14 Units</b></span>
                          <span>Safety Minimum: <b>25 Units</b></span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Daily Velocity: 4.5 Units/day</span>
                          <span>Estimated Stockout: <b className="text-rose-400">~3.1 Days</b></span>
                        </div>
                        <div className="pt-2">
                          <div className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-center font-bold text-xs cursor-pointer transition-colors shadow-md shadow-indigo-600/20">
                            ⚡ Auto-Generate Supplier PO (+60 Units from Apex)
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-[11px] flex items-center justify-between">
                        <span>Preferred Vendor: Apex Industrial</span>
                        <span className="text-indigo-300 font-bold">Avg Lead Time: 4 Days</span>
                      </div>
                    </div>
                  )}

                  {/* Screen 5: Connected Sales Information */}
                  {activeScreenTab === 5 && (
                    <div className="space-y-3.5 text-xs">
                      <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-500/30 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="font-bold text-blue-200 text-sm block">E-Invoice & Ledger Connected</span>
                          <span className="text-[11px] text-slate-400">IRN: 4f9a72e81... | E-Way Bill Active</span>
                        </div>
                        <span className="text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                          GST Compliant
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-slate-300">
                        <div className="flex justify-between">
                          <span>Debtor Account (Zenith Retail):</span>
                          <span className="font-bold text-white">+₹63,720 (Debit)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Output GST Ledger (CGST+SGST):</span>
                          <span className="font-bold text-indigo-300">₹9,720 (Credit)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost of Goods Sold (COGS):</span>
                          <span className="font-bold text-white">₹38,400</span>
                        </div>
                        <div className="flex justify-between pt-1.5 border-t border-white/10 text-emerald-400 font-bold">
                          <span>Inventory Asset Reduction:</span>
                          <span>Synchronized ✓</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Screen 6: Connected Purchase Information */}
                  {activeScreenTab === 6 && (
                    <div className="space-y-3.5 text-xs">
                      <div className="p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="font-bold text-indigo-200 text-sm block">GSTR-2B Input Tax Credit Link</span>
                          <span className="text-[11px] text-slate-400">Vendor: Apex Industrial | PO #9842</span>
                        </div>
                        <span className="text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                          100% ITC Match
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-slate-300">
                        <div className="flex justify-between">
                          <span>Inventory Asset Value (Balance Sheet):</span>
                          <span className="font-bold text-emerald-400">+₹1,60,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Eligible Input Tax Credit (ITC):</span>
                          <span className="font-bold text-indigo-300">₹28,800</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Accounts Payable (Creditors):</span>
                          <span className="font-bold text-white">₹1,88,800</span>
                        </div>
                        <div className="flex justify-between pt-1.5 border-t border-white/10 text-emerald-400 font-bold">
                          <span>GSTR-3B Tax Offset Ready:</span>
                          <span>Matched ✓</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Screen 7: Text Command Interface */}
                  {activeScreenTab === 7 && (
                    <div className="space-y-3.5 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-1 text-indigo-200">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">User Prompt</span>
                        <p className="text-white font-bold text-sm">
                          “Show available stock of SKU-409 across all branches and check reorder safety”
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">AIBASS AI Response</span>
                        <div className="space-y-1.5 text-slate-200">
                          <p>• <b>Central Godown:</b> 200 units</p>
                          <p>• <b>Regional Hub:</b> 108 units</p>
                          <p>• <b>Transit Pipeline:</b> 50 units (ETA: Tomorrow)</p>
                          <p className="text-emerald-400 font-bold pt-2 border-t border-white/10 text-xs">
                            Total: 308 units available (Reorder Point: 80 units — Safety Status: Optimal)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Screen 8: Voice Command Interface */}
                  {activeScreenTab === 8 && (
                    <div className="space-y-3.5 text-xs">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border border-indigo-500/40 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-indigo-200">
                          <Mic className="h-5 w-5 text-indigo-400 animate-pulse" />
                          <span className="font-bold text-sm">Live Audio Input Stream</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-1 bg-indigo-400 rounded-full animate-bounce" />
                          <span className="h-6 w-1 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="h-4 w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                          <span className="h-7 w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                          <span className="h-3 w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Spoken Command Transcript</span>
                        <p className="text-white font-semibold text-sm">
                          “Bill 12 units of Industrial Motor 5HP for Zenith Retailers and deduct warehouse stock.”
                        </p>
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>Action Executed: Invoice #INV-881 Generated & 12 Units Deducted.</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Voice Recognition Model</span>
                        <span className="text-indigo-300 font-bold">Natural Language Accounting v4.2</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Console Footer Status Bar */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400 relative z-10">
                <span>Cluster: aws-ap-south-1</span>
                <span className="text-emerald-400">Database: Real-Time Synced (12ms)</span>
              </div>

            </div>

          </div>

          {/* Primary & Secondary Call to Actions Dock */}
          <div className="pt-6 text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="rounded-full bg-[#5b52f9] hover:bg-indigo-600 text-white px-8 py-3 text-sm sm:text-base font-extrabold shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <span>Book a Free Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                className="rounded-full border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-slate-950 px-8 py-3 text-sm sm:text-base font-bold cursor-pointer transition-all hover:scale-105"
              >
                <span>Start 30 Day Free Trial</span>
              </Button>
            </div>

          </div>

        </section>


        {/* ── SECTION: MANAGE INVENTORY AND ACCOUNTING FROM ONE CONNECTED PLATFORM ── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
          <div className="bg-gradient-to-br from-slate-950 via-[#100e2b] to-slate-950 rounded-3xl p-8 sm:p-14 lg:p-16 text-white text-center space-y-7 relative overflow-hidden border border-indigo-900/60 shadow-2xl">
            
            {/* Background glowing rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/15 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-3xl pointer-events-none rounded-full" />

            <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Connected Business Architecture
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Manage Inventory and Accounting from One Connected Platform
              </h2>

              <p className="text-base sm:text-lg text-indigo-200/90 font-medium leading-relaxed max-w-3xl mx-auto">
                Know what stock you have, what changed it and how supported inventory activity connects with the wider financial workflow.
              </p>

              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
                Use AIBASS to connect purchases with stock additions, product sales with stock reductions and available inventory with bookkeeping and accounting information.
              </p>

              {/* Dual Action CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                  className="h-12 sm:h-14 px-9 rounded-full bg-[#5b52f9] hover:bg-indigo-600 text-white text-sm sm:text-base font-extrabold shadow-xl hover:shadow-2xl shadow-indigo-500/30 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <span>Start 30 Day Free Trial</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
                  className="h-12 sm:h-14 px-9 rounded-full border-slate-700 bg-white/5 hover:bg-white/15 text-white hover:text-white text-sm sm:text-base font-bold transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Book a Free Demo</span>
                </Button>
              </div>

            </div>

          </div>
        </section>


        {/* ── SECTION: FREQUENTLY ASKED QUESTIONS (ACCORDION) ──────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-16">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#5b52f9]">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqData.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="border border-slate-150 rounded-2xl px-4 py-1 data-[state=open]:border-indigo-200 data-[state=open]:bg-indigo-50/20 transition-all"
                >
                  <AccordionTrigger className="text-left text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 hover:no-underline py-3">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed pb-3">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

      </main>

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-slate-950 text-white shadow-xl hover:bg-indigo-600 transition-colors border border-slate-800"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Global Trial Form Modal */}
      <TrialFormModal />

      {/* Global Footer */}
      <Footer />

    </div>
  );
};

export default AiInventoryManagementSoftware;
