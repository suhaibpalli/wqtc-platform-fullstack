'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { Surah } from '@/types/video';
import { api } from '@/lib/api';

export default function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params Promise using React.use()
  const { id } = use(params);
  
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    surahno: '',
    surahname: '',
    startingayah: '',
    endingayah: '',
    timestartayah: '',
    youTubelink: '',
    keywords: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurahs();
    fetchVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSurahs = async () => {
    try {
      const data = await api.getSurahs();
      setSurahs(data.result || []);
    } catch (error) {
      console.error('Error fetching surahs:', error);
    }
  };

  const fetchVideo = async () => {
    try {
      const data = await api.getVideos({ sort: 'DESC' });
      const video = data.result?.find((v: any) => v.id === parseInt(id));
      
      if (video) {
        // Safely handle all fields with fallbacks
        setFormData({
          title: video.title || '',
          surahno: video.surahno ? video.surahno.toString() : '',
          surahname: video.surahname || '',
          startingayah: video.startingayah ? video.startingayah.toString() : '',
          endingayah: video.endingayah ? video.endingayah.toString() : '',
          timestartayah: video.timestartayah || '',
          youTubelink: video.youTubelink || '',
          keywords: video.keywords || '',
        });
      } else {
        console.error('Video not found with id:', id);
        alert('Video not found');
        router.push('/admin/videos');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      alert('Error loading video data');
    } finally {
      setLoading(false);
    }
  };

  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const surahId = e.target.value;
    const selectedSurah = surahs.find((s) => s.id === Number(surahId));
    setFormData({
      ...formData,
      surahno: surahId,
      surahname: selectedSurah?.name || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // FIX: Create a clean payload with correct backend keys
      const payload = {
        title: formData.title,
        surah_no: parseInt(formData.surahno),
        surah_name: formData.surahname,
        starting_ayah: parseInt(formData.startingayah),
        ending_ayah: formData.endingayah ? parseInt(formData.endingayah) : null,
        keywords: formData.keywords,
        video_url: formData.youTubelink,
        // Note: We do NOT send timestartayah
      };

      await api.updateVideo(parseInt(id), payload);
      alert('Video updated successfully!');
      router.push('/admin/videos');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error updating video');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#453142] border-r-transparent"></div>
        <p className="mt-4 text-[#453142]">Loading video...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="mb-4 border-[#453142] text-[#453142]"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-[#453142]">
            Edit Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block font-medium mb-2 text-[#453142]">
                Video Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                placeholder="Enter video title"
              />
            </div>

            {/* Surah */}
            <div>
              <label className="block font-medium mb-2 text-[#453142]">
                Select Surah
              </label>
              <select
                value={formData.surahno}
                onChange={handleSurahChange}
                required
                className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
              >
                <option value="">-- Select Surah --</option>
                {surahs.map((surah) => (
                  <option key={surah.id} value={surah.id}>
                    {surah.id}. {surah.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ayah Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2 text-[#453142]">
                  Starting Ayah
                </label>
                <input
                  type="number"
                  value={formData.startingayah}
                  onChange={(e) => setFormData({ ...formData, startingayah: e.target.value })}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block font-medium mb-2 text-[#453142]">
                  Ending Ayah (Optional)
                </label>
                <input
                  type="number"
                  value={formData.endingayah}
                  onChange={(e) => setFormData({ ...formData, endingayah: e.target.value })}
                  min="1"
                  className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                />
              </div>
            </div>

            {/* Time Start */}
            <div>
              <label className="block font-medium mb-2 text-[#453142]">
                Time Start (Optional, e.g., 1:23)
              </label>
              <input
                type="text"
                value={formData.timestartayah}
                onChange={(e) => setFormData({ ...formData, timestartayah: e.target.value })}
                className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                placeholder="1:23"
              />
            </div>

            {/* YouTube Link */}
            <div>
              <label className="block font-medium mb-2 text-[#453142]">
                YouTube Link
              </label>
              <input
                type="url"
                value={formData.youTubelink}
                onChange={(e) => setFormData({ ...formData, youTubelink: e.target.value })}
                required
                className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block font-medium mb-2 text-[#453142]">
                Keywords (Optional, comma separated)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                placeholder="quran, translation, tafsir"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#453142] hover:bg-[#5a3f54] text-[#faf9f7]"
              >
                {submitting ? 'Saving...' : 'Update Video'}
              </Button>
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="flex-1 border-[#453142] text-[#453142]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
