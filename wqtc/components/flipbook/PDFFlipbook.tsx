'use client';

import { useEffect, useRef, useState, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFFlipbookProps {
  filename: string;
}

interface PageProps {
  pageNumber: number;
  canvas: HTMLCanvasElement;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ pageNumber, canvas }, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current && canvas) {
      canvasRef.current.innerHTML = '';
      canvasRef.current.appendChild(canvas);
    }
  }, [canvas]);

  return (
    <div ref={ref} className="page bg-white shadow-lg">
      <div className="page-content h-full flex flex-col">
        <div ref={canvasRef} className="w-full h-full flex items-center justify-center" />
        <div className="page-footer text-center text-sm text-[#453142]/50 py-2">
          Page {pageNumber}
        </div>
      </div>
    </div>
  );
});

Page.displayName = 'Page';

export default function PDFFlipbook({ filename }: PDFFlipbookProps) {
  const flipbookRef = useRef<any>(null);
  const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(5); // doubled from 2.5 to 5
  const [pdfjs, setPdfjs] = useState<any>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(0);

  // Responsive detection for viewport width
  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const isMobile = viewportWidth < 768;

  // Dynamically import pdfjs-dist on client
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

  useEffect(() => {
    if (pdfjs) {
      loadPDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filename, pdfjs, scale]);

  const loadPDF = async () => {
    if (!pdfjs) return;
    try {
      setLoading(true);
      const pdfUrl = `/pdfs/${filename}`;
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setTotalPages(pdf.numPages);

      const pagePromises: Promise<HTMLCanvasElement>[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        pagePromises.push(renderPage(pdf, i, scale));
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
    scale: number
  ): Promise<HTMLCanvasElement> => {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    return canvas;
  };

  const nextPage = () => {
    if (flipbookRef.current) {
      flipbookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (flipbookRef.current) {
      flipbookRef.current.pageFlip().flipPrev();
    }
  };

  const onFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 8)); // increased max from 5 to 8
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 3)); // increased min from 1 to 3
  };

  if (!pdfjs || loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#453142] border-r-transparent mb-4"></div>
          <p className="text-[#453142]">
            {!pdfjs ? 'Loading PDF viewer...' : 'Loading PDF...'}
          </p>
        </div>
      </div>
    );
  }

  // Responsive dimensions
  const bookWidth = isMobile ? Math.min(450, viewportWidth * 0.95) : 1100; // doubled 550 -> 1100
  const bookHeight = isMobile ? Math.min(700, window.innerHeight * 0.75) : 1466; // doubled 733 -> 1466

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#453142]/5 py-8">
      {/* Controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 md:gap-4 bg-white/95 rounded-full px-3 md:px-4 py-2 shadow-lg">
        <Button
          onClick={prevPage}
          disabled={currentPage === 0}
          variant="ghost"
          size="sm"
          className="rounded-full h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </Button>

        <span className="text-xs md:text-sm font-medium text-[#453142] min-w-[60px] md:min-w-[80px] text-center">
          {currentPage + 1} / {totalPages}
        </span>

        <Button
          onClick={nextPage}
          disabled={currentPage >= totalPages - 1}
          variant="ghost"
          size="sm"
          className="rounded-full h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </Button>

        <div className="h-6 w-px bg-[#453142]/20" />

        <Button
          onClick={zoomOut}
          variant="ghost"
          size="sm"
          className="rounded-full h-8 w-8 p-0"
        >
          <ZoomOut className="h-4 w-4 md:h-5 md:w-5" />
        </Button>

        <Button
          onClick={zoomIn}
          variant="ghost"
          size="sm"
          className="rounded-full h-8 w-8 p-0"
        >
          <ZoomIn className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>

      {/* Flipbook */}
      <div className="flipbook-container overflow-auto">
        <HTMLFlipBook
          ref={flipbookRef}
          width={bookWidth}
          height={bookHeight}
          size="stretch"
          minWidth={600}        // doubled from 300
          maxWidth={2400}       // doubled from 1200
          minHeight={800}       // doubled from 400
          maxHeight={3200}      // doubled from 1600
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          className="shadow-2xl"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={800}
          usePortrait={isMobile}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* Each page is a direct child - NOT grouped into spreads */}
          {pages.map((canvas, index) => (
            <Page key={index} pageNumber={index + 1} canvas={canvas} />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
}
