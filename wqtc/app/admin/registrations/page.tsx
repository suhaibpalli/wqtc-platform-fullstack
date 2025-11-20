'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  User,
  Globe,
  MessageCircle,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Registration {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  country: string;
  language: string;
  classType: string;
  timing: string;
  days: string;
  contactNumber: string;
  additionalNotes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  useEffect(() => {
    fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, languageFilter, registrations]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      // Use the central api client
      const data = await api.getRegistrations({});
      // Some backends return {result: [...]}, some just [...], so support both
      const result = data.result || data || [];
      setRegistrations(result);
      setFilteredRegistrations(result);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = [...registrations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (reg) =>
          reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((reg) => reg.status === statusFilter);
    }

    // Language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter((reg) => reg.language === languageFilter);
    }

    setFilteredRegistrations(filtered);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      // Use centralized api client for status update
      await api.updateRegistrationStatus(id, status);
      alert('Status updated successfully');
      fetchRegistrations();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'WhatsApp',
      'Country',
      'Language',
      'Class Type',
      'Timing',
      'Days',
      'Contact Number',
      'Status',
      'Additional Notes',
      'Registered On',
    ];

    const rows = filteredRegistrations.map((reg) => [
      reg.id,
      reg.name,
      reg.email,
      reg.phone,
      reg.whatsapp || reg.phone,
      reg.country,
      reg.language,
      reg.classType,
      reg.timing,
      reg.days,
      reg.contactNumber,
      reg.status,
      reg.additionalNotes || '',
      new Date(reg.createdAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `class-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700">Confirmed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
    }
  };

  const stats = {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === 'pending').length,
    confirmed: registrations.filter((r) => r.status === 'confirmed').length,
    cancelled: registrations.filter((r) => r.status === 'cancelled').length,
  };

  const languages = Array.from(new Set(registrations.map((r) => r.language)));

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-0 shadow-lg bg-white mb-6">
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-[#453142]">
                Class Registrations
              </CardTitle>
              <p className="text-[#453142]/70 mt-2">
                Manage and track all ladies class registrations
              </p>
            </div>
            <Button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#453142]/70">Total</p>
                <p className="text-3xl font-bold text-[#453142]">{stats.total}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#453142]/70">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#453142]/70">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#453142]/70">Cancelled</p>
                <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md mb-6">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-[#453142] mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#453142]/50" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-[#453142] mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-[#453142] mb-2">
                Language
              </label>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="w-full px-4 py-2 border border-[#453142]/20 rounded-md focus:ring-2 focus:ring-[#453142] focus:border-transparent"
              >
                <option value="all">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#453142] border-r-transparent mb-4"></div>
              <p className="text-[#453142]">Loading registrations...</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto text-[#453142]/30 mb-4" />
              <p className="text-[#453142]/70">No registrations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#453142] text-[#faf9f7]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Class Details</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Registered</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((reg, index) => (
                    <tr
                      key={reg.id}
                      className={`border-b hover:bg-[#453142]/5 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#faf9f7]'
                      }`}
                    >
                      {/* Student Info */}
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-[#453142]">{reg.name}</p>
                          <div className="flex items-center gap-1 text-xs text-[#453142]/70 mt-1">
                            <Globe className="h-3 w-3" />
                            {reg.country}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-[#453142]/70">
                            <Mail className="h-3 w-3" />
                            <a
                              href={`mailto:${reg.email}`}
                              className="hover:text-[#453142] hover:underline"
                            >
                              {reg.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-[#453142]/70">
                            <Phone className="h-3 w-3" />
                            <a
                              href={`tel:${reg.phone}`}
                              className="hover:text-[#453142] hover:underline"
                            >
                              {reg.phone}
                            </a>
                          </div>
                          {reg.whatsapp && (
                            <div className="flex items-center gap-2 text-green-600">
                              <MessageCircle className="h-3 w-3" />
                              <a
                                href={`https://wa.me/${reg.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                WhatsApp
                              </a>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Class Details */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <Badge className="bg-purple-100 text-purple-700">
                            {reg.language}
                          </Badge>
                          <p className="text-sm text-[#453142]/70">{reg.timing}</p>
                          <p className="text-xs text-[#453142]/50">{reg.days}</p>
                          <Badge
                            className={
                              reg.classType === 'ongoing'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-orange-100 text-orange-700'
                            }
                          >
                            {reg.classType}
                          </Badge>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">{getStatusBadge(reg.status)}</td>

                      {/* Date */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-[#453142]/70">
                          <Calendar className="h-4 w-4" />
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-center">
                          {reg.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateStatus(reg.id, 'confirmed')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateStatus(reg.id, 'cancelled')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {reg.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(reg.id, 'pending')}
                              className="border-yellow-600 text-yellow-600"
                            >
                              <Clock className="h-4 w-4" />
                            </Button>
                          )}
                          {reg.status === 'cancelled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(reg.id, 'pending')}
                              className="border-blue-600 text-blue-600"
                            >
                              Reopen
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Notes Accordion (if needed) */}
      {filteredRegistrations.some((r) => r.additionalNotes) && (
        <Card className="border-0 shadow-md mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#453142]">
              Registrations with Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRegistrations
                .filter((r) => r.additionalNotes)
                .map((reg) => (
                  <div key={reg.id} className="border-l-4 border-purple-500 pl-4 py-2">
                    <p className="font-semibold text-[#453142]">{reg.name}</p>
                    <p className="text-sm text-[#453142]/70 italic mt-1">
                      "{reg.additionalNotes}"
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
