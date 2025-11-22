'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, X, Download, FileText } from 'lucide-react'; // add FileText
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { api } from '@/lib/api'; // Import the shared client

// Dynamic import with SSR disabled to avoid DOMMatrix error
const PDFFlipbook = dynamic(() => import('@/components/flipbook/PDFFlipbook'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#453142] border-r-transparent mb-4"></div>
        <p className="text-[#453142]">Loading PDF viewer...</p>
      </div>
    </div>
  ),
});

// Dynamic import for scroll view
const PDFScrollView = dynamic(() => import('@/components/flipbook/PDFScrollView'), {
  ssr: false,
  loading: () => <div className="p-12 text-center">Loading Scroll View...</div>
});

interface EBook {
  id: number;
  title: string;
  filename: string;
  coverImage?: string;
  description?: string;
  pages?: number;
}

export default function EBooksPage() {
  const [ebooks, setEbooks] = useState<EBook[]>([]);
  const [selectedEbook, setSelectedEbook] = useState<EBook | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredBookId, setHoveredBookId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const ebooksPerPage = 12;

  useEffect(() => {
    fetchEBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  // --- NEW fetchEBooks LOGIC (Sorted Alphabetically) ---
  const fetchEBooks = async () => {
    setLoading(true);
    try {
      // Fetch data (ignoring backend sort since we will sort in frontend)
      const data = await api.getEbooks({ sort: 'DESC' });

      // Coerce to array either from "data" (FastAPI) or "data.result"
      let allBooks: EBook[] = Array.isArray(data) ? data : (data.result || []);

      // 1. Frontend Sort: Alphabetical by Title
      allBooks.sort((a, b) => a.title.localeCompare(b.title));

      // 2. Filter by Search
      if (searchTerm) {
        allBooks = allBooks.filter((book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setTotal(allBooks.length);
      setTotalPages(Math.max(1, Math.ceil(allBooks.length / ebooksPerPage)));

      // 3. Paginate
      const startIndex = (currentPage - 1) * ebooksPerPage;
      const endIndex = startIndex + ebooksPerPage;
      const paginatedBooks = allBooks.slice(startIndex, endIndex);

      setEbooks(paginatedBooks);

    } catch (error) {
      console.error('Error fetching ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Download handler for PDF files using /pdfs (with new rewrite rule)
  const handleDownload = (filename: string) => {
    // Ensure we get the clean filename (no directory)
    const cleanFilename = filename.split('/').pop();
    const fileUrl = `/pdfs/${cleanFilename}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = cleanFilename || 'ebook.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-[#453142] text-[#faf9f7]">eBook Library</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#453142] mb-4">
            Quran eBook Library
          </h1>
          <p className="text-[#453142]/80 text-lg">
            Browse and read our collection of Quran translations
          </p>
          {total > 0 && (
            <p className="text-[#453142]/60 text-sm mt-2">
              {total} ebook{total !== 1 ? 's' : ''} available
            </p>
          )}
        </motion.div>

        {/* Search */}
        <Card className="mb-8 border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#453142]/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search ebooks..."
                className="w-full pl-10 pr-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#453142] border-r-transparent mb-4"></div>
            <p className="text-[#453142]">Loading ebooks...</p>
          </div>
        ) : (
          <>
            {/* eBooks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ebooks.map((book, index) => (

                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white overflow-visible rounded-lg">
                    {/* Enhanced 3D Book Cover with Opening Animation */}
                    <div
                      className="relative aspect-[3/4] bg-white flex items-center justify-center cursor-pointer rounded-t-lg overflow-hidden"
                      style={{ perspective: '1500px' }}
                      onClick={() => setSelectedEbook(book)}
                      onMouseEnter={() => setHoveredBookId(book.id)}
                      onMouseLeave={() => setHoveredBookId(null)}
                    >
                      {book.coverImage ? (
                        <div className="relative w-full h-full">
                          {/* Book Cover with 3D Transform - Opens OUTWARD */}
                          <div
                            className="absolute inset-0 transition-all duration-700 ease-out"
                            style={{
                              transformStyle: 'preserve-3d',
                              transform:
                                hoveredBookId === book.id
                                  ? 'rotateY(25deg) translateX(-5%)'
                                  : 'rotateY(0deg)',
                              transformOrigin: 'left center',
                            }}
                          >
                            {/* Front Cover - Fully opaque */}
                            <div
                              className="relative w-full h-full bg-white"
                              style={{
                                backfaceVisibility: 'hidden',
                              }}
                            >
                              <Image
                                src={book.coverImage}
                                alt={book.title}
                                fill
                                className="object-cover rounded-md"
                                style={{
                                  backfaceVisibility: 'hidden',
                                }}
                              />
                            </div>

                            {/* Book Spine (visible when opened) */}
                            {hoveredBookId === book.id && (
                              <div
                                className="absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-[#2d1c26] to-[#3a2533]"
                                style={{
                                  transform: 'rotateY(-90deg) translateZ(1px)',
                                  transformOrigin: 'left center',
                                  boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.5)',
                                }}
                              />
                            )}

                            {/* Inner Pages Effect - Behind the cover */}
                            {hoveredBookId === book.id && (
                              <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                  transform: 'translateZ(-8px)',
                                }}
                              >
                                {/* Page Stack 1 - Closest to cover */}
                                <div
                                  className="absolute inset-0 bg-gradient-to-r from-[#fefefe] via-[#f8f6f9] to-white border-l-2 border-[#453142]/10"
                                  style={{
                                    boxShadow: 'inset 3px 0 8px rgba(69,49,66,0.12)',
                                  }}
                                />
                              </div>
                            )}

                            {/* Additional page layers */}
                            {hoveredBookId === book.id && (
                              <>
                                <div
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                    transform: 'translateZ(-16px)',
                                  }}
                                >
                                  <div
                                    className="absolute inset-0 bg-gradient-to-r from-white to-[#faf9f7] border-l border-[#453142]/8"
                                    style={{
                                      boxShadow: 'inset 2px 0 6px rgba(69,49,66,0.08)',
                                    }}
                                  />
                                </div>
                                <div
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                    transform: 'translateZ(-24px)',
                                  }}
                                >
                                  <div className="absolute inset-0 bg-white border-l border-[#453142]/5" />
                                </div>
                              </>
                            )}
                          </div>

                          {/* Overlay with icon - Reduced opacity so cover shows through */}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none z-10">
                            <div className="w-16 h-16 bg-[#faf9f7] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                              <BookOpen className="w-8 h-8 text-[#453142]" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Fallback for books without cover image
                        <div className="relative w-full h-full bg-gradient-to-br from-[#453142] to-[#6e4d66]">
                          <div
                            className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out"
                            style={{
                              transformStyle: 'preserve-3d',
                              transform:
                                hoveredBookId === book.id
                                  ? 'rotateY(25deg) translateX(-5%)'
                                  : 'rotateY(0deg)',
                              transformOrigin: 'left center',
                            }}
                          >
                            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#453142] to-[#6e4d66]">
                              <BookOpen className="w-24 h-24 text-[#faf9f7]/50 z-10" />
                            </div>

                            {/* Spine for icon version */}
                            {hoveredBookId === book.id && (
                              <div
                                className="absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-[#2d1c26] to-[#3a2533]"
                                style={{
                                  transform: 'rotateY(-90deg) translateZ(1px)',
                                  transformOrigin: 'left center',
                                  boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.5)',
                                }}
                              />
                            )}

                            {/* Inner pages for icon version */}
                            {hoveredBookId === book.id && (
                              <>
                                <div
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                    transform: 'translateZ(-8px)',
                                  }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-white to-[#f6f2f8] border-l-2 border-[#453142]/10" />
                                </div>
                                <div
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                    transform: 'translateZ(-16px)',
                                  }}
                                >
                                  <div className="absolute inset-0 bg-white border-l border-[#453142]/5" />
                                </div>
                              </>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none z-10">
                            <div className="w-16 h-16 bg-[#faf9f7] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                              <BookOpen className="w-8 h-8 text-[#453142]" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#453142] line-clamp-2 mb-2">
                        {book.title}
                      </h3>
                      {book.description && (
                        <p className="text-sm text-[#453142]/70 line-clamp-2">{book.description}</p>
                      )}
                      {book.pages && (
                        <p className="text-xs text-[#453142]/50 mt-2">{book.pages} pages</p>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 bg-[#453142] text-white hover:bg-[#2d1c26]"
                          onClick={() => setSelectedEbook(book)}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Read
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-[#453142]/30 text-[#453142] hover:bg-[#453142]/5"
                          onClick={() => handleDownload(book.filename)}
                          type="button"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {ebooks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#453142]/70 text-lg">
                  No ebooks found. {searchTerm ? 'Try adjusting your search.' : ''}
                </p>
              </div>
            )}

            {/* Smart Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="border-[#453142] text-[#453142]"
                >
                  Previous
                </Button>

                {/* Smart Page Numbers Generation */}
                {(() => {
                  const pages = [];
                  // Always show these limits
                  const showEdges = 1;
                  // Show this many neighbors around current page
                  const siblings = 1; 
                  
                  // Logic to create ranges like: 1 ... 4 5 6 ... 20
                  for (let i = 1; i <= totalPages; i++) {
                     if (
                       i <= showEdges || // First page(s)
                       i > totalPages - showEdges || // Last page(s)
                       (i >= currentPage - siblings && i <= currentPage + siblings) // Neighbors
                     ) {
                       pages.push(i);
                     } else if (
                       (i === currentPage - siblings - 1 && i > showEdges) || 
                       (i === currentPage + siblings + 1 && i < totalPages - showEdges)
                     ) {
                       // Add separator only at the boundaries
                       pages.push('...');
                     }
                  }
                  
                  // Deduplicate '...' if logic pushed multiple
                  const uniquePages = pages.filter((v, i, a) => v !== a[i-1] || typeof v === 'number');

                  return uniquePages.map((page, idx) => {
                    if (page === '...') {
                      return (
                        <span key={`dots-${idx}`} className="px-2 py-2 text-[#453142]/50">
                          ...
                        </span>
                      );
                    }
                    return (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(Number(page))}
                        className={
                          currentPage === page
                            ? 'bg-[#453142] text-[#faf9f7]'
                            : 'bg-white text-[#453142] border border-[#453142]/20'
                        }
                      >
                        {page}
                      </Button>
                    );
                  });
                })()}

                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="border-[#453142] text-[#453142]"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Flipbook Modal */}
        <AnimatePresence>
          {selectedEbook && (
            <FlipbookModal ebook={selectedEbook} onClose={() => setSelectedEbook(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Flipbook Modal Component
function FlipbookModal({
  ebook,
  onClose,
}: {
  ebook: EBook;
  onClose: () => void;
}) {
  const [viewMode, setViewMode] = useState<'flip'|'scroll'>('flip');

  // Download handler for modal, rewritten for consistent PDF path
  const handleDownload = () => {
    const cleanFilename = ebook.filename.split('/').pop();
    const fileUrl = `/pdfs/${cleanFilename}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = cleanFilename || 'ebook.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[#faf9f7] rounded-xl w-full max-w-[90vw] md:max-w-7xl h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center p-3 md:p-4 border-b border-[#453142]/10 bg-white gap-4 md:gap-0">
          {/* Left: Title & Cover */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {ebook.coverImage && (
              <div className="relative h-12 w-8 md:h-16 md:w-12 flex-shrink-0">
                <img
                  src={ebook.coverImage}
                  alt={ebook.title}
                  className="object-cover rounded shadow-sm h-full w-full"
                />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[#453142] truncate pr-4">{ebook.title}</h2>
              <p className="text-xs text-[#453142]/60 hidden md:block">
                {ebook.pages ? `${ebook.pages} Pages • ` : ''} Arabic Edition
              </p>
            </div>
          </div>
          {/* Center: View Toggles */}
          <div className="flex bg-[#453142]/5 p-1 rounded-lg border border-[#453142]/10">
            <button
              onClick={() => setViewMode('flip')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'flip'
                  ? 'bg-white text-[#453142] shadow-sm'
                  : 'text-[#453142]/60 hover:text-[#453142]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Book View</span>
            </button>
            <button
              onClick={() => setViewMode('scroll')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'scroll'
                  ? 'bg-white text-[#453142] shadow-sm'
                  : 'text-[#453142]/60 hover:text-[#453142]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Scroll View</span>
            </button>
          </div>
          {/* Right: Actions */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-[#453142]/70 hover:bg-[#453142]/5 hidden sm:flex"
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </Button>
            <div className="h-6 w-px bg-[#453142]/20 mx-1 hidden sm:block" />
            <button
              onClick={onClose}
              className="text-[#453142] hover:bg-red-50 hover:text-red-500 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        {/* Viewer Content */}
        <div className="flex-1 relative bg-[#f3f3f3] overflow-hidden">
          {viewMode === 'flip' ? (
            // UPDATE: Pass coverImage prop here
            <PDFFlipbook filename={ebook.filename} coverImage={ebook.coverImage} />
          ) : (
            <PDFScrollView filename={ebook.filename} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
