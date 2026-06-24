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
    invoiceSize?: "A4" | "QUARTER_A4" | "A6";
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

    const printSizeClass = (invoice.invoiceSize === "QUARTER_A4" || invoice.invoiceSize === "A6") ? "invoice-receipt-copy" : "invoice-a4-copy";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
            <style>{`
                /* Screen view overrides for clean print preview */
                #invoice-official-copy {
                    background: white !important;
                    color: #0f172a !important;
                    border: 1px solid #cbd5e1 !important;
                    border-radius: 12px !important;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05) !important;
                }
                #invoice-official-copy * {
                    color: #0f172a !important;
                    background-color: transparent !important;
                    background-image: none !important;
                }
                #invoice-official-copy .text-blue-200, 
                #invoice-official-copy .text-slate-200, 
                #invoice-official-copy .text-indigo-700 {
                    color: #4f46e5 !important;
                }
                #invoice-official-copy .bg-gradient-to-r {
                    background: transparent !important;
                }
                #invoice-official-copy th {
                    background-color: #f8fafc !important;
                    color: #0f172a !important;
                    border-bottom: 2px solid #cbd5e1 !important;
                }
                #invoice-official-copy td {
                    border-bottom: 1px solid #f1f5f9 !important;
                }
                #invoice-official-copy .text-white {
                    color: #0f172a !important;
                }
                #invoice-official-copy .bg-white\\/20 {
                    background-color: #f1f5f9 !important;
                    border-color: #cbd5e1 !important;
                }
                #invoice-official-copy .bg-slate-50 {
                    background-color: #f8fafc !important;
                }
                #invoice-official-copy .text-emerald-400,
                #invoice-official-copy .text-rose-400,
                #invoice-official-copy .text-blue-400 {
                    color: #4f46e5 !important;
                    border-color: #c7d2fe !important;
                    background-color: #e0e7ff !important;
                }
                #invoice-official-copy .from-violet-600 {
                    background: transparent !important;
                    border-bottom: 1px solid #cbd5e1 !important;
                }
                #invoice-official-copy .from-indigo-50\\/60 {
                    background: transparent !important;
                }

                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body, html {
                        background: white !important;
                        color: #0f172a !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                    }
                    /* Hide parent containers or reset layout */
                    .min-h-screen {
                        min-height: 0 !important;
                        background: transparent !important;
                    }
                    .relative.z-10 {
                        position: static !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                        z-index: auto !important;
                    }
                    #invoice-official-copy {
                        box-shadow: none !important;
                        border: none !important;
                        border-radius: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        display: block !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                    }
                    /* Reduce spacing between sections */
                    #invoice-official-copy > * + * {
                        margin-top: 0.5rem !important;
                    }
                    #invoice-official-copy .pb-6 {
                        padding-bottom: 0.5rem !important;
                    }
                    #invoice-official-copy .pt-6 {
                        padding-top: 0.5rem !important;
                    }
                    #invoice-official-copy .py-8 {
                        padding-top: 0.5rem !important;
                        padding-bottom: 0.5rem !important;
                    }
                    #invoice-official-copy * {
                        color: #0f172a !important;
                        background-color: transparent !important;
                        background-image: none !important;
                    }
                    @page {
                        size: A4;
                        margin: 8mm;
                    }
                    #invoice-official-copy table {
                        page-break-inside: avoid;
                    }
                    #invoice-official-copy tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    #invoice-official-copy td, #invoice-official-copy th {
                        padding-top: 4px !important;
                        padding-bottom: 4px !important;
                    }
                    #invoice-official-copy h2, #invoice-official-copy h1, #invoice-official-copy p {
                        margin-top: 1px !important;
                        margin-bottom: 1px !important;
                    }
                    .invoice-receipt-copy {
                        width: 100% !important;
                        font-size: 10px !important;
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
                <div id="invoice-official-copy" className={`official-copy ${printSizeClass} bg-white border border-slate-300 rounded-[12px] shadow-md overflow-hidden text-slate-950 p-8 lg:p-12 space-y-6 max-w-4xl mx-auto`}>
                    <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 text-white p-8 -mx-8 -mt-8 rounded-t-[11px] mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-200">Tax Invoice</p>
                            <h2 className="mt-2 text-2xl lg:text-3xl font-black text-white">{invoice.businessName}</h2>
                            <p className="mt-1 text-sm text-indigo-100 font-medium">{invoice.businessEmail}{invoice.businessPhone ? ` | ${invoice.businessPhone}` : ""}</p>
                            {invoice.businessGSTIN && <p className="text-sm text-indigo-100 font-medium">GSTIN: {invoice.businessGSTIN}</p>}
                        </div>
                        <div className="md:text-right">
                            <p className="text-sm text-indigo-200 font-medium">Invoice Number</p>
                            <p className="text-2xl font-black text-white">#{invoice.invoiceNumber}</p>
                            <p className="mt-2 inline-flex rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-white border border-white/20">
                                {invoice.transactionType || "B2C"} | {(invoice.invoiceSize === "QUARTER_A4" || invoice.invoiceSize === "A6") ? "A6" : "A4"}
                            </p>
                        </div>
                    </div>
                    {/* Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-200 pb-6">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 border-l-2 border-indigo-500 pl-2">From</h2>
                                <div className="space-y-0.5 text-sm">
                                    <p className="font-bold text-slate-950">{invoice.businessName}</p>
                                    <p className="text-slate-650">{invoice.businessEmail}</p>
                                    {invoice.businessGSTIN && <p className="text-slate-650">GSTIN: {invoice.businessGSTIN}</p>}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 border-l-2 border-indigo-500 pl-2">Bill To</h2>
                                <div className="space-y-0.5 text-sm">
                                    <p className="font-bold text-slate-950">{invoice.customerName}</p>
                                    {invoice.customerPhone && <p className="text-slate-650">Phone: {invoice.customerPhone}</p>}
                                    {invoice.customerGSTIN && <p className="text-slate-650">GSTIN: {invoice.customerGSTIN}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 md:text-right flex flex-col md:items-end text-sm">
                            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 w-48 text-left md:text-right">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-650">Invoice Date</h2>
                                <p className="text-slate-950 font-bold">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                            </div>
                            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 w-48 text-left md:text-right">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-650">Due Date</h2>
                                <p className="text-slate-950 font-bold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b-2 border-indigo-250 text-left bg-indigo-50/70">
                                    <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-indigo-800">Item Description</th>
                                    <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-indigo-800">HSN/SAC</th>
                                    <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-indigo-800 text-center">Qty</th>
                                    <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-indigo-800 text-right">Price</th>
                                    <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-indigo-800 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {invoice.items.map((item, idx) => (
                                    <tr key={idx} className="text-sm">
                                        <td className="py-4 px-2">
                                            <p className="text-slate-950 font-semibold">{item.productName}</p>
                                            {item.description && <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>}
                                        </td>
                                        <td className="py-4 px-2 text-slate-650">HSN: {item.hsnCode || item.sacCode || "-"}</td>
                                        <td className="py-4 px-2 text-center text-slate-700">{item.quantity} {item.unit || "Pcs"}</td>
                                        <td className="py-4 px-2 text-right text-slate-700">₹{item.unitPrice.toFixed(2)}</td>
                                        <td className="py-4 px-2 text-right text-slate-950 font-bold">₹{item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Summary */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-6 border-t border-slate-200">
                        <div className="text-xs text-slate-500">
                            <p>Thank you for your business!</p>
                            <p className="mt-1">This is a system-generated document.</p>
                        </div>

                        <div className="w-full md:w-72 space-y-2.5 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{invoice.subtotal.toFixed(2)}</span>
                            </div>
                            {(invoice.sgst && invoice.sgst > 0) || (invoice.cgst && invoice.cgst > 0) ? (
                                <>
                                    <div className="flex justify-between text-slate-550 text-xs">
                                        <span>SGST</span>
                                        <span>₹{(invoice.sgst || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-550 text-xs">
                                        <span>CGST</span>
                                        <span>₹{(invoice.cgst || 0).toFixed(2)}</span>
                                    </div>
                                </>
                            ) : invoice.igst && invoice.igst > 0 ? (
                                <div className="flex justify-between text-slate-550 text-xs">
                                    <span>IGST</span>
                                    <span>₹{invoice.igst.toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="flex justify-between text-slate-600">
                                    <span>Tax Amount</span>
                                    <span>₹{invoice.taxAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-slate-600 pb-4 border-b border-slate-200">
                                <span>Total Tax</span>
                                <span>₹{invoice.taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 pb-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-md text-white">
                                <span className="text-base font-bold">Grand Total</span>
                                <span className="text-2xl font-black">
                                    ₹{invoice.grandTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="px-8 lg:px-12 py-8 bg-slate-50 border-t border-slate-200 text-center">
                        <p className="text-slate-650 text-sm">
                            This is a digitally generated invoice. No signature required.
                        </p>
                        <p className="text-indigo-600/60 text-[10px] mt-2 tracking-widest font-bold uppercase">
                            Powered by SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED ✨
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicInvoiceView;
