import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  Upload,
  Download,
  FileText,
  Sparkles,
  X,
  ScanLine,
  FileImage,
  Type,
  Loader2,
  RefreshCw,
  Share2,
  MessageCircle,
  ArrowLeft
} from "lucide-react";
import Tesseract from "tesseract.js";
import jsPDF from "jspdf";
import { API_ENDPOINTS, API_BASE_URL } from "@/lib/api";

// AI-extracted invoice data structure (exported for use in other components)
export interface AIInvoiceData {
  vendor?: {
    name?: string;
    address?: string;
    gstin?: string;
    phone?: string;
    email?: string;
  };
  invoice?: {
    number?: string;
    date?: string;
    dueDate?: string;
  };
  customer?: {
    name?: string;
    address?: string;
    gstin?: string;
    phone?: string;
  };
  items?: Array<{
    name?: string;
    description?: string;
    hsnCode?: string;
    quantity?: number;
    unit?: string;
    rate?: number;
    discount?: number;
    taxPercent?: number;
    taxAmount?: number;
    amount?: number;
  }>;
  totals?: {
    subtotal?: number;
    discountTotal?: number;
    sgst?: number;
    cgst?: number;
    igst?: number;
    taxTotal?: number;
    grandTotal?: number;
    amountPaid?: number;
    balanceDue?: number;
  };
  paymentInfo?: {
    method?: string;
    bankDetails?: string;
    upiId?: string;
  };
  notes?: string;
}

interface DocScannerProps {
  onTextExtracted?: (text: string) => void;
  onImageProcessed?: (imageData: string) => void;
  onAIDataExtracted?: (data: AIInvoiceData) => void;
}

type FilterType = 'original' | 'grayscale' | 'highContrast' | 'blackWhite' | 'brighten' | 'darken' | 'sepia' | 'invert' | 'sharpen';

interface PageData {
  id: string;
  originalImage: string;
  processedImage: string;
  filter: FilterType;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  brightness: number;
  contrast: number;
}

const DocScanner: React.FC<DocScannerProps> = ({ onTextExtracted, onImageProcessed, onAIDataExtracted }) => {
  // States
  const [activeStep, setActiveStep] = useState<'capture' | 'export'>('capture');
  // Multi-page support
  const [pages, setPages] = useState<PageData[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Legacy single image states (for current editing)
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('original');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [showOcrResult, setShowOcrResult] = useState(false);
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [uploadedPdf, setUploadedPdf] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [isSavingToCloud, setIsSavingToCloud] = useState(false);
  const [savedToCloud, setSavedToCloud] = useState(false);
  const [savedFileUrl, setSavedFileUrl] = useState<string | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      // Try back camera first (mobile), fallback to any camera (desktop)
      let stream: MediaStream | null = null;

      try {
        // First try back camera for mobile devices
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
      } catch {
        // Fallback to any available camera (front camera on desktop)
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      }

      streamRef.current = stream;

      // Set isUsingCamera FIRST so the video element renders
      setIsUsingCamera(true);

    } catch (error) {
      console.error("Camera error:", error);
      alert("Could not access camera. Please check permissions or use file upload.");
    }
  };

  // Effect to attach stream to video element once it's rendered
  useEffect(() => {
    if (isUsingCamera && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.muted = true;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play()
          .then(() => setIsCameraReady(true))
          .catch(err => console.error("Video play error:", err));
      };
    }
  }, [isUsingCamera]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsUsingCamera(false);
    setIsCameraReady(false);
  }, []);

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.95);

    if (isAddingPage) {
      // Adding a new page to existing document
      const newPage: PageData = {
        id: `page-${Date.now()}`,
        originalImage: imageData,
        processedImage: imageData,
        filter: 'highContrast',
        rotation: 0,
        flipH: false,
        flipV: false,
        brightness: 100,
        contrast: 100
      };
      setPages(prev => [...prev, newPage]);
      setCurrentPageIndex(pages.length);
      setIsAddingPage(false);
    } else {
      // First page capture
      const newPage: PageData = {
        id: `page-${Date.now()}`,
        originalImage: imageData,
        processedImage: imageData,
        filter: 'highContrast',
        rotation: 0,
        flipH: false,
        flipV: false,
        brightness: 100,
        contrast: 100
      };
      setPages([newPage]);
      setCurrentPageIndex(0);
    }

    setCapturedImage(imageData);
    setProcessedImage(imageData);
    setCurrentFilter('highContrast');
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);

    // Stop camera after capture, go directly to export
    stopCamera();
    setActiveStep('export');
  };

  // Add another page
  const addAnotherPage = () => {
    // Save current page edits first
    saveCurrentPageEdits();
    setIsAddingPage(true);
    setActiveStep('capture');
  };

  // Save current page edits
  const saveCurrentPageEdits = () => {
    if (pages.length > 0 && processedImage) {
      setPages(prev => prev.map((page, index) =>
        index === currentPageIndex
          ? {
            ...page,
            processedImage: processedImage,
            filter: currentFilter,
            rotation: rotation,
            flipH: flipH,
            flipV: flipV,
            brightness: brightness,
            contrast: contrast
          }
          : page
      ));
    }
  };

  // Switch to a different page
  const switchToPage = (index: number) => {
    saveCurrentPageEdits();
    setCurrentPageIndex(index);
    const page = pages[index];
    if (page) {
      setCapturedImage(page.originalImage);
      setProcessedImage(page.processedImage);
      setCurrentFilter(page.filter);
      setRotation(page.rotation);
      setFlipH(page.flipH);
      setFlipV(page.flipV);
      setBrightness(page.brightness);
      setContrast(page.contrast);
    }
  };

  // Delete a page
  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      resetScanner();
      return;
    }
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
    const newIndex = index >= newPages.length ? newPages.length - 1 : index;
    setCurrentPageIndex(newIndex);
    const page = newPages[newIndex];
    if (page) {
      setCapturedImage(page.originalImage);
      setProcessedImage(page.processedImage);
      setCurrentFilter(page.filter);
      setRotation(page.rotation);
      setFlipH(page.flipH);
      setFlipV(page.flipV);
      setBrightness(page.brightness);
      setContrast(page.contrast);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    // Check if it's a PDF
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    reader.onload = (e) => {
      const fileData = e.target?.result as string;

      if (isPdf) {
        // Handle PDF - skip editing, go directly to export for AI extraction
        setUploadedPdf(fileData);
        setPdfFileName(file.name);
        setCapturedImage(null);
        setProcessedImage(null);
        setPages([]);
        setActiveStep('export');
        return;
      }

      // Handle image files
      const imageData = fileData;

      if (isAddingPage) {
        // Adding a new page
        const newPage: PageData = {
          id: `page-${Date.now()}`,
          originalImage: imageData,
          processedImage: imageData,
          filter: 'highContrast',
          rotation: 0,
          flipH: false,
          flipV: false,
          brightness: 100,
          contrast: 100
        };
        setPages(prev => [...prev, newPage]);
        setCurrentPageIndex(pages.length);
        setIsAddingPage(false);
      } else {
        // First page
        const newPage: PageData = {
          id: `page-${Date.now()}`,
          originalImage: imageData,
          processedImage: imageData,
          filter: 'highContrast',
          rotation: 0,
          flipH: false,
          flipV: false,
          brightness: 100,
          contrast: 100
        };
        setPages([newPage]);
        setCurrentPageIndex(0);
      }

      // Clear any previous PDF
      setUploadedPdf(null);
      setPdfFileName(null);

      setCapturedImage(imageData);
      setProcessedImage(imageData);
      setCurrentFilter('highContrast');
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setBrightness(100);
      setContrast(100);
      setActiveStep('export');
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  // Apply filter to image
  const applyFilter = useCallback((filterType: FilterType) => {
    if (!capturedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Draw image
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      // Apply color filter
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      switch (filterType) {
        case 'grayscale':
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = avg;
          }
          break;

        case 'highContrast':
          // Gentle S-curve contrast: darken darks, lighten lights without blowing out text
          for (let i = 0; i < data.length; i += 4) {
            for (let c = 0; c < 3; c++) {
              const val = data[i + c] / 255;
              // S-curve: pushes midtones apart while preserving detail
              const adjusted = val < 0.5
                ? 0.5 * Math.pow(2 * val, 1.4)
                : 1 - 0.5 * Math.pow(2 * (1 - val), 1.4);
              data[i + c] = Math.round(adjusted * 255);
            }
          }
          break;

        case 'blackWhite':
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const bw = avg > 128 ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = bw;
          }
          break;

        case 'brighten':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] + 30);
            data[i + 1] = Math.min(255, data[i + 1] + 30);
            data[i + 2] = Math.min(255, data[i + 2] + 30);
          }
          break;

        case 'darken':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.max(0, data[i] - 30);
            data[i + 1] = Math.max(0, data[i + 1] - 30);
            data[i + 2] = Math.max(0, data[i + 2] - 30);
          }
          break;

        case 'sepia':
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
            data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
            data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
          }
          break;

        case 'invert':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
          }
          break;

        case 'sharpen':
          // Simple sharpen (edge enhancement)
          const factor = 0.5;
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, data[i] + (data[i] - 128) * factor));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + (data[i + 1] - 128) * factor));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + (data[i + 2] - 128) * factor));
          }
          break;
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedImage(canvas.toDataURL('image/jpeg', 0.95));
    };

    img.src = capturedImage;
    setCurrentFilter(filterType);
  }, [capturedImage, rotation, flipH, flipV, brightness, contrast]);

  // Rotate image
  const rotateImage = (direction: 'cw' | 'ccw') => {
    setRotation(prev => direction === 'cw' ? prev + 90 : prev - 90);
  };

  // Run OCR on all pages
  const runOcr = async () => {
    // Save current page first
    saveCurrentPageEdits();

    if (pages.length === 0 && !processedImage) return;

    setIsProcessingOcr(true);
    setOcrProgress(0);

    try {
      let allText = '';
      const pagesToProcess = pages.length > 0 ? pages : [{ processedImage: processedImage }];
      const totalPages = pagesToProcess.length;

      for (let i = 0; i < totalPages; i++) {
        const pageImage = pagesToProcess[i].processedImage;
        if (!pageImage) continue;

        const result = await Tesseract.recognize(pageImage, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              const pageProgress = (i / totalPages) * 100 + (m.progress * 100 / totalPages);
              setOcrProgress(Math.round(pageProgress));
            }
          }
        });

        if (totalPages > 1) {
          allText += `--- Page ${i + 1} ---\n${result.data.text}\n\n`;
        } else {
          allText = result.data.text;
        }
      }

      setExtractedText(allText.trim());
      setShowOcrResult(true);
      onTextExtracted?.(allText.trim());
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to extract text. Please try again.");
    } finally {
      setIsProcessingOcr(false);
      setOcrProgress(0);
    }
  };

  // Analyze with Gemini AI
  const analyzeWithAI = async () => {
    saveCurrentPageEdits();

    // Check if we have PDF or image to analyze
    if (!uploadedPdf && pages.length === 0 && !processedImage) return;

    setIsProcessingAI(true);
    setAIError(null);

    try {
      let dataToAnalyze: string;
      let mimeType: string;

      if (uploadedPdf) {
        // Use PDF
        dataToAnalyze = uploadedPdf;
        mimeType = 'application/pdf';
      } else {
        // Use the first page or current processed image
        const imageToAnalyze = pages.length > 0 ? pages[0].processedImage : processedImage;

        if (!imageToAnalyze) {
          throw new Error("No image available for analysis");
        }
        dataToAnalyze = imageToAnalyze;
        mimeType = 'image/jpeg';
      }

      const response = await fetch(API_ENDPOINTS.AI_INVOICE_OCR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: dataToAnalyze,
          mimeType: mimeType
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to analyze invoice');
      }

      if (result.success && result.data) {
        // Call the callback with extracted data
        onAIDataExtracted?.(result.data);
        alert("✅ Invoice data extracted successfully! Check the form for auto-filled values.");
      } else {
        throw new Error(result.message || 'No data extracted from invoice');
      }
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      setAIError(error.message || "Failed to analyze invoice with AI");
      alert(`❌ AI Analysis Failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Download image
  const downloadImage = (format: 'jpeg' | 'png' | 'pdf') => {
    if (!processedImage) return;

    if (format === 'pdf') {
      const pdf = new jsPDF();
      const img = new Image();
      img.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgRatio = img.width / img.height;
        const pageRatio = pageWidth / pageHeight;

        let drawWidth: number;
        let drawHeight: number;

        if (imgRatio > pageRatio) {
          drawWidth = pageWidth - 20;
          drawHeight = drawWidth / imgRatio;
        } else {
          drawHeight = pageHeight - 20;
          drawWidth = drawHeight * imgRatio;
        }

        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        pdf.addImage(processedImage!, 'JPEG', x, y, drawWidth, drawHeight);
        pdf.save(`scanned_document_${Date.now()}.pdf`);
      };
      img.src = processedImage!;
      return;
    }

    const link = document.createElement('a');
    link.download = `scanned_document_${Date.now()}.${format}`;
    link.href = processedImage;
    link.click();
  };

  // Share image
  const shareImage = async () => {
    if (!processedImage) return;

    try {
      const blob = await fetch(processedImage).then(r => r.blob());
      const file = new File([blob], 'scanned_document.jpg', { type: 'image/jpeg' });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Scanned Document',
        });
      } else {
        alert("Sharing not supported on this device");
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  // Save scanned document to backend (MongoDB)
  const saveToCloud = async () => {
    const pagesToSave = pages.length > 0 ? pages : processedImage ? [{ processedImage }] : [];
    if (pagesToSave.length === 0) {
      alert("No scanned document to save");
      return;
    }

    setIsSavingToCloud(true);
    try {
      // Generate a PDF from all pages
      const pdf = new jsPDF();
      for (let i = 0; i < pagesToSave.length; i++) {
        const pageImg = pagesToSave[i].processedImage;
        if (!pageImg) continue;
        if (i > 0) pdf.addPage();

        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = pageImg;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgRatio = img.width / img.height;
        const pageRatio = pageWidth / pageHeight;
        let drawWidth: number, drawHeight: number;

        if (imgRatio > pageRatio) {
          drawWidth = pageWidth - 20;
          drawHeight = drawWidth / imgRatio;
        } else {
          drawHeight = pageHeight - 20;
          drawWidth = drawHeight * imgRatio;
        }

        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;
        pdf.addImage(pageImg, 'JPEG', x, y, drawWidth, drawHeight);
      }

      // Convert PDF to base64
      const pdfBase64 = pdf.output('datauristring').split(',')[1];
      const timestamp = Date.now();
      const fileName = `scan_${timestamp}.pdf`;

      // Upload via backend API
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/scanned-docs/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fileData: pdfBase64, fileName }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save");
      }

      const data = await res.json();
      // Build the public file URL for sharing
      const fileUrl = `${API_BASE_URL}/scanned-docs/file/${data.docId}`;
      setSavedFileUrl(fileUrl);
      setSavedToCloud(true);
    } catch (error: any) {
      console.error("Save error:", error);
    } finally {
      setIsSavingToCloud(false);
    }
  };

  // Guard to prevent overlapping share calls
  const [isSharing, setIsSharing] = useState(false);

  // Share to WhatsApp (save first if not saved)
  const saveAndShareWhatsApp = async () => {
    if (isSharing) return;
    if (!savedToCloud) {
      await saveToCloud();
    }
    await shareToWhatsApp();
  };

  // Share to WhatsApp as PDF
  const shareToWhatsApp = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const pdf = new jsPDF();
      const pagesToExport = pages.length > 0 ? pages : processedImage ? [{ processedImage }] : [];

      if (pagesToExport.length === 0) return;

      for (let i = 0; i < pagesToExport.length; i++) {
        const pageImg = pagesToExport[i].processedImage;
        if (!pageImg) continue;

        if (i > 0) pdf.addPage();

        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = pageImg;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgRatio = img.width / img.height;
        const pageRatio = pageWidth / pageHeight;

        let drawWidth: number;
        let drawHeight: number;

        if (imgRatio > pageRatio) {
          drawWidth = pageWidth - 20;
          drawHeight = drawWidth / imgRatio;
        } else {
          drawHeight = pageHeight - 20;
          drawWidth = drawHeight * imgRatio;
        }

        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        pdf.addImage(pageImg, 'JPEG', x, y, drawWidth, drawHeight);
      }

      // Convert PDF to a File object for sharing
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], `scanned_document_${Date.now()}.pdf`, { type: 'application/pdf' });

      // Try Web Share API first (shares actual PDF file on mobile)
      let shared = false;
      if (navigator.share && navigator.canShare) {
        try {
          if (navigator.canShare({ files: [pdfFile] })) {
            await navigator.share({
              title: 'Scanned Document',
              text: 'Here is your invoice. Thank you! - Powered by Shree Andal AI Software Solutions',
              files: [pdfFile],
            });
            shared = true;
          }
        } catch (shareErr: any) {
          // AbortError = user cancelled, InvalidStateError = previous share pending
          if (shareErr.name !== 'AbortError') {
            console.warn("Web Share failed, using fallback:", shareErr.message);
          } else {
            shared = true; // user cancelled intentionally
          }
        }
      }

      // Fallback: open WhatsApp directly with document link
      if (!shared) {
        if (savedFileUrl) {
          const message = `Here is your invoice: ${savedFileUrl}\n\nThank you! - Powered by Shree Andal AI Software Solutions`;
          window.location.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        } else {
          // No saved URL — download PDF and open WhatsApp
          pdf.save(`scanned_document_${Date.now()}.pdf`);
          const message = "Here is your invoice. Thank you! - Powered by Shree Andal AI Software Solutions";
          window.location.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        }
      }
    } catch (error: any) {
      console.error("WhatsApp share error:", error);
    } finally {
      setIsSharing(false);
    }
  };

  // Reset scanner
  const resetScanner = () => {
    setCapturedImage(null);
    setProcessedImage(null);
    setCurrentFilter('original');
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setExtractedText("");
    setShowOcrResult(false);
    setActiveStep('capture');
    setPages([]);
    setCurrentPageIndex(0);
    setIsAddingPage(false);
    setUploadedPdf(null);
    setPdfFileName(null);
    setAIError(null);
    setSavedToCloud(false);
    setSavedFileUrl(null);
    stopCamera();
  };

  // Apply filter when settings change
  useEffect(() => {
    if (capturedImage) {
      applyFilter(currentFilter);
    }
  }, [rotation, flipH, flipV, brightness, contrast, applyFilter, capturedImage, currentFilter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="space-y-6">
      {/* Fullscreen Camera Overlay */}
      {isUsingCamera && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Back button */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md text-white rounded-xl hover:bg-white/25 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
            <span className="text-white/70 text-sm font-medium">Document Scanner</span>
            <div className="w-20" />
          </div>

          {/* Camera feed - full screen */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Scan frame overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[85%] h-[65%] border-2 border-white/40 rounded-2xl relative">
              <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-blue-400 rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-blue-400 rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-blue-400 rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-blue-400 rounded-br-xl" />
            </div>
          </div>

          {/* Bottom hint */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2">
            <div className="bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-full">
              <p className="text-white/90 text-sm font-medium">Align document within frame</p>
            </div>
          </div>

          {/* Camera controls */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6">
            <button
              onClick={stopCamera}
              className="p-4 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-all backdrop-blur-md"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={capturePhoto}
              disabled={!isCameraReady}
              className="p-7 bg-white rounded-full hover:scale-105 transition-all shadow-2xl shadow-blue-500/30 disabled:opacity-50 ring-4 ring-white/30"
            >
              <Camera className="h-9 w-9 text-blue-600" />
            </button>
            <button className="p-4 bg-white/15 text-white rounded-full hover:bg-white/25 transition-all backdrop-blur-md">
              <RefreshCw className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          { id: 'capture', label: 'Scan' },
          { id: 'export', label: 'Extract' }
        ].map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => {
                if (step.id === 'capture') resetScanner();
                else if (capturedImage || uploadedPdf) setActiveStep(step.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeStep === step.id
                  ? 'bg-blue-500/30 text-white border border-blue-400/50'
                  : capturedImage || uploadedPdf || step.id === 'capture'
                    ? 'bg-white/5 text-blue-300 border border-blue-400/20 hover:bg-white/10'
                    : 'bg-white/5 text-blue-400/40 border border-blue-400/10 cursor-not-allowed'
                }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep === step.id ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-300'
                }`}>
                {index + 1}
              </span>
              <span className="font-medium">{step.label}</span>
            </button>
            {index < 1 && (
              <div className={`w-12 h-0.5 ${capturedImage || uploadedPdf ? 'bg-blue-400/50' : 'bg-blue-400/20'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Hidden Canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* CAPTURE STEP */}
      {activeStep === 'capture' && (
        <div className="space-y-6">
          {/* Camera / Upload Area */}
          <div className="border-2 border-dashed border-blue-400/30 rounded-3xl overflow-hidden bg-gradient-to-b from-blue-500/10 to-indigo-500/10 backdrop-blur-xl">
            {isUsingCamera ? null : (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="p-6 bg-blue-500/20 rounded-full border border-blue-400/30">
                    <ScanLine className="h-16 w-16 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white mb-2">
                      Scan Invoice for OCR
                    </p>
                    <p className="text-blue-300/80">
                      Capture or upload invoice to auto-extract data with AI
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={startCamera}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-500/30 flex items-center gap-3"
                    >
                      <Camera className="h-5 w-5" />
                      Capture
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl shadow-indigo-500/30 flex items-center gap-3"
                    >
                      <Upload className="h-5 w-5" />
                      Upload Invoice/PDF
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EXPORT STEP */}
      {activeStep === 'export' && (processedImage || uploadedPdf) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Final Preview */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg">
              {uploadedPdf ? 'Uploaded PDF' : 'Final Document'}
            </h3>
            <div className="border border-blue-400/20 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-xl">
              {uploadedPdf ? (
                <div className="w-full h-[400px] flex flex-col items-center justify-center gap-4 p-6">
                  <div className="p-6 bg-red-500/20 rounded-full border border-red-400/30">
                    <FileText className="h-16 w-16 text-red-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg mb-1">{pdfFileName || 'Invoice.pdf'}</p>
                    <p className="text-blue-300/70 text-sm">PDF ready for AI extraction</p>
                  </div>
                  <div className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-xl text-sm font-medium border border-emerald-400/30">
                    Click "Auto-Fill Invoice with AI" to extract data
                  </div>
                </div>
              ) : (
                <img
                  src={processedImage || ''}
                  alt="Final document"
                  className="w-full h-[400px] object-contain"
                />
              )}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-6">
            {/* Download Options */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-blue-400/20">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-400" />
                Download
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => downloadImage('jpeg')}
                  className="p-4 bg-white/5 rounded-xl border border-blue-400/20 hover:bg-white/10 transition-all text-center"
                >
                  <FileImage className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <span className="text-white font-medium text-sm">JPEG</span>
                </button>
                <button
                  onClick={() => downloadImage('png')}
                  className="p-4 bg-white/5 rounded-xl border border-blue-400/20 hover:bg-white/10 transition-all text-center"
                >
                  <FileImage className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                  <span className="text-white font-medium text-sm">PNG</span>
                </button>
                <button
                  onClick={() => downloadImage('pdf')}
                  className="p-4 bg-white/5 rounded-xl border border-blue-400/20 hover:bg-white/10 transition-all text-center"
                >
                  <FileText className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  <span className="text-white font-medium text-sm">PDF</span>
                </button>
              </div>
            </div>

            {/* AI Analysis - Commented out
            {onAIDataExtracted && (
              <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-purple-400/30">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  AI Invoice Analysis
                </h3>
                <p className="text-blue-200/80 text-sm mb-4">
                  Use AI to automatically extract vendor, items, taxes, and totals from this invoice.
                </p>
                <button
                  onClick={analyzeWithAI}
                  disabled={isProcessingAI}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-500 hover:to-blue-500 transition-all shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingAI ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Auto-Fill Invoice with AI
                    </>
                  )}
                </button>
                {aiError && (
                  <p className="text-red-400 text-sm mt-2">{aiError}</p>
                )}
              </div>
            )}
            */}

            {/* Save & Share */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-blue-400/20">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-400" />
                Save & Share
              </h3>
              <div className="space-y-3">
                {/* Save to Cloud */}
                <button
                  onClick={saveToCloud}
                  disabled={isSavingToCloud || savedToCloud}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    savedToCloud
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/30'
                  } disabled:opacity-70`}
                >
                  {isSavingToCloud ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : savedToCloud ? (
                    <>
                      <Download className="h-5 w-5" />
                      Saved to Cloud
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      Save Document
                    </>
                  )}
                </button>

                {/* WhatsApp Share - enabled after save */}
                <button
                  onClick={saveAndShareWhatsApp}
                  disabled={isSavingToCloud}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <MessageCircle className="h-5 w-5" />
                  {savedToCloud ? 'Share to WhatsApp' : 'Save & Share to WhatsApp'}
                </button>

                <button
                  onClick={shareImage}
                  className="w-full py-3 bg-white/5 text-blue-300 rounded-xl font-medium hover:bg-white/10 transition-all border border-blue-400/20 flex items-center justify-center gap-2"
                >
                  <Share2 className="h-5 w-5" />
                  Share Document
                </button>
              </div>
            </div>

            {/* OCR Result */}
            {extractedText && (
              <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-blue-400/20">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Type className="h-5 w-5 text-blue-400" />
                  Extracted Text
                </h3>
                <textarea
                  value={extractedText}
                  readOnly
                  className="w-full h-40 bg-black/30 text-white rounded-xl p-4 text-sm border border-blue-400/20"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(extractedText);
                    alert("Text copied!");
                  }}
                  className="mt-3 px-4 py-2 bg-white/5 text-blue-300 rounded-lg text-sm hover:bg-white/10 transition-all"
                >
                  Copy Text
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={resetScanner}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                Scan New
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OCR Progress Modal */}
      {isProcessingOcr && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-blue-400/30 rounded-2xl p-8 text-center max-w-sm">
            <Loader2 className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-spin" />
            <p className="text-white font-bold text-lg mb-2">Extracting Text...</p>
            <p className="text-blue-300 mb-4">{ocrProgress}% complete</p>
            <div className="w-full bg-blue-900/40 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full transition-all"
                style={{ width: `${ocrProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocScanner;
