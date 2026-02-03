import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  Upload,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Download,
  FileText,
  Contrast,
  Sun,
  Moon,
  Sparkles,
  X,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ScanLine,
  FileImage,
  Type,
  Loader2,
  RefreshCw,
  Share2,
  Smartphone,
  CreditCard,
  BookOpen,
  QrCode,
  Image as ImageIcon
} from "lucide-react";
import Tesseract from "tesseract.js";

interface DocScannerProps {
  onTextExtracted?: (text: string) => void;
  onImageProcessed?: (imageData: string) => void;
}

type ScanMode = 'document' | 'idcard' | 'book' | 'qrcode';
type FilterType = 'original' | 'grayscale' | 'highContrast' | 'blackWhite' | 'brighten' | 'darken' | 'sepia' | 'invert' | 'sharpen';

const DocScanner: React.FC<DocScannerProps> = ({ onTextExtracted, onImageProcessed }) => {
  // States
  const [activeStep, setActiveStep] = useState<'capture' | 'edit' | 'export'>('capture');
  const [scanMode, setScanMode] = useState<ScanMode>('document');
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

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Scan modes configuration
  const scanModes = [
    { id: 'document', label: 'Document', icon: FileText, description: 'A4, Letters' },
    { id: 'idcard', label: 'ID Card', icon: CreditCard, description: 'Cards, IDs' },
    { id: 'book', label: 'Book', icon: BookOpen, description: 'Books, Pages' },
    { id: 'qrcode', label: 'QR Code', icon: QrCode, description: 'QR & Barcodes' },
  ];

  // Filters configuration
  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'original', label: 'Original', icon: <ImageIcon className="h-4 w-4" /> },
    { id: 'grayscale', label: 'Grayscale', icon: <Moon className="h-4 w-4" /> },
    { id: 'highContrast', label: 'High Contrast', icon: <Contrast className="h-4 w-4" /> },
    { id: 'blackWhite', label: 'B&W', icon: <FileText className="h-4 w-4" /> },
    { id: 'brighten', label: 'Brighten', icon: <Sun className="h-4 w-4" /> },
    { id: 'darken', label: 'Darken', icon: <Moon className="h-4 w-4" /> },
    { id: 'sepia', label: 'Sepia', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'invert', label: 'Invert', icon: <RefreshCw className="h-4 w-4" /> },
    { id: 'sharpen', label: 'Sharpen', icon: <ZoomIn className="h-4 w-4" /> },
  ];

  // Start camera
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraReady(true);
        };
      }

      setIsUsingCamera(true);
    } catch (error) {
      console.error("Camera error:", error);
      alert("Could not access camera. Please check permissions or use file upload.");
    }
  };

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
    setCapturedImage(imageData);
    setProcessedImage(imageData);

    // Stop camera after capture
    stopCamera();
    setActiveStep('edit');
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      setProcessedImage(imageData);
      setActiveStep('edit');
    };
    reader.readAsDataURL(file);
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
          for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] > 128 ? 255 : data[i] * 1.5;
            data[i + 1] = data[i + 1] > 128 ? 255 : data[i + 1] * 1.5;
            data[i + 2] = data[i + 2] > 128 ? 255 : data[i + 2] * 1.5;
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

  // Run OCR
  const runOcr = async () => {
    if (!processedImage) return;

    setIsProcessingOcr(true);
    setOcrProgress(0);

    try {
      const result = await Tesseract.recognize(processedImage, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });

      setExtractedText(result.data.text);
      setShowOcrResult(true);
      onTextExtracted?.(result.data.text);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to extract text. Please try again.");
    } finally {
      setIsProcessingOcr(false);
      setOcrProgress(0);
    }
  };

  // Download image
  const downloadImage = (format: 'jpeg' | 'png' | 'pdf') => {
    if (!processedImage) return;

    if (format === 'pdf') {
      // For PDF, we'll create a simple PDF with the image
      // In production, use a library like jsPDF
      alert("PDF export - implementing with jsPDF library");
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
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {['capture', 'edit', 'export'].map((step, index) => (
          <React.Fragment key={step}>
            <button
              onClick={() => {
                if (step === 'capture') resetScanner();
                else if (capturedImage) setActiveStep(step as any);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeStep === step
                  ? 'bg-blue-500/30 text-white border border-blue-400/50'
                  : capturedImage || step === 'capture'
                  ? 'bg-white/5 text-blue-300 border border-blue-400/20 hover:bg-white/10'
                  : 'bg-white/5 text-blue-400/40 border border-blue-400/10 cursor-not-allowed'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activeStep === step ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-300'
              }`}>
                {index + 1}
              </span>
              <span className="font-medium capitalize">{step}</span>
            </button>
            {index < 2 && (
              <div className={`w-12 h-0.5 ${capturedImage ? 'bg-blue-400/50' : 'bg-blue-400/20'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Hidden Canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* CAPTURE STEP */}
      {activeStep === 'capture' && (
        <div className="space-y-6">
          {/* Scan Mode Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {scanModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setScanMode(mode.id as ScanMode)}
                className={`p-4 rounded-2xl border transition-all ${
                  scanMode === mode.id
                    ? 'bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 border-blue-400/20 hover:bg-white/10 hover:border-blue-400/30'
                }`}
              >
                <mode.icon className={`h-6 w-6 mx-auto mb-2 ${
                  scanMode === mode.id ? 'text-blue-400' : 'text-blue-400/60'
                }`} />
                <p className="font-medium text-white text-sm">{mode.label}</p>
                <p className="text-xs text-blue-300/60">{mode.description}</p>
              </button>
            ))}
          </div>

          {/* Camera / Upload Area */}
          <div className="border-2 border-dashed border-blue-400/30 rounded-3xl overflow-hidden bg-gradient-to-b from-blue-500/10 to-indigo-500/10 backdrop-blur-xl">
            {isUsingCamera ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-[400px] object-cover"
                />
                {/* Camera overlay guide */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-8 border-2 border-white/50 rounded-lg">
                    {/* Corner markers */}
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
                    <p className="text-white text-sm">Align document within frame</p>
                  </div>
                </div>

                {/* Camera controls */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                  <button
                    onClick={stopCamera}
                    className="p-3 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <button
                    onClick={capturePhoto}
                    disabled={!isCameraReady}
                    className="p-6 bg-white rounded-full hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                  >
                    <Camera className="h-8 w-8 text-blue-600" />
                  </button>
                  <button className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all">
                    <RefreshCw className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="p-6 bg-blue-500/20 rounded-full border border-blue-400/30">
                    <ScanLine className="h-16 w-16 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white mb-2">
                      Scan Your Document
                    </p>
                    <p className="text-blue-300/80">
                      Use camera to capture or upload an image
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={startCamera}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-500/30 flex items-center gap-3"
                    >
                      <Camera className="h-5 w-5" />
                      Open Camera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-4 bg-white/10 text-blue-300 rounded-2xl font-bold hover:bg-white/20 transition-all border border-blue-400/30 flex items-center gap-3"
                    >
                      <Upload className="h-5 w-5" />
                      Upload Image
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT STEP */}
      {activeStep === 'edit' && processedImage && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-blue-400/20 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-xl">
              <img
                src={processedImage}
                alt="Scanned document"
                className="w-full h-[500px] object-contain"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => rotateImage('ccw')}
                className="p-3 bg-white/10 text-blue-300 rounded-xl hover:bg-white/20 transition-all border border-blue-400/20"
                title="Rotate Left"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                onClick={() => rotateImage('cw')}
                className="p-3 bg-white/10 text-blue-300 rounded-xl hover:bg-white/20 transition-all border border-blue-400/20"
                title="Rotate Right"
              >
                <RotateCw className="h-5 w-5" />
              </button>
              <button
                onClick={() => setFlipH(!flipH)}
                className={`p-3 rounded-xl transition-all border ${
                  flipH ? 'bg-blue-500/30 text-white border-blue-400/50' : 'bg-white/10 text-blue-300 border-blue-400/20 hover:bg-white/20'
                }`}
                title="Flip Horizontal"
              >
                <FlipHorizontal className="h-5 w-5" />
              </button>
              <button
                onClick={() => setFlipV(!flipV)}
                className={`p-3 rounded-xl transition-all border ${
                  flipV ? 'bg-blue-500/30 text-white border-blue-400/50' : 'bg-white/10 text-blue-300 border-blue-400/20 hover:bg-white/20'
                }`}
                title="Flip Vertical"
              >
                <FlipVertical className="h-5 w-5" />
              </button>
              <div className="h-10 w-px bg-blue-400/20" />
              <button
                onClick={runOcr}
                disabled={isProcessingOcr}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessingOcr ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {ocrProgress}%
                  </>
                ) : (
                  <>
                    <Type className="h-5 w-5" />
                    Extract Text
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Edit Controls */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-blue-400/20">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                Filters
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => applyFilter(filter.id)}
                    className={`p-3 rounded-xl text-xs font-medium transition-all ${
                      currentFilter === filter.id
                        ? 'bg-blue-500/30 text-white border border-blue-400/50'
                        : 'bg-white/5 text-blue-300 border border-blue-400/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {filter.icon}
                      <span>{filter.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Adjustments */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-blue-400/20">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Sun className="h-5 w-5 text-blue-400" />
                Adjustments
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-300">Brightness</span>
                    <span className="text-white font-medium">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-300">Contrast</span>
                    <span className="text-white font-medium">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setActiveStep('export')}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                <Check className="h-5 w-5" />
                Done Editing
              </button>
              <button
                onClick={resetScanner}
                className="w-full py-3 bg-white/10 text-blue-300 rounded-xl font-medium hover:bg-white/20 transition-all border border-blue-400/20"
              >
                Retake Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT STEP */}
      {activeStep === 'export' && processedImage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Final Preview */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg">Final Document</h3>
            <div className="border border-blue-400/20 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-xl">
              <img
                src={processedImage}
                alt="Final document"
                className="w-full h-[400px] object-contain"
              />
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

            {/* Share Options */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-blue-400/20">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-400" />
                Share
              </h3>
              <button
                onClick={shareImage}
                className="w-full py-3 bg-white/5 text-blue-300 rounded-xl font-medium hover:bg-white/10 transition-all border border-blue-400/20 flex items-center justify-center gap-2"
              >
                <Share2 className="h-5 w-5" />
                Share Document
              </button>
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
                onClick={() => setActiveStep('edit')}
                className="flex-1 py-3 bg-white/10 text-blue-300 rounded-xl font-medium hover:bg-white/20 transition-all border border-blue-400/20"
              >
                Back to Edit
              </button>
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
