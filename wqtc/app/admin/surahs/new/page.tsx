'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function NewSurahPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '', // Surah Number
    name: '',
    arabic_name: '',
    english_name: '',
    total_verses: '',
    revelation_place: 'Makkah'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createSurah({
        ...formData,
        id: parseInt(formData.id),
        total_verses: parseInt(formData.total_verses)
      });
      alert('Surah added!');
      router.push('/admin/surahs');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#453142]">Add New Surah</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Surah Number (ID) *</label>
              <input 
                type="number" required 
                className="w-full border p-2 rounded"
                placeholder="e.g. 1 for Al-Fatiha"
                value={formData.id}
                onChange={e => setFormData({...formData, id: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Surah Name (English) *</label>
              <input 
                type="text" required 
                className="w-full border p-2 rounded"
                placeholder="e.g. Al-Fatiha"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Arabic Name</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded text-right font-amiri"
                placeholder="e.g. الفاتحة"
                value={formData.arabic_name}
                onChange={e => setFormData({...formData, arabic_name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-semibold">Total Verses</label>
                    <input 
                        type="number" 
                        className="w-full border p-2 rounded"
                        value={formData.total_verses}
                        onChange={e => setFormData({...formData, total_verses: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Revelation</label>
                    <select 
                        className="w-full border p-2 rounded"
                        value={formData.revelation_place}
                        onChange={e => setFormData({...formData, revelation_place: e.target.value})}
                    >
                        <option value="Makkah">Makkah</option>
                        <option value="Madinah">Madinah</option>
                    </select>
                </div>
            </div>
            <Button type="submit" disabled={submitting} className="w-full bg-[#453142] text-white">
              {submitting ? 'Saving...' : 'Save Surah'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
