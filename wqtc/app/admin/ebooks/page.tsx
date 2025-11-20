'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Plus, Search } from 'lucide-react';
import type { EBook } from '@/types/ebook';
import { api } from '@/lib/api';

export default function AdminEBooksPage() {
  const router = useRouter();
  const [ebooks, setEbooks] = useState<EBook[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEBooks();
  }, []);

  const fetchEBooks = async () => {
    setLoading(true);
    try {
      // FastAPI uses GET query params, our api.getEbooks handles this conversion
      const data = await api.getEbooks({ sort: 'DESC' });
      // FastAPI returns list directly in some endpoints, or wrapped in 'result'. 
      // Check your FastAPI response schema. Based on your export:
      // get_ebooks returns List[EBookResponse] directly.
      setEbooks(data || []); 
    } catch (error) {
      console.error('Error fetching ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this ebook?')) return;
    
    try {
      await api.deleteEbook(id);
      alert('EBook deleted successfully');
      fetchEBooks();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete ebook');
    }
  };

  const filteredEBooks = ebooks.filter((ebook) =>
    ebook.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-[#453142]">
              Manage EBooks
            </CardTitle>
            <Button
              onClick={() => router.push('/admin/ebooks/new')}
              className="bg-[#453142] hover:bg-[#5a3f54] text-[#faf9f7]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New EBook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#453142]/50" />
            <input
              type="text"
              placeholder="Search ebooks by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
            />
          </div>

          {/* EBooks Table */}
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#453142] text-[#faf9f7]">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Filename</th>
                    <th className="px-4 py-3 text-left">Pages</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEBooks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-[#453142]/70">
                        No ebooks found. Click "Add New EBook" to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredEBooks.map((ebook) => (
                      <tr key={ebook.id} className="border-b hover:bg-[#453142]/5">
                        <td className="px-4 py-3">{ebook.title}</td>
                        <td className="px-4 py-3">{ebook.filename}</td>
                        <td className="px-4 py-3">{ebook.pages || 'N/A'}</td>
                        <td className="px-4 py-3">
                          {new Date(ebook.createddate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              onClick={() => router.push(`/admin/ebooks/edit/${ebook.id}`)}
                              variant="outline"
                              size="sm"
                              className="border-[#453142] text-[#453142] hover:bg-[#453142]/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(ebook.id)}
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
