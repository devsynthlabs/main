import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FileText,
    Printer,
    AlertCircle,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface PurchaseItem {
    itemName: string;
    itemCode?: string;
    hsnCode?: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    taxPercent: number;
    taxAmount: number;
    sgstRate: number;
    sgstAmount: number;
    cgstRate: number;
    cgstAmount: number;
    igstRate: number;
    igstAmount: number;
    isInterState: boolean;
    amount: number;
}

interface PurchaseInvoiceData {
    _id: string;
    supplierName: string;
    phone: string;
    gstin: string;
    billNo: string;
    billDate: string;
    stateOfSupply: string;
    businessState: string;
    items: PurchaseItem[];
    subtotal: number;
    totalSgst: number;
    totalCgst: number;
    totalIgst: number;
    totalTax: number;
    total: number;
    paid: number;
    balance: number;
    createdAt: string;
}

const PublicPurchaseInvoiceView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<PurchaseInvoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/purchase-invoice/public/${id}`);
                if (!response.ok) {
                    throw new Error("Purchase invoice not found or could not be loaded");
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
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-amber-200 font-medium">Loading Purchase Invoice...</p>
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
                    <p className="text-slate-400 mb-6">{error || "The purchase invoice you're looking for doesn't exist or the link is invalid."}</p>
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
        <>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #purchase-invoice-print, #purchase-invoice-print * { visibility: visible; }
                    #purchase-invoice-print { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                }
            `}</style>
            <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
                {/* Background Effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 lg:py-20">
                    {/* Top Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 no-print">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30">
                                <FileText className="h-6 w-6 text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Purchase Invoice</h1>
                                <p className="text-slate-400 text-sm">#{invoice.billNo}</p>
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
                    <div id="purchase-invoice-print" className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden">
                        {/* Header Section */}
                        <div className="p-8 lg:p-12 border-b border-white/10 bg-gradient-to-br from-amber-600/10 to-transparent">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4">Supplier</h2>
                                        <div className="space-y-1">
                                            <p className="text-xl font-bold text-white">{invoice.supplierName}</p>
                                            {invoice.phone && <p className="text-slate-400">Phone: {invoice.phone}</p>}
                                            {invoice.gstin && <p className="text-slate-400">GSTIN: {invoice.gstin}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4">State of Supply</h2>
                                        <p className="text-white font-medium">{invoice.stateOfSupply}</p>
                                    </div>
                                </div>

                                <div className="space-y-6 md:text-right flex flex-col md:items-end">
                                    <div className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        Purchase Invoice
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-4 md:w-full">
                                        <div>
                                            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bill No</h2>
                                            <p className="text-white font-medium">{invoice.billNo}</p>
                                        </div>
                                        <div>
                                            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bill Date</h2>
                                            <p className="text-white font-medium">{invoice.billDate}</p>
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
                                            <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500">Item</th>
                                            <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Qty</th>
                                            <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Unit</th>
                                            <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Price/Unit</th>
                                            <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Tax</th>
                                            <th className="pb-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {invoice.items.map((item, idx) => (
                                            <tr key={idx} className="group">
                                                <td className="py-6 pr-4">
                                                    <p className="text-white font-semibold transition-colors group-hover:text-amber-400">{item.itemName}</p>
                                                    {item.hsnCode && <p className="text-slate-500 text-xs mt-1">HSN: {item.hsnCode}</p>}
                                                </td>
                                                <td className="py-6 text-center text-slate-300 font-medium">{item.quantity}</td>
                                                <td className="py-6 text-center text-slate-300 font-medium">{item.unit}</td>
                                                <td className="py-6 text-right text-slate-300 font-medium">₹{item.pricePerUnit.toFixed(2)}</td>
                                                <td className="py-6 text-right text-slate-300 font-medium">{item.taxPercent}%</td>
                                                <td className="py-6 text-right text-white font-bold">₹{item.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals Section */}
                            <div className="mt-12 flex flex-col md:flex-row justify-between items-start gap-12 pt-12 border-t border-white/10">
                                <div className="max-w-xs">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4">Payment Summary</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase">Paid</p>
                                                <p className="text-emerald-400 font-bold text-lg">₹{invoice.paid.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        {invoice.balance > 0 && (
                                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-red-500/20">
                                                <div>
                                                    <p className="text-xs text-slate-500 uppercase">Balance Due</p>
                                                    <p className="text-red-400 font-bold text-lg">₹{invoice.balance.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full md:w-80 space-y-4">
                                    <div className="flex justify-between items-center text-slate-400">
                                        <span>Subtotal</span>
                                        <span className="text-white font-medium">₹{invoice.subtotal.toFixed(2)}</span>
                                    </div>
                                    {/* GST Breakdown */}
                                    {(invoice.totalSgst > 0 || invoice.totalCgst > 0) ? (
                                        <>
                                            <div className="flex justify-between items-center text-slate-400 text-sm">
                                                <span>SGST</span>
                                                <span className="text-white font-medium">₹{invoice.totalSgst.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-slate-400 text-sm">
                                                <span>CGST</span>
                                                <span className="text-white font-medium">₹{invoice.totalCgst.toFixed(2)}</span>
                                            </div>
                                        </>
                                    ) : invoice.totalIgst > 0 ? (
                                        <div className="flex justify-between items-center text-slate-400 text-sm">
                                            <span>IGST</span>
                                            <span className="text-white font-medium">₹{invoice.totalIgst.toFixed(2)}</span>
                                        </div>
                                    ) : null}
                                    <div className="flex justify-between items-center text-slate-400 pb-4 border-b border-white/5">
                                        <span>Total Tax</span>
                                        <span className="text-white font-medium">₹{invoice.totalTax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-lg font-bold text-white">Grand Total</span>
                                        <span className="text-3xl font-black text-amber-400 bg-amber-400/10 px-4 py-1 rounded-2xl">
                                            ₹{invoice.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 lg:px-12 py-8 bg-black/20 border-t border-white/5 text-center">
                            <p className="text-slate-500 text-sm">
                                This is a digitally generated purchase invoice. No signature required.
                            </p>
                            <p className="text-amber-500/40 text-[10px] mt-2 tracking-widest font-bold uppercase">
                                Powered by Sri Andal Financial Automation
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicPurchaseInvoiceView;
