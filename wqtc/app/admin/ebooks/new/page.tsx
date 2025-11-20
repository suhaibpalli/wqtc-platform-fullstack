'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, FileText, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';

export default function NewEBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    filename: '',
    coverImage: '',
    description: '',
    pages: '',
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB');
        return;
      }
      setPdfFile(file);
      if (!formData.title) {
        setFormData({ ...formData, title: file.name.replace(/\.pdf$/i, '') });
      }
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

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPDF = async () => {
    if (!pdfFile) {
      alert('Please select a PDF file first');
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', pdfFile);

      // Use new API method
      const data = await api.uploadPdf(uploadFormData);

      if (data.filename) {
        setFormData({ ...formData, filename: data.filename });
        alert('PDF uploaded successfully!');
      } else {
        alert('Upload failed: Invalid response');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading PDF');
    } finally {
      setUploading(false);
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

  // FIX: Sanitize data to match Backend Schema (Pydantic)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.filename) {
      alert('Please upload a PDF file first');
      return;
    }

    setSubmitting(true);

    try {
      // ---------------------------------------------------------
      // FIX: Sanitize data to match Backend Schema (Pydantic)
      // ---------------------------------------------------------
      const payload = {
        title: formData.title,
        filename: formData.filename,
        description: formData.description,
        // 1. Map camelCase (Frontend) -> snake_case (Backend)
        cover_image: formData.coverImage,
        // 2. Convert 'pages' string to Integer. If empty string, send null.
        pages: formData.pages ? parseInt(formData.pages.toString()) : null,
      };

      // Send the sanitized payload instead of raw formData
      await api.createEbook(payload);

      alert('EBook added successfully!');
      router.push('/admin/ebooks');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error adding ebook');
    } finally {
      setSubmitting(false);
    }
  };

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
            Add New EBook
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid md:grid-cols-2 gap-6">
              {/* PDF Upload */}
              <div className="border-2 border-dashed border-[#453142]/30 rounded-lg p-6 bg-[#453142]/5">
                <label className="block font-medium mb-3 text-[#453142] text-lg">
                  Upload PDF File *
                </label>

                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#453142] file:text-white file:cursor-pointer hover:file:bg-[#5a3f54]"
                  />
                  {pdfFile && (
                    <div className="flex items-center gap-2 text-sm text-[#453142]">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{pdfFile.name}</span>
                      <span className="text-[#453142]/70">
                        ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={handleUploadPDF}
                    disabled={!pdfFile || uploading}
                    className="w-full bg-[#453142] hover:bg-[#5a3f54] text-white"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF
                      </>
                    )}
                  </Button>

                  {formData.filename && (
                    <div className="text-sm text-green-600 font-medium">
                      ✓ PDF uploaded: {formData.filename}
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="border-2 border-dashed border-[#453142]/30 rounded-lg p-6 bg-[#453142]/5">
                <label className="block font-medium mb-3 text-[#453142] text-lg">
                  Upload Cover Image (Optional)
                </label>

                <div className="space-y-3">
                  {coverPreview && (
                    <div className="relative w-full h-48 mb-3">
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
                        Upload Cover
                      </>
                    )}
                  </Button>
                  {formData.coverImage && (
                    <div className="text-sm text-green-600 font-medium">
                      ✓ Cover uploaded: {formData.coverImage}
                    </div>
                  )}
                </div>
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
                Number of Pages (optional)
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

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={submitting || !formData.filename}
                className="flex-1 bg-[#453142] hover:bg-[#5a3f54] text-[#faf9f7]"
              >
                {submitting ? 'Saving...' : 'Save EBook'}
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
