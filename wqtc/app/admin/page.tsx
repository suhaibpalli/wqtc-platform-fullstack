"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Video, BookOpen, ScrollText } from 'lucide-react'; // Add ScrollText icon

type AdminMenuItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  count?: number;
};

// Dummy fetchRegistrationsCount. Replace with real API call in production.
async function fetchRegistrationsCount(): Promise<number> {
  // Example: const res = await fetch('/api/admin/registrations/count');
  // return (await res.json()).count;
  return 24; // placeholder
}

export default function AdminIndex() {
  const [registrationsCount, setRegistrationsCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchRegistrationsCount().then(setRegistrationsCount);
  }, []);

  const adminMenuItems: AdminMenuItem[] = [
    {
      title: 'Class Registrations',
      description: 'View and manage ladies class registrations',
      href: '/admin/registrations',
      icon: Users,
      count: registrationsCount,
    },
    {
      title: 'Videos',
      description: 'Manage uploaded videos',
      href: '/admin/videos',
      icon: Video,
    },
    {
      title: 'Ebooks',
      description: 'Manage available eBooks',
      href: '/admin/ebooks',
      icon: BookOpen,
    },
    {
      title: 'Surahs',
      description: 'Manage Quran Surah list',
      href: '/admin/surahs',
      icon: ScrollText,
    },
  ];

  return (
    <main
      className="p-8 min-h-screen"
      style={{ backgroundColor: '#faf9f7', color: '#453142' }}
    >
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminMenuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            style={{
              backgroundColor: '#453142',
              color: '#faf9f7',
              textDecoration: 'none',
            }}
            className="block rounded-xl p-6 shadow-md transition hover:scale-105"
          >
            <div className="flex items-center">
              <item.icon className="w-8 h-8 mr-4" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  {typeof item.count === 'number' && (
                    <span
                      style={{
                        backgroundColor: '#faf9f7',
                        color: '#453142',
                        fontWeight: 700,
                        borderRadius: 9999,
                        padding: "0.2rem 0.6rem",
                        fontSize: "0.8rem",
                        marginLeft: "0.5rem",
                        display: "inline-flex",
                        alignItems: "center"
                      }}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
                <p className="text-sm opacity-80" style={{ color: '#faf9f7', opacity: 0.85 }}>
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
