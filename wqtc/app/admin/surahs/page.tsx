'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminSurahsPage() {
  const router = useRouter();
  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurahs();
    // eslint-disable-next-line
  }, []);

  const fetchSurahs = async () => {
    try {
      const data = await api.getSurahs();
      setSurahs(data.result || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this Surah? This might break linked videos.')) return;
    try {
      await api.deleteSurah(id);
      fetchSurahs();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-[#453142]">Manage Surahs</CardTitle>
            <Button onClick={() => router.push('/admin/surahs/new')} className="bg-[#453142] text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Surah
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#453142] text-white">
                <tr>
                  <th className="p-3">No.</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Arabic</th>
                  <th className="p-3">Verses</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : surahs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-center">
                      No Surahs Found.
                    </td>
                  </tr>
                ) : (
                  surahs.map((surah) => (
                    <tr key={surah.id} className="border-b">
                      <td className="p-3 font-bold">{surah.id}</td>
                      <td className="p-3">{surah.name}</td>
                      <td className="p-3 font-amiri">{surah.arabic_name}</td>
                      <td className="p-3">{surah.total_verses}</td>
                      <td className="p-3">
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(surah.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
