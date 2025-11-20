'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Plus, Search } from 'lucide-react';
import type { Video } from '@/types/video';
import { api } from '@/lib/api';

export default function AdminVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await api.getVideos({ sort: 'DESC' });
      setVideos(data.result || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await api.deleteVideo(id);
      alert('Video deleted successfully');
      fetchVideos();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting video');
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (video.surah_name && video.surah_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-[#453142]">
              Manage Videos
            </CardTitle>
            <Button
              onClick={() => router.push('/admin/videos/new')}
              className="bg-[#453142] hover:bg-[#5a3f54] text-[#faf9f7]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Video
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#453142]/50" />
            <input
              type="text"
              placeholder="Search videos by title or surah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
            />
          </div>

          {/* Videos Table */}
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#453142] text-[#faf9f7]">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Surah</th>
                    <th className="px-4 py-3 text-left">Verses</th>
                    <th className="px-4 py-3 text-left">YouTube Link</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVideos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-[#453142]/70">
                        No videos found. Click "Add New Video" to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredVideos.map((video) => (
                      <tr key={video.id} className="border-b hover:bg-[#453142]/5">
                        <td className="px-4 py-3">{video.title}</td>
                        <td className="px-4 py-3">{video.surah_name || `Surah ${video.surah_no}`}</td>
                        <td className="px-4 py-3">
                          {video.starting_ayah}
                          {video.ending_ayah && ` - ${video.ending_ayah}`}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={video.youTube_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          {new Date(video.created_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              onClick={() => router.push(`/admin/videos/edit/${video.id}`)}
                              variant="outline"
                              size="sm"
                              className="border-[#453142] text-[#453142] hover:bg-[#453142]/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(video.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
