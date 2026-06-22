import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FileText,
    Download,
    Printer,
    ArrowLeft,
    CheckCircle,
    Clock,
    AlertCircle,
    Building,
    Mail,
    User,
    Calendar,
    Receipt,
    CreditCard,
    ChevronRight
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface InvoiceItem {
    productName: string;
    description?: string;
    codeType?: "HSN" | "SAC";
    hsnCode?: string;
    sacCode?: string;
    unit?: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    total: number;
}

interface InvoiceData {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerGSTIN?: string;
    businessName: string;
    businessEmail: string;
    businessPhone?: string;
    businessGSTIN?: string;
    transactionType?: "B2B" | "B2C";
    invoiceSize?: "A4" | "QUARTER_A4";
    items: InvoiceItem[];
    subtotal: number;
    taxAmount: number;
    sgst?: number;
    cgst?: number;
    igst?: number;
    grandTotal: number;
    paymentMethod: string;
    status: string;
}

const PublicInvoiceView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/invoice/${id}`);
                if (!response.ok) {
                    throw new Error("Invoice not found or could not be loaded");
                }
                const data = await response.json();
                setInvoice(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchInvoice();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-200 font-medium">Loading Invoice...</p>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-red-500/30 rounded-3xl p-8 text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Invoice Not Found</h1>
                    <p className="text-slate-400 mb-6">{error || "The invoice you're looking for doesn't exist or the link is invalid."}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const printSizeClass = invoice.invoiceSize === "QUARTER_A4" ? "invoice-receipt-copy" : "invoice-a4-copy";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
            <style>{`
                @media print {
                    @page {
                        size: ${invoice.invoiceSize === "QUARTER_A4" ? "105mm 148mm" : "A4"};
                        margin: ${invoice.invoiceSize === "QUARTER_A4" ? "6mm" : "12mm"};
                    }
                    body {
                        background: white !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .official-copy {
                        box-shadow: none !important;
                        border: 1px solid #d8dee9 !important;
                        background: white !important;
                        color: #0f172a !important;
                    }
                    .official-copy * {
                        color: #0f172a !important;
                        background-image: none !important;
                    }
                    .invoice-receipt-copy {
                        width: 100% !important;
                        font-size: 11px !important;
                    }
                }
            `}</style>
            {/* Abstract Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none no-print">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 lg:py-20">
                {/* Top Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 no-print">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                            <FileText className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Invoice Official Copy</h1>
                            <p className="text-slate-400 text-sm">#{invoice.invoiceNumber}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                        >
                            <Printer className="h-4 w-4" />
                            Print
                        </button>
                    </div>
                </div>

                {/* Invoice Card */}
                <div id="invoice-official-copy" className={`official-copy ${printSizeClass} backdrop-blur-2xl bg-white/[0.98] border border-slate-200 rounded-[28px] shadow-2xl overflow-hidden text-slate-950`}>
                    <div className="px-8 lg:px-12 py-6 border-b border-slate-200 bg-slate-950 text-white">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">Tax Invoice</p>
                                <h2 className="mt-2 text-2xl lg:text-3xl font-black text-white">{invoice.businessName}</h2>
                                <p className="mt-1 text-sm text-slate-300">{invoice.businessEmail}{invoice.businessPhone ? ` | ${invoice.businessPhone}` : ""}</p>
                                {invoice.businessGSTIN && <p className="text-sm text-slate-300">GSTIN: {invoice.businessGSTIN}</p>}
                            </div>
                            <div className="md:text-right">
                                <p className="text-sm text-slate-300">Invoice Number</p>
                                <p className="text-xl font-black text-white">#{invoice.invoiceNumber}</p>
                                <p className="mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                                    {invoice.transactionType || "B2C"} | {invoice.invoiceSize === "QUARTER_A4" ? "Receipt" : "A4"}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Header Section */}
                    <div className="p-8 lg:p-12 border-b border-slate-200 bg-gradient-to-br from-blue-50 to-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-700 mb-4">From</h2>
                                    <div className="space-y-1">
                                        <p className="text-xl font-bold text-slate-950">{invoice.businessName}</p>
                                        <p className="text-slate-600">{invoice.businessEmail}</p>
                                        {invoice.businessPhone && <p className="text-slate-600">{invoice.businessPhone}</p>}
                                        {invoice.businessGSTIN && <p className="text-slate-600">GSTIN: {invoice.businessGSTIN}</p>}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-700 mb-4">Bill To</h2>
                                    <div className="space-y-1">
                                        <p className="text-xl font-bold text-slate-950">{invoice.customerName}</p>
                                        <p className="text-slate-600">{invoice.customerEmail}</p>
                                        {invoice.customerPhone && <p className="text-slate-600">Phone: {invoice.customerPhone}</p>}
                                        {invoice.customerGSTIN && <p className="text-slate-600">GSTIN: {invoice.customerGSTIN}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 md:text-right flex flex-col md:items-end">
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${invoice.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    invoice.status === 'overdue' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    }`}>
                                    {invoice.status}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-4 md:w-full">
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Invoice Date</h2>
                                        <p className="text-slate-950 font-bold">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Due Date</h2>
                                        <p className="text-slate-950 font-bold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="p-8 lg:p-12 bg-white">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left">
                                        <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500">Item Description</th>
                                        <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500">HSN/SAC</th>
                                        <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Qty</th>
                                        <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Unit Price</th>
                                        <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {invoice.items.map((item, idx) => (
                                        <tr key={idx} className="group">
                                            <td className="py-6 pr-4">
                                                <p className="text-slate-950 font-semibold transition-colors group-hover:text-blue-700">{item.productName}</p>
                                                {item.description && <p className="text-slate-500 text-sm mt-1">{item.description}</p>}
                                            </td>
                                            <td className="py-6 text-slate-600 font-medium">{item.hsnCode || item.sacCode || "-"}</td>
                                            <td className="py-6 text-center text-slate-700 font-medium">{item.quantity} {item.unit || ""}</td>
                                            <td className="py-6 text-right text-slate-700 font-medium">₹{item.unitPrice.toFixed(2)}</td>
                                            <td className="py-6 text-right text-slate-950 font-bold">₹{item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="mt-12 flex flex-col md:flex-row justify-between items-start gap-12 pt-12 border-t border-slate-200">
                            <div className="max-w-xs">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-700 mb-4">Payment Method</h2>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <CreditCard className="h-5 w-5 text-slate-500" />
                                    <p className="text-slate-950 font-medium capitalize">{invoice.paymentMethod.replace("_", " ")}</p>
                                </div>
                            </div>

                            <div className="w-full md:w-80 space-y-4">
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="text-slate-950 font-medium">₹{invoice.subtotal.toFixed(2)}</span>
                                </div>
                                {/* GST Breakdown */}
                                {(invoice.sgst && invoice.sgst > 0) || (invoice.cgst && invoice.cgst > 0) ? (
                                    <>
                                        <div className="flex justify-between items-center text-slate-600 text-sm">
                                            <span>SGST</span>
                                            <span className="text-slate-950 font-medium">₹{(invoice.sgst || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-600 text-sm">
                                            <span>CGST</span>
                                            <span className="text-slate-950 font-medium">₹{(invoice.cgst || 0).toFixed(2)}</span>
                                        </div>
                                    </>
                                ) : invoice.igst && invoice.igst > 0 ? (
                                    <div className="flex justify-between items-center text-slate-600 text-sm">
                                        <span>IGST</span>
                                        <span className="text-slate-950 font-medium">₹{invoice.igst.toFixed(2)}</span>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span>Tax Amount</span>
                                        <span className="text-slate-950 font-medium">₹{invoice.taxAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-slate-600 pb-4 border-b border-slate-200">
                                    <span>Total Tax</span>
                                    <span className="text-slate-950 font-medium">₹{invoice.taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-slate-950">Grand Total</span>
                                    <span className="text-3xl font-black text-blue-700 bg-blue-50 px-4 py-1 rounded-2xl">
                                        ₹{invoice.grandTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="px-8 lg:px-12 py-8 bg-slate-50 border-t border-slate-200 text-center">
                        <p className="text-slate-600 text-sm">
                            This is a digitally generated invoice. No signature required.
                        </p>
                        <p className="text-blue-700/60 text-[10px] mt-2 tracking-widest font-bold uppercase">
                            Powered by Invoice Automation System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicInvoiceView;
