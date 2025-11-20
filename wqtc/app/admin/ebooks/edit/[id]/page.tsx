'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';

export default function EditEBookPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  // Unwrap params Promise using React.use()
  const { id } = use(params);

  const [formData, setFormData] = useState({
    title: '',
    filename: '',
    coverImage: '',
    description: '',
    pages: '',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEBook = async () => {
    try {
      const data = await api.getEbooks({});
      const ebook = (data || []).find((e: any) => e.id === parseInt(id));

      if (ebook) {
        setFormData({
          title: ebook.title,
          filename: ebook.filename,
          coverImage: ebook.coverImage || '',
          description: ebook.description || '',
          pages: ebook.pages ? ebook.pages.toString() : '',
        });
        if (ebook.coverImage) {
          setCoverPreview(ebook.coverImage);
        }
      }
    } catch (error) {
      console.error('Error fetching ebook:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setCoverFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadCover = async () => {
    if (!coverFile) {
      alert('Please select a cover image first');
      return;
    }

    setUploadingCover(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', coverFile);

      // Use new API method
      const data = await api.uploadCover(uploadFormData);

      if (data.filename) {
        setFormData({ ...formData, coverImage: data.filename });
        alert('Cover image uploaded successfully!');
      } else {
        alert('Upload failed: Invalid response');
      }
    } catch (error) {
      console.error('Cover upload error:', error);
      alert('Error uploading cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  // FIX: Sanitize data for update to match backend schema (snake_case) and correct types.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        cover_image: formData.coverImage,
        pages: formData.pages ? parseInt(formData.pages.toString()) : null
        // Do not send filename in UPDATE
      };

      await api.updateEbook(parseInt(id), payload);
      alert('EBook updated successfully!');
      router.push('/admin/ebooks');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error updating ebook');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#453142] border-r-transparent"></div>
        <p className="mt-4 text-[#453142]">Loading ebook...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            Edit EBook
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image Update */}
            <div className="border-2 border-dashed border-[#453142]/30 rounded-lg p-6 bg-[#453142]/5">
              <label className="block font-medium mb-3 text-[#453142] text-lg">
                Update Cover Image (Optional)
              </label>

              <div className="space-y-3">
                {coverPreview && (
                  <div className="relative w-full h-64 mb-3">
                    <Image
                      src={coverPreview}
                      alt="Cover preview"
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#453142] file:text-white file:cursor-pointer hover:file:bg-[#5a3f54]"
                />

                <Button
                  type="button"
                  onClick={handleUploadCover}
                  disabled={!coverFile || uploadingCover}
                  className="w-full bg-[#453142] hover:bg-[#5a3f54] text-white"
                >
                  {uploadingCover ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload New Cover
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-medium mb-2 text-[#453142]">
                EBook Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                placeholder="Enter ebook title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-2 text-[#453142]">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                placeholder="Enter ebook description"
                rows={3}
              />
            </div>

            {/* Pages */}
            <div>
              <label className="block font-medium mb-2 text-[#453142]">
                Number of Pages
              </label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                min="1"
                className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                placeholder="30"
              />
            </div>

            {/* PDF Info (read-only) */}
            <div>
              <label className="block font-medium mb-2 text-[#453142]">
                PDF File (cannot be changed)
              </label>
              <input
                type="text"
                value={formData.filename}
                disabled
                className="w-full px-4 py-2 border border-[#453142]/20 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#453142] hover:bg-[#5a3f54] text-[#faf9f7]"
              >
                {submitting ? 'Saving...' : 'Update EBook'}
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
