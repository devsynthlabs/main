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

interface InvoiceItem {
    productName: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface InvoiceData {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    customerName: string;
    customerEmail: string;
    businessName: string;
    businessEmail: string;
    items: InvoiceItem[];
    subtotal: number;
    taxAmount: number;
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
                const response = await fetch(`http://localhost:5001/api/invoice/${id}`);
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

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
            {/* Abstract Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 lg:py-20">
                {/* Top Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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
                <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="p-8 lg:p-12 border-b border-white/10 bg-gradient-to-br from-blue-600/10 to-transparent">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-4">From</h2>
                                    <div className="space-y-1">
                                        <p className="text-xl font-bold text-white">{invoice.businessName}</p>
                                        <p className="text-slate-400">{invoice.businessEmail}</p>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-4">Bill To</h2>
                                    <div className="space-y-1">
                                        <p className="text-xl font-bold text-white">{invoice.customerName}</p>
                                        <p className="text-slate-400">{invoice.customerEmail}</p>
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
                                    <div>
                                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date Issued</h2>
                                        <p className="text-white font-medium">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Due Date</h2>
                                        <p className="text-white font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="p-8 lg:p-12">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-left">
                                        <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500">Item Description</th>
                                        <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Qty</th>
                                        <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Unit Price</th>
                                        <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {invoice.items.map((item, idx) => (
                                        <tr key={idx} className="group">
                                            <td className="py-6 pr-4">
                                                <p className="text-white font-semibold transition-colors group-hover:text-blue-400">{item.productName}</p>
                                                {item.description && <p className="text-slate-400 text-sm mt-1">{item.description}</p>}
                                            </td>
                                            <td className="py-6 text-center text-slate-300 font-medium">{item.quantity}</td>
                                            <td className="py-6 text-right text-slate-300 font-medium">${item.unitPrice.toFixed(2)}</td>
                                            <td className="py-6 text-right text-white font-bold">${item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="mt-12 flex flex-col md:flex-row justify-between items-start gap-12 pt-12 border-t border-white/10">
                            <div className="max-w-xs">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-4">Payment Method</h2>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <CreditCard className="h-5 w-5 text-slate-400" />
                                    <p className="text-white font-medium capitalize">{invoice.paymentMethod.replace("_", " ")}</p>
                                </div>
                            </div>

                            <div className="w-full md:w-80 space-y-4">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="text-white font-medium">${invoice.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400 pb-4 border-b border-white/5">
                                    <span>Tax Amount</span>
                                    <span className="text-white font-medium">${invoice.taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-white">Grand Total</span>
                                    <span className="text-3xl font-black text-blue-400 bg-blue-400/10 px-4 py-1 rounded-2xl">
                                        ${invoice.grandTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="px-8 lg:px-12 py-8 bg-black/20 border-t border-white/5 text-center">
                        <p className="text-slate-500 text-sm">
                            This is a digitally generated invoice. No signature required.
                        </p>
                        <p className="text-blue-500/40 text-[10px] mt-2 tracking-widest font-bold uppercase">
                            Powered by Invoice Automation System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicInvoiceView;
