'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, FileSpreadsheet, AlertTriangle, CheckCircle, Download, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function BulkUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [previewData, setPreviewData] = useState<{ valid: any[], invalid: any[] }>({ valid: [], invalid: [] });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  // 1. Send file to backend to parse and validate
  const handlePreview = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.previewBulkVideo(formData);
      setPreviewData(res.result);
      setStep('preview');
    } catch (error: any) {
      alert(error.message || "Failed to parse file");
    } finally {
      setLoading(false);
    }
  };

  // 2. Send valid rows back to backend to save
  const handleImport = async () => {
    if (previewData.valid.length === 0) return;
    setLoading(true);
    try {
      await api.createBulkVideos(previewData.valid);
      alert(`Successfully imported ${previewData.valid.length} videos!`);
      router.push('/admin/videos');
    } catch (error: any) {
      console.error(error);
      alert("Import failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Helper to download a CSV template
  const downloadTemplate = () => {
    const headers = "title,surah_no,starting_ayah,ending_ayah,youtube_link,keywords";
    const example = "Surah Fatiha 1-7,1,1,7,https://www.youtube.com/watch?v=EXAMPLE,tafsir,makki";
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + example;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wqtc_video_template.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button onClick={() => router.back()} variant="outline" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-[#453142]">Bulk Upload Videos</CardTitle>
        </CardHeader>
        <CardContent>
          
          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div className="space-y-6 py-8 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-[#453142]/10 rounded-full flex items-center justify-center">
                  <FileSpreadsheet className="h-10 w-10 text-[#453142]" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload CSV or Excel File</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Ensure your file has the following columns: <br/>
                  <code className="bg-gray-100 px-1">title</code>, <code className="bg-gray-100 px-1">surah_no</code>, 
                  <code className="bg-gray-100 px-1">starting_ayah</code>, <code className="bg-gray-100 px-1">ending_ayah</code>, 
                  <code className="bg-gray-100 px-1">youtube_link</code>
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={downloadTemplate} className="border-dashed">
                  <Download className="mr-2 h-4 w-4" /> Download Template
                </Button>
                
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".csv,.xlsx,.xls" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button className="bg-[#453142] text-white">
                    <Upload className="mr-2 h-4 w-4" /> Select File
                  </Button>
                </div>
              </div>

              {file && (
                <div className="bg-blue-50 p-4 rounded-md inline-block">
                  <p className="text-blue-800 font-medium mb-2">Selected: {file.name}</p>
                  <Button onClick={handlePreview} disabled={loading} className="w-full">
                    {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : "Analyze File"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PREVIEW */}
          {step === 'preview' && (
            <div className="space-y-6">
              <div className="flex gap-4 text-sm">
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  {previewData.valid.length} valid rows ready to import
                </div>
                {previewData.invalid.length > 0 && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {previewData.invalid.length} rows with errors (will be skipped)
                  </div>
                )}
              </div>

              {/* Valid Data Table */}
              {previewData.valid.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-semibold text-sm border-b">Preview Valid Data</div>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white sticky top-0 shadow-sm">
                        <tr>
                          <th className="p-3">Title</th>
                          <th className="p-3">Surah</th>
                          <th className="p-3">Ayahs</th>
                          <th className="p-3">Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.valid.map((row, i) => (
                          <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="p-3 font-medium">{row.title}</td>
                            <td className="p-3">{row.surah_name} ({row.surah_no})</td>
                            <td className="p-3">{row.starting_ayah} - {row.ending_ayah || '?'}</td>
                            <td className="p-3 text-blue-600 truncate max-w-[150px]">{row.video_url}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Error Data Table */}
              {previewData.invalid.length > 0 && (
                <div className="border border-red-200 rounded-md overflow-hidden">
                  <div className="bg-red-50 px-4 py-2 font-semibold text-sm text-red-800 border-b border-red-200">Issues Found</div>
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white">
                        <tr>
                          <th className="p-3">Row #</th>
                          <th className="p-3">Issues</th>
                          <th className="p-3">Raw Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.invalid.map((err, i) => (
                          <tr key={i} className="border-b last:border-0 hover:bg-red-50/50">
                            <td className="p-3 font-bold">{err.row}</td>
                            <td className="p-3 text-red-600">
                              <ul className="list-disc pl-4">
                                {err.issues.map((issue: string, k: number) => <li key={k}>{issue}</li>)}
                              </ul>
                            </td>
                            <td className="p-3 text-gray-500 text-xs font-mono">
                              {JSON.stringify(err.data)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button variant="ghost" onClick={() => { setStep('upload'); setFile(null); }}>
                  Cancel & Upload Different File
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={loading || previewData.valid.length === 0}
                  className="bg-[#453142] text-white"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  Import {previewData.valid.length} Videos
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
