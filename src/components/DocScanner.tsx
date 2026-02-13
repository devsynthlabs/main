import React, { useState, useRef, useMemo } from "react";
import {
  Upload,
  Download,
  FileText,
  Sparkles,
  Loader2,
  RefreshCw,
  MessageCircle,
  CheckCircle,
  Table,
} from "lucide-react";
import { API_ENDPOINTS, API_BASE_URL } from "@/lib/api";

interface DocScannerProps {
  onTextExtracted?: (text: string) => void;
  onImageProcessed?: (imageData: string) => void;
}

const DocScanner: React.FC<DocScannerProps> = ({ onTextExtracted, onImageProcessed }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [uploadedPdf, setUploadedPdf] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [isSharingCSV, setIsSharingCSV] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload (image or PDF)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvContent(null);
    setAIError(null);

    const reader = new FileReader();
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    reader.onload = (e) => {
      const fileData = e.target?.result as string;
      if (isPdf) {
        setUploadedPdf(fileData);
        setPdfFileName(file.name);
        setCapturedImage(null);
        setProcessedImage(null);
      } else {
        setUploadedPdf(null);
        setPdfFileName(null);
        setCapturedImage(fileData);
        setProcessedImage(fileData);
        onImageProcessed?.(fileData);
      }
    };
    reader.readAsDataURL(file);
    if (event.target) event.target.value = '';
  };

  // Analyze with Gemini AI
  const analyzeWithAI = async () => {
    if (!uploadedPdf && !processedImage && !capturedImage) return;

    setIsProcessingAI(true);
    setAIError(null);

    try {
      let dataToAnalyze: string;
      let mimeType: string;

      if (uploadedPdf) {
        dataToAnalyze = uploadedPdf;
        mimeType = 'application/pdf';
      } else {
        const imageToAnalyze = processedImage || capturedImage;
        if (!imageToAnalyze) throw new Error("No image available for analysis");
        dataToAnalyze = imageToAnalyze;
        mimeType = 'image/jpeg';
      }

      const response = await fetch(API_ENDPOINTS.AI_INVOICE_OCR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataToAnalyze, mimeType })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to analyze invoice');
      }

      if (!result.success) {
        throw new Error(result.message || 'No data extracted from invoice');
      }

      const csv = result.csv;
      if (!csv || csv.trim().length === 0) {
        throw new Error('AI returned empty CSV. Try again or use a clearer image.');
      }

      setCsvContent(csv);
      onTextExtracted?.(csv);
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      setAIError(error.message || "Failed to analyze invoice with AI");
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Parse CSV string into rows for table display
  const csvRows = useMemo(() => {
    if (!csvContent) return [];
    return csvContent.split('\n').map(line => {
      const cells: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === ',' && !inQuotes) {
          cells.push(current);
          current = '';
        } else {
          current += ch;
        }
      }
      cells.push(current);
      return cells;
    });
  }, [csvContent]);

  // Find max columns for table rendering
  const maxCols = useMemo(() => {
    return csvRows.reduce((max, row) => Math.max(max, row.length), 0);
  }, [csvRows]);

  // Download CSV
  const downloadCSV = () => {
    if (!csvContent) return;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Share CSV to WhatsApp
  const shareCSVToWhatsApp = async () => {
    if (!csvContent) return;

    const fileName = `invoice_${Date.now()}.csv`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const file = new File([blob], fileName, { type: 'text/csv' });

    // Try native file share (mobile)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Invoice CSV' });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: save to backend → share link
    setIsSharingCSV(true);
    try {
      const csvBase64 = btoa(unescape(encodeURIComponent(csvContent)));
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/scanned-docs/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fileData: csvBase64, fileName, mimeType: 'text/csv' }),
      });

      if (res.ok) {
        const data = await res.json();
        const fileUrl = `${API_BASE_URL}/scanned-docs/file/${data.docId}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(`Invoice CSV: ${fileUrl}`)}`, '_blank');
      } else {
        downloadCSV();
      }
    } catch {
      downloadCSV();
    } finally {
      setIsSharingCSV(false);
    }
  };

  // Reset
  const resetScanner = () => {
    setCapturedImage(null);
    setProcessedImage(null);
    setUploadedPdf(null);
    setPdfFileName(null);
    setAIError(null);
    setCsvContent(null);
  };

  const hasFile = !!capturedImage || !!uploadedPdf;

  // Detect section header rows — single cell with text, all other cells empty, and text is ALL CAPS
  const isSectionHeader = (row: string[]): boolean => {
    if (row.length === 0) return false;
    const first = row[0].trim();
    if (!first) return false;
    const restEmpty = row.slice(1).every(c => c.trim() === '');
    return restEmpty && first === first.toUpperCase() && /^[A-Z\s]+$/.test(first);
  };

  // Detect table header — row right after a section header (or blank line) with 3+ filled columns
  const isTableHeader = (row: string[], rowIdx: number): boolean => {
    if (row.length < 3) return false;
    const filledCols = row.filter(c => c.trim() !== '').length;
    if (filledCols < 3) return false;
    // Check if previous non-empty row is a section header or this follows a blank line
    for (let i = rowIdx - 1; i >= 0; i--) {
      const prev = csvRows[i];
      if (prev.every(c => c.trim() === '')) continue;
      return isSectionHeader(prev);
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!csvContent && (
        <div className="space-y-6">
          {!hasFile && (
            <div className="border-2 border-dashed border-blue-400/30 rounded-3xl overflow-hidden bg-gradient-to-b from-blue-500/10 to-indigo-500/10 backdrop-blur-xl">
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="p-6 bg-blue-500/20 rounded-full border border-blue-400/30">
                    <Upload className="h-16 w-16 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white mb-2">Upload Invoice</p>
                    <p className="text-blue-300/80">Upload invoice image or PDF to extract data with AI</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl shadow-indigo-500/30 flex items-center gap-3"
                  >
                    <Upload className="h-5 w-5" />
                    Upload Invoice / PDF
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* File Preview + AI Extract */}
          {hasFile && (
            <div className="space-y-6">
              <div className="border border-blue-400/20 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-xl">
                {uploadedPdf ? (
                  <div className="w-full h-[300px] flex flex-col items-center justify-center gap-4 p-6">
                    <div className="p-6 bg-red-500/20 rounded-full border border-red-400/30">
                      <FileText className="h-16 w-16 text-red-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-lg mb-1">{pdfFileName || 'Invoice.pdf'}</p>
                      <p className="text-blue-300/70 text-sm">PDF ready for AI extraction</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={processedImage || capturedImage || ''}
                    alt="Uploaded invoice"
                    className="w-full max-h-[400px] object-contain"
                  />
                )}
              </div>

              <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-purple-400/30">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  AI Invoice Extraction
                </h3>
                <p className="text-blue-200/80 text-sm mb-4">
                  Extract invoice data and convert directly to CSV format.
                </p>
                <button
                  onClick={analyzeWithAI}
                  disabled={isProcessingAI}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-500 hover:to-blue-500 transition-all shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingAI ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Extract & Convert to CSV
                    </>
                  )}
                </button>
                {aiError && <p className="text-red-400 text-sm mt-3">{aiError}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-3 bg-white/5 text-blue-300 rounded-xl font-medium hover:bg-white/10 transition-all border border-blue-400/20"
                >
                  Upload Different File
                </button>
                <button
                  onClick={resetScanner}
                  className="px-6 py-3 bg-white/5 text-blue-300 rounded-xl font-medium hover:bg-red-500/20 hover:text-red-300 transition-all border border-blue-400/20"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ CSV DISPLAY — shows extracted data as spreadsheet table ═══ */}
      {csvContent && (
        <div className="space-y-5">
          {/* Success Banner */}
          <div className="flex items-center gap-3 p-4 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl">
            <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-white font-bold">Invoice Converted to CSV</p>
              <p className="text-emerald-300/70 text-sm">
                Review the data below, then share or download.
              </p>
            </div>
          </div>

          {/* CSV Table Display */}
          <div className="backdrop-blur-xl bg-slate-900/80 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border-b border-white/10">
              <Table className="h-4 w-4 text-emerald-400" />
              <span className="text-white font-semibold text-sm">
                invoice_data.csv
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <tbody>
                  {csvRows.map((row, rowIdx) => {
                    // Skip fully empty rows — show as spacer
                    if (row.every(c => c.trim() === '')) {
                      return (
                        <tr key={rowIdx}>
                          <td colSpan={maxCols} className="h-4" />
                        </tr>
                      );
                    }

                    const isSection = isSectionHeader(row);
                    const isHeader = isTableHeader(row, rowIdx);
                    // Grand Total row highlight
                    const isGrandTotal = row[0]?.trim().toLowerCase().includes('grand total') || row[0]?.trim().toLowerCase() === 'total';

                    return (
                      <tr
                        key={rowIdx}
                        className={
                          isSection
                            ? 'bg-blue-500/15'
                            : isHeader
                            ? 'bg-white/8 border-b border-white/15'
                            : isGrandTotal
                            ? 'bg-emerald-500/10 border-t border-emerald-400/20'
                            : 'border-b border-white/5 hover:bg-white/5'
                        }
                      >
                        {row.map((cell, colIdx) => (
                          <td
                            key={colIdx}
                            className={`py-2 px-3 ${
                              isSection
                                ? 'text-blue-300 font-bold text-xs uppercase tracking-wider'
                                : isHeader
                                ? 'text-slate-400 font-bold text-xs'
                                : isGrandTotal && colIdx === 0
                                ? 'text-white font-bold'
                                : isGrandTotal && colIdx > 0
                                ? 'text-emerald-400 font-bold text-right'
                                : colIdx === 0
                                ? 'text-slate-300'
                                : 'text-slate-200 text-right'
                            } ${colIdx === 0 ? 'min-w-[140px]' : 'min-w-[80px]'}`}
                          >
                            {cell}
                          </td>
                        ))}
                        {/* Fill empty cells if row has fewer columns */}
                        {Array.from({ length: maxCols - row.length }).map((_, i) => (
                          <td key={`empty-${i}`} className="py-2 px-3" />
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={shareCSVToWhatsApp}
              disabled={isSharingCSV}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSharingCSV ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Preparing CSV...
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5" />
                  Share to WhatsApp as CSV
                </>
              )}
            </button>

            <button
              onClick={downloadCSV}
              className="w-full py-3 bg-white/5 text-blue-300 rounded-xl font-medium hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download CSV
            </button>

            <button
              onClick={resetScanner}
              className="w-full py-3 bg-white/5 text-blue-300 rounded-xl font-medium hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Upload New Invoice
            </button>
          </div>
        </div>
      )}

      {/* AI Processing Modal */}
      {isProcessingAI && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-purple-400/30 rounded-2xl p-8 text-center max-w-sm">
            <Loader2 className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <p className="text-white font-bold text-lg mb-2">Converting Invoice to CSV...</p>
            <p className="text-blue-300/70 text-sm">AI is extracting and formatting data</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocScanner;
