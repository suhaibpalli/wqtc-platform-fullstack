'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Search, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Video, Surah } from '@/types/video';
import { api } from '@/lib/api'; // Import the new client

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Surahs & Videos on mount
  useEffect(() => {
    fetchSurahs();
    fetchVideos();
    // eslint-disable-next-line
  }, []);

  const fetchSurahs = async () => {
    try {
      const data = await api.getSurahs(); // New API call
      setSurahs(data.result || []);
    } catch (error) {
      console.error('Error fetching surahs:', error);
    }
  };

  // --- NEW fetchVideos LOGIC (Sorted Alphabetically) ---
  const fetchVideos = async (filters: any = {}) => {
    setLoading(true);
    try {
      // Fetch data (ignoring backend sort since we will sort in frontend)
      const payload = {
        surah: filters.surah,
        versus: filters.versus,
        search: filters.search,
        sort: 'DESC'
      };
      const data = await api.getVideos(payload); // New API call

      let allVideos: Video[] = Array.isArray(data) ? data : (data.result || []);

      // 1. Frontend Sort: Alphabetical by Title
      allVideos.sort((a, b) => a.title.localeCompare(b.title));

      // 2. Filter by Search
      if (searchTerm) {
        allVideos = allVideos.filter((video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // The filters for surah and verse are also handled server-side (payload),
      // but if you want to guarantee client-side filtering, uncomment below:
      // if (selectedSurah)
      //   allVideos = allVideos.filter((v) => v.surah_no === selectedSurah);
      // if (selectedVerse)
      //   allVideos = allVideos.filter(
      //     (v) =>
      //       v.starting_ayah <= selectedVerse &&
      //       (v.ending_ayah ? v.ending_ayah >= selectedVerse : v.starting_ayah >= selectedVerse)
      //   );

      setTotalPages(Math.max(1, Math.ceil(allVideos.length / videosPerPage)));

      // 3. Paginate
      const startIndex = (currentPage - 1) * videosPerPage;
      const endIndex = startIndex + videosPerPage;
      const paginatedVideos = allVideos.slice(startIndex, endIndex);

      setVideos(paginatedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchVideos({
      surah: selectedSurah,
      versus: selectedVerse,
      search: searchTerm
    });
  };

  const handleReset = () => {
    setSelectedSurah(null);
    setSelectedVerse(null);
    setSearchTerm('');
    setCurrentPage(1);
    fetchVideos();
  };

  // Whenever currentPage/search/filter changes, refresh displayed videos
  useEffect(() => {
    fetchVideos({
      surah: selectedSurah,
      versus: selectedVerse,
      search: searchTerm
    });
    // eslint-disable-next-line
  }, [currentPage]);

  // Get verses for selected Surah
  const getVersesForSurah = () => {
    if (!selectedSurah) return [];
    const surah = surahs.find(s => s.id === selectedSurah);
    if (!surah) return [];
    return Array.from({ length: surah.verses }, (_, i) => i + 1);
  };

  const verses = getVersesForSurah();

  // Extract YouTube ID (ignoring any t= param or fragment in the link!)
  const getYouTubeId = (url: string) => {
    // Remove any query params after watch?v=xxxx or youtu.be/xxxx, only extract the ID itself
    // and avoid getting t= or &t=
    let cleanUrl = url;
    // If url like .../watch?v=XXXX&t=1053s, just take XXXX
    const match = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?/]+)/);
    return match ? match[1] : '';
  };

  // Instead of adding &start=..., construct the embed link by extracting t= param from DB url if present
  const getEmbedUrlWithTimestamp = (youTubeLink: string) => {
    const videoId = getYouTubeId(youTubeLink);

    // Try to extract t=SECONDS or t=XXmYYs/XXs from the youTubeLink param/query string
    let startTime = 0;
    try {
      // Parse the link as a URL, try to get "t"
      let urlObj: URL | null = null;
      try {
        urlObj = new URL(youTubeLink);
      } catch (err) {
        // fallback for legacy links
        const parser = document.createElement('a');
        parser.href = youTubeLink;
        urlObj = {
          search: parser.search,
          hash: parser.hash,
        } as any;
      }
      // Check for either search params or hash
      let tValue: string | null = null;
      if (urlObj?.search) {
        const params = new URLSearchParams(urlObj.search);
        tValue = params.get('t');
      }
      if (!tValue && urlObj?.hash) {
        // sometimes t= appears in the fragment
        const hashParams = new URLSearchParams(urlObj.hash.substring(1));
        tValue = hashParams.get('t');
      }
      if (tValue) {
        // t=230s or t=2m34s or t=230 (seconds)
        // Preferably use seconds
        const match = tValue.match(/(?:(\d+)m)?(\d+)?s?/);
        if (match) {
          const min = match[1] ? parseInt(match[1], 10) : 0;
          const sec = match[2] ? parseInt(match[2], 10) : 0;
          startTime = min * 60 + sec;
        } else if (!isNaN(Number(tValue))) {
          startTime = Number(tValue);
        }
      }
    } catch (e) {
      // ignore
      startTime = 0;
    }

    let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    if (startTime > 0) {
      embedUrl += `&start=${startTime}`;
    }
    return embedUrl;
  };

  // Try extract YouTube channel ID from url if available in the Video type
  const getYouTubeChannelId = (video: Video) => {
    if ('youTube_channel_id' in video && video.youTube_channel_id) {
      return video.youTube_channel_id;
    }
    return process.env.NEXT_PUBLIC_YT_CHANNEL_ID || '';
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
          <Badge className="mb-4 bg-[#453142] text-[#faf9f7]">Video Library</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#453142] mb-4">
            Quran Video Library
          </h1>
          <p className="text-[#453142]/80 text-lg">
            Browse our collection of Quran translation videos organized by Surah and Verse
          </p>
        </motion.div>

        {/* Filter Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2 text-[#453142]">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#453142]/50" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search videos..."
                    className="w-full pl-10 pr-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Surah Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#453142]">
                  Select Surah
                </label>
                <select
                  value={selectedSurah || ''}
                  onChange={(e) => {
                    setSelectedSurah(e.target.value ? Number(e.target.value) : null);
                    setSelectedVerse(null);
                  }}
                  className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                >
                  <option value="">All Surahs</option>
                  {surahs.map((surah) => (
                    <option key={surah.id} value={surah.id}>
                      {surah.id}. {surah.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verse Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#453142]">
                  Select Verse
                </label>
                <select
                  value={selectedVerse || ''}
                  onChange={(e) => setSelectedVerse(e.target.value ? Number(e.target.value) : null)}
                  disabled={!selectedSurah}
                  className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">All Verses</option>
                  {verses.map((verse) => (
                    <option key={verse} value={verse}>
                      Verse {verse}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 items-end">
                <Button
                  onClick={handleSearch}
                  className="flex-1 bg-[#453142] hover:bg-[#5a3f54] text-[#faf9f7]"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-[#453142] text-[#453142] hover:bg-[#453142]/10"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#453142] border-r-transparent"></div>
            <p className="mt-4 text-[#453142]">Loading videos...</p>
          </div>
        )}

        {/* Video Grid */}
        {!loading && (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white flex flex-col h-full min-h-[380px]"
                    onClick={() => setSelectedVideo(video)}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-[#453142]/10">
                      <Image
                        src={`https://img.youtube.com/vi/${getYouTubeId(video.youTube_link)}/mqdefault.jpg`}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                        <div className="w-16 h-16 bg-[#453142] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-[#faf9f7] ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <CardContent className="flex flex-col flex-1 justify-between p-4">
                      <div>
                        <h3 className="font-semibold text-[#453142] line-clamp-2 mb-2 min-h-[3em]">
                          {video.title}
                        </h3>
                        <p className="text-sm text-[#453142]/70 min-h-[1.6em]">
                          {video.surah_name || `Surah ${video.surah_no}`} - Verse {video.starting_ayah}
                          {video.ending_ayah && ` to ${video.ending_ayah}`}
                        </p>
                      </div>
                      <p className="text-xs text-[#453142]/50 mt-2">
                        {new Date(video.created_date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {/* No Results */}
            {videos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#453142]/70 text-lg">
                  No videos found. Try adjusting your filters.
                </p>
              </div>
            )}

            {/* Smart Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="border-[#453142] text-[#453142]"
                >
                  Previous
                </Button>

                {/* Smart Page Numbers Generation */}
                {(() => {
                  const pages: (number | string)[] = [];
                  const showEdges = 1;
                  const siblings = 1;

                  for (let i = 1; i <= totalPages; i++) {
                    if (
                      i <= showEdges ||
                      i > totalPages - showEdges ||
                      (i >= currentPage - siblings && i <= currentPage + siblings)
                    ) {
                      pages.push(i);
                    } else if (
                      (i === currentPage - siblings - 1 && i > showEdges) ||
                      (i === currentPage + siblings + 1 && i < totalPages - showEdges)
                    ) {
                      pages.push('...');
                    }
                  }
                  // Deduplicate '...' 
                  const uniquePages = pages.filter((v, idx, arr) => v !== arr[idx - 1] || typeof v === 'number');

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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-start p-4 border-b border-[#453142]/20">
                  <div>
                    <h2 className="text-xl font-bold text-[#453142]">{selectedVideo.title}</h2>
                    <p className="text-sm text-[#453142]/70 mt-1">
                      {selectedVideo.surah_name || `Surah ${selectedVideo.surah_no}`} -
                      Verse {selectedVideo.starting_ayah}
                      {selectedVideo.ending_ayah && ` to ${selectedVideo.ending_ayah}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-[#453142] hover:bg-[#453142]/10 rounded-full p-2 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* YouTube Player */}
                <div className="aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={
                      `${getEmbedUrlWithTimestamp(selectedVideo.youTube_link)}` +
                      `${getYouTubeChannelId(selectedVideo) ? `&origin=${typeof window !== 'undefined' ? window.location.origin : ''}&enablejsapi=1` : ''}` +
                      `${getYouTubeChannelId(selectedVideo) ? `&listType=user_uploads&list=${getYouTubeChannelId(selectedVideo)}` : ''}`
                    }
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                  {/* 
                    Explanation:
                    - '&rel=0' ensures that, after the video ends, only related videos from the same channel will show (YouTube's official documented behavior).
                    - '&modestbranding=1' hides YouTube logo a bit.
                  */}
                </div>

                {/* Video Details */}
                <div className="p-4 border-t border-[#453142]/20">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-[#453142]">Uploaded:</span>{' '}
                      <span className="text-[#453142]/70">
                        {new Date(selectedVideo.created_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#453142]">By:</span>{' '}
                      <span className="text-[#453142]/70">{selectedVideo.created_by}</span>
                    </div>
                  </div>
                  {selectedVideo.time_start_ayah && (
                    <div className="mt-2 text-sm">
                      <span className="font-semibold text-[#453142]">Start Time:</span>{' '}
                      <span className="text-[#453142]/70">{selectedVideo.time_start_ayah}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
