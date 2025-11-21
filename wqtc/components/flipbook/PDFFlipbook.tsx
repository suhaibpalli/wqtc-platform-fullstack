'use client';

import { useEffect, useRef, useState, forwardRef, useLayoutEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFFlipbookProps {
  filename: string;
}

interface PageProps {
  pageNumber: number;
  canvas: HTMLCanvasElement;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ pageNumber, canvas }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && canvas) {
      containerRef.current.innerHTML = '';
      // Make sure canvas fits container
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.objectFit = 'contain';
      containerRef.current.appendChild(canvas);
    }
  }, [canvas]);

  return (
    <div ref={ref} className="page bg-white shadow-sm h-full w-full overflow-hidden">
      <div className="page-content h-full w-full flex flex-col">
        <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden" />
        <div className="page-footer absolute bottom-1 left-0 right-0 text-center text-[10px] text-[#453142]/30">
          {pageNumber}
        </div>
      </div>
    </div>
  );
});

Page.displayName = 'Page';

export default function PDFFlipbook({ filename }: PDFFlipbookProps) {
  const flipbookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pdfjs, setPdfjs] = useState<any>(null);

  // Dimensions state
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });

  // 1. Load PDF.js
  useEffect(() => {
    const loadPDFJS = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        setPdfjs(pdfjsLib);
      } catch (error) {
        console.error('Error loading PDF.js:', error);
      }
    };
    loadPDFJS();
  }, []);

  // 2. Calculate Dimensions Responsively
  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        // Maintain a typical book aspect ratio (e.g., 0.7) or fit container
        // For a 2-page spread, width needs to be divided by 2 effectively in calculations
        // But react-pageflip takes the width of a SINGLE page

        const isMobile = window.innerWidth < 768;

        // Calculate single page dimensions
        let pageHeight = clientHeight * 0.95; // 5% padding
        let pageWidth = pageHeight * 0.70; // Aspect ratio 1:1.4

        // If width is too wide for screen
        if (pageWidth * (isMobile ? 1 : 2) > clientWidth) {
          pageWidth = (clientWidth * (isMobile ? 0.9 : 0.45));
          pageHeight = pageWidth / 0.70;
        }

        setDimensions({ width: Math.floor(pageWidth), height: Math.floor(pageHeight) });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 3. Render PDF when dims or pdfjs are ready
  useEffect(() => {
    if (pdfjs && dimensions.width > 0) {
      loadPDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filename, pdfjs, dimensions]);

  const loadPDF = async () => {
    if (!pdfjs) return;
    try {
      // Only set loading if we don't have pages yet
      if (pages.length === 0) setLoading(true);

      const pdfUrl = `/pdfs/${filename}`;
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setTotalPages(pdf.numPages);

      const pagePromises: Promise<HTMLCanvasElement>[] = [];

      // We render based on the calculated dimensions to avoid blurriness
      for (let i = 1; i <= pdf.numPages; i++) {
        pagePromises.push(renderPage(pdf, i, dimensions.width, dimensions.height));
      }

      const renderedPages = await Promise.all(pagePromises);
      setPages(renderedPages);
      setLoading(false);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setLoading(false);
    }
  };

  const renderPage = async (
    pdf: any,
    pageNumber: number,
    targetWidth: number,
    targetHeight: number
  ): Promise<HTMLCanvasElement> => {
    const page = await pdf.getPage(pageNumber);

    // Calculate scale required to fit the target dimensions
    // We use a higher scale for quality, then CSS scales it down
    const unscaledViewport = page.getViewport({ scale: 1 });
    const scaleX = targetWidth / unscaledViewport.width;
    const scaleY = targetHeight / unscaledViewport.height;

    // Use the smaller scale to fit entirely
    const scale = Math.min(scaleX, scaleY) * 2; // * 2 for retina/high DPI sharpness

    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) throw new Error('Could not get canvas context');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    return canvas;
  };

  // Navigation: reversed for RTL
  const nextPage = () => flipbookRef.current?.pageFlip().flipPrev();
  const prevPage = () => flipbookRef.current?.pageFlip().flipNext();

  // Note: In RTL mode:
  // flipNext() goes to the "left" (physically next page in English, previous in Arabic)
  // flipPrev() goes to the "right" (physically prev page in English, next in Arabic)
  // We map the buttons logically for the user.

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  if (!pdfjs || loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-[#453142]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#453142] mr-3"></div>
        Loading Book...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center bg-[#f3f3f3] overflow-hidden"
    >
      {/* Flipbook Instance */}
      <div className="relative z-0 flex items-center justify-center py-4">
        <HTMLFlipBook
          ref={flipbookRef}
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          minWidth={200}
          maxWidth={1000}
          minHeight={300}
          maxHeight={1400}
          maxShadowOpacity={0.2}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          className="shadow-2xl"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={800}
          usePortrait={typeof window !== 'undefined' ? window.innerWidth < 768 : false}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {pages.map((canvas, index) => (
            <Page key={index} pageNumber={index + 1} canvas={canvas} />
          ))}
        </HTMLFlipBook>
      </div>

      {/* Custom Controls Floating Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-xl border border-[#453142]/10 flex items-center gap-4">
        {/* Right Arrow (Previous in RTL context means go Right) */}
        <Button
          onClick={() => flipbookRef.current?.pageFlip().flipNext()}
          disabled={currentPage >= totalPages - 1}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-[#453142]/10"
        >
          <ChevronRight className="h-6 w-6 text-[#453142]" />
        </Button>

        <span className="text-sm font-medium text-[#453142] tabular-nums">
          {currentPage + 1} / {totalPages}
        </span>

        {/* Left Arrow (Next in RTL context means go Left) */}
        <Button
          onClick={() => flipbookRef.current?.pageFlip().flipPrev()}
          disabled={currentPage === 0}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-[#453142]/10"
        >
          <ChevronLeft className="h-6 w-6 text-[#453142]" />
        </Button>
      </div>
    </div>
  );
}
