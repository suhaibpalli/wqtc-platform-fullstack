// lib/api.ts

// We use the relative path '/api' because next.config.ts rewrites it to FastAPI
const API_BASE = '/api'; 

interface ApiOptions extends RequestInit {
  token?: string;
}

async function fetchAPI(endpoint: string, options: ApiOptions = {}) {
  const headers = {
    // Do not set Content-Type for FormData (file uploads)
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  } as HeadersInit;

  const config: RequestInit = {
    ...options,
    headers,
    // 'include' ensures cookies (HttpOnly token) are sent to the backend
    credentials: 'include', 
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || data.detail || 'API Request Failed');
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: any) => 
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => 
    fetchAPI('/auth/logout', { method: 'POST' }),
  me: () => 
    fetchAPI('/auth/me'),

  // Library / Videos
  // FastAPI expects { surah, versus, search, sort, limit } in body for POST /library
  getVideos: (filters: any) =>
    fetchAPI('/library', { method: 'POST', body: JSON.stringify(filters) }),
  
  // Admin Video Operations
  createVideo: (data: any) =>
    fetchAPI('/library/create', { method: 'POST', body: JSON.stringify(data) }),
  updateVideo: (id: number, data: any) =>
    fetchAPI(`/library/${id}`, { method: 'PUT', body: JSON.stringify(data) }), // Note: Check if your FastAPI has PUT logic
  deleteVideo: (id: number) =>
    fetchAPI(`/library/${id}`, { method: 'DELETE' }),

  // --- Add these under Admin Video Operations ---

  // Uploads file for preview
  previewBulkVideo: (formData: FormData) =>
    fetchAPI('/library/bulk-preview', { method: 'POST', body: formData }),

  // Commits the valid data
  createBulkVideos: (videos: any[]) =>
    fetchAPI('/library/bulk-create', { method: 'POST', body: JSON.stringify(videos) }),

  // Surah management
  getSurahs: () =>
    fetchAPI('/surah'),
  createSurah: (data: any) =>
    fetchAPI('/surah', { method: 'POST', body: JSON.stringify(data) }),
  deleteSurah: (id: number) =>
    fetchAPI(`/surah/${id}`, { method: 'DELETE' }),

  // Ebooks
  getEbooks: (params: any = {}) => {
    // FastAPI uses GET /ebooks/?sort=DESC&limit=10
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/ebooks?${queryString}`, { method: 'GET' });
  },
  createEbook: (data: any) => 
    fetchAPI('/ebooks', { method: 'POST', body: JSON.stringify(data) }),
  updateEbook: (id: number, data: any) => 
    fetchAPI(`/ebooks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEbook: (id: number) => 
    fetchAPI(`/ebooks/${id}`, { method: 'DELETE' }),
  
  // File Uploads (Admin)
  uploadPdf: (formData: FormData) =>
    fetchAPI('/ebooks/upload-pdf', { method: 'POST', body: formData }),
  uploadCover: (formData: FormData) =>
    fetchAPI('/ebooks/upload-cover', { method: 'POST', body: formData }),

  // Class Registrations
  createRegistration: (data: any) =>
    fetchAPI('/class-registration', { method: 'POST', body: JSON.stringify(data) }),
  getRegistrations: (params: any) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/class-registration?${queryString}`);
  },
  updateRegistrationStatus: (id: number, status: string) =>
    fetchAPI(`/class-registration/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
};
