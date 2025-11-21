'use client';

import { JSX, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PDFScrollViewProps {
  filename: string;
}

export default function PDFScrollView({ filename }: PDFScrollViewProps) {
  const [pdfjs, setPdfjs] = useState<any>(null);
  const [pages, setPages] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(true);

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
      renderPDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filename, pdfjs]);

  const renderPDF = async () => {
    if (!pdfjs) return;
    setLoading(true);

    try {
      const pdfUrl = `/pdfs/${filename}`;
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      const renderedPages: JSX.Element[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        renderedPages.push(
          <PDFPage key={i} pdf={pdf} pageNumber={i} />
        );
      }

      setPages(renderedPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-[#453142]">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="ml-2">Loading Standard View...</span>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-gray-100 p-4 flex flex-col items-center gap-4">
      {pages}
    </div>
  );
}

// Sub-component for rendering a PDF page into a canvas
function PDFPage({ pdf, pageNumber }: { pdf: any; pageNumber: number }) {
  const [isRendered, setIsRendered] = useState(false);

  const canvasRef = (node: HTMLCanvasElement | null) => {
    if (node && !isRendered) {
      renderPageOnCanvas(node);
    }
  };

  const renderPageOnCanvas = async (canvas: HTMLCanvasElement) => {
    try {
      setIsRendered(true);
      const page = await pdf.getPage(pageNumber);
      const viewportUnscaled = page.getViewport({ scale: 1 });

      const desiredWidth = Math.min(window.innerWidth - 40, 800);
      const scale = desiredWidth / viewportUnscaled.width;
      const viewport = page.getViewport({ scale });

      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="shadow-lg bg-white">
      <canvas ref={canvasRef} className="max-w-full h-auto block" />
      <div className="text-center text-xs text-gray-400 py-1">Page {pageNumber}</div>
    </div>
  );
}
