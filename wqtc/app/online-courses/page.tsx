'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Users,
  Phone,
  CheckCircle2,
  Loader2,
  X
} from 'lucide-react';

// ADD: Use the shared API client
import { api } from '@/lib/api';

// -- Define class structures (same as before)
type ClassSchedule = {
  id: string;
  language: string;
  days: string[];
  timeFrom: string;
  timeTo: string;
  contactNumber: string;
  type: string;
  color: string; // deprecated, ignore in new UI
  timezone: string;
};

type ClassRegistration = {
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  additionalNotes?: string;
  language?: string;
  classType?: string;
  timing?: string;
  days?: string;
  contactNumber?: string;
};

const palette = [
  "#453142", // Deep eggplant
  "#afa0ba", // Pastel for headers/cards bg, not gradient
  "#faf9f7", // Light warm bg
  "#73606b", // Muted text, border
  "#e5e0e8", // cards alt bg
  "#d5c8d8", // soft alt
  "#9b7c96", // accent
  "#7e5e77", // accent dark
];

// Color helpers
function getCardBgByType(type: string) {
  if (type === "Ladies") return "bg-[#e5e0e8]";
  if (type === "Gents") return "bg-[#faf9f7]";
  if (type === "Family") return "bg-[#d5c8d8]";
  return "bg-[#faf9f7]";
}
function getBadgeColor(type: string) {
  if (type === "Ladies") return "bg-[#453142] text-white";
  if (type === "Gents") return "bg-[#7e5e77] text-white";
  if (type === "Family") return "bg-[#afa0ba] text-[#453142]";
  return "bg-[#afa0ba] text-[#453142]";
}
function getCalendarCellColor(type: string) {
  if (type === "Ladies") return "bg-[#453142]/90 text-white";
  if (type === "Gents") return "bg-[#afa0ba] text-[#453142]";
  if (type === "Family") return "bg-[#73606b] text-white";
  return "bg-[#7e5e77] text-white";
}
function getBorderColor(type: string) {
  if (type === "Ladies") return "border-[#453142]";
  if (type === "Gents") return "border-[#afa0ba]";
  if (type === "Family") return "border-[#73606b]";
  return "border-[#ada2b4]";
}

// Classes -- (use as-is)
const classes: ClassSchedule[] = [
  // -- LADIES ONGOING CLASSES (Mon-Thu, or special days)
  {
    id: 'ladies-tamil-1',
    language: 'Tamil',
    days: ['Mon', 'Tue', 'Wed', 'Thu'],
    timeFrom: '06:00',
    timeTo: '07:00',
    contactNumber: '+91 99412 76649',
    type: 'Ladies',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'ladies-tamil-2',
    language: 'Tamil',
    days: ['Mon', 'Tue', 'Wed', 'Thu'],
    timeFrom: '11:30',
    timeTo: '12:30',
    contactNumber: '+91 99412 76649',
    type: 'Ladies',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'ladies-tamil-3',
    language: 'Tamil',
    days: ['Mon', 'Tue', 'Wed', 'Thu'],
    timeFrom: '15:00',
    timeTo: '16:00',
    contactNumber: '+91 99412 76649',
    type: 'Ladies',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'ladies-tamil-4',
    language: 'Tamil',
    days: ['Mon', 'Tue', 'Wed', 'Thu'],
    timeFrom: '19:00',
    timeTo: '20:00',
    contactNumber: '+91 99412 76649',
    type: 'Ladies',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'ladies-eng-urdu-1',
    language: 'English & Urdu',
    days: ['Mon', 'Tue', 'Wed', 'Thu'],
    timeFrom: '06:00',
    timeTo: '07:00',
    contactNumber: '+91 98842 22484',
    type: 'Ladies',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'ladies-eng-urdu-2',
    language: 'English & Urdu',
    days: ['Mon', 'Tue', 'Wed', 'Thu'],
    timeFrom: '11:30',
    timeTo: '12:20',
    contactNumber: '+91 98842 22484',
    type: 'Ladies',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'ladies-eng-us',
    language: 'English (US)',
    days: ['Tue', 'Wed', 'Thu', 'Fri'],
    timeFrom: '07:45',
    timeTo: '08:30',
    contactNumber: '+91 98401 32100',
    type: 'Ladies',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'ladies-eng-aus',
    language: 'English (Australia)',
    days: ['Sat', 'Sun'],
    timeFrom: '06:30',
    timeTo: '07:30',
    contactNumber: '+91 94444 33969',
    type: 'Ladies',
    color: '',
    timezone: 'IST',
  },
  // -- LADIES UPCOMING CLASSES (Mon-Thu)
  {
    id: 'ladies-upcoming-urdu-eng',
    language: 'Urdu and English',
    days: ['Mon', 'Tue', 'Wed', 'Thu'],
    timeFrom: '15:00',
    timeTo: '15:50',
    contactNumber: '+91 98414 09389',
    type: 'Ladies',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'ladies-upcoming-eng',
    language: 'English',
    days: ['Mon', 'Tue', 'Wed', 'Thu'],
    timeFrom: '19:00',
    timeTo: '19:50',
    contactNumber: '+91 98400 59455',
    type: 'Ladies',
    color: '',
    timezone: 'IST',
  },
  // -- FAMILY CLASSES
  {
    id: 'family-01',
    language: 'English & Urdu',
    days: ['Mon', 'Tue', 'Wed', 'Thu'],
    timeFrom: '21:15',
    timeTo: '22:00',
    contactNumber: '+91 94449 18125',
    type: 'Family',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'family-02',
    language: 'English & Urdu (USA)',
    days: ['Mon', 'Tue', 'Wed', 'Thu'],
    timeFrom: '08:15',
    timeTo: '09:00',
    contactNumber: '+1 847 749 6940',
    type: 'Family',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'family-03',
    language: 'English & Urdu (AUS)',
    days: ['Mon', 'Tue', 'Wed'],
    timeFrom: '15:15',
    timeTo: '16:15',
    contactNumber: '+61 406 842 137',
    type: 'Family',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'family-04',
    language: 'English & Urdu (UK)',
    days: ['Thu'],
    timeFrom: '23:15',
    timeTo: '00:05',
    contactNumber: '+44 777 669 6288',
    type: 'Family',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'family-05',
    language: 'English & Urdu',
    days: ['Sat', 'Sun'],
    timeFrom: '16:00',
    timeTo: '17:00',
    contactNumber: '+91 94449 18125',
    type: 'Family',
    color: '',
    timezone: 'IST',
  },
  // -- GENTS CLASSES
  {
    id: 'gents-05',
    language: 'English & Urdu',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeFrom: '06:40',
    timeTo: '07:30',
    contactNumber: '+91 97910 13510',
    type: 'Gents',
    color: '',
    timezone: 'IST',
  },
  // "Class 6" is three classes/contacts at same time, so separate entries
  {
    id: 'gents-06-1',
    language: 'English & Urdu',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeFrom: '06:30',
    timeTo: '07:15',
    contactNumber: '+91 98843 04539',
    type: 'Gents',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'gents-06-2',
    language: 'English & Urdu',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeFrom: '06:30',
    timeTo: '07:15',
    contactNumber: '+91 98400 61112',
    type: 'Gents',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'gents-06-3',
    language: 'English & Urdu',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeFrom: '06:30',
    timeTo: '07:15',
    contactNumber: '+91 98410 63322',
    type: 'Gents',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'gents-07',
    language: 'English & Tamil',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeFrom: '06:40',
    timeTo: '07:30',
    contactNumber: '+91 98403 58907',
    type: 'Gents',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'gents-08',
    language: 'Only Tamil',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeFrom: '21:00',
    timeTo: '21:45',
    contactNumber: 'New class will start inshaAllah immediately after Ramzan 2024',
    type: 'Gents',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'gents-09',
    language: 'Only Tamil',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeFrom: '06:30',
    timeTo: '07:30',
    contactNumber: '+91 86101 66228',
    type: 'Gents',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'gents-10',
    language: 'Only Tamil',
    days: ['Sat', 'Sun'],
    timeFrom: '08:00',
    timeTo: '09:00',
    contactNumber: '',
    type: 'Gents',
    color: '',
    timezone: 'IST',
  },
  {
    id: 'gents-11',
    language: 'Only Urdu',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeFrom: '06:30',
    timeTo: '07:30',
    contactNumber: '+91 98410 85443',
    type: 'Gents',
    color: '',
    timezone: 'IST',
  }
];

// Show legend about Fajr note for Gents
const fajrTimeNote = (
  <div className="text-sm text-[#453142]/70 text-center mb-3 pt-1">
    <span className="italic">
      * Class timing may vary up to 30 minutes depending upon the change of Fajr Prayer time in Chennai.
    </span>
  </div>
);

// Calendar labels
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * WeeklyCalendar (UPDATED)
 * - aggregates classes by day+time
 * - renders multiple class entries inside a cell
 */
function WeeklyCalendar({ classes, onClassClick }: { classes: ClassSchedule[], onClassClick: (c: ClassSchedule) => void }) {
  // unique start times sorted
  const uniqueTimes = useMemo(() => {
    const times = Array.from(new Set(classes.map(c => c.timeFrom)));
    times.sort((a, b) => {
      const [ah, am] = a.split(':').map(Number);
      const [bh, bm] = b.split(':').map(Number);
      return ah !== bh ? ah - bh : am - bm;
    });
    return times;
  }, [classes]);

  // scheduleMap: Map<"Day-Time", ClassSchedule[]>
  const scheduleMap = useMemo(() => {
    const map: Map<string, ClassSchedule[]> = new Map();
    classes.forEach(c => {
      c.days.forEach(d => {
        const key = `${d}-${c.timeFrom}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(c);
      });
    });
    return map;
  }, [classes]);

  return (
    <div className="overflow-x-auto my-8">
      <div className="grid grid-cols-8 gap-0 rounded-2xl border border-[#453142]/30 bg-[#faf9f7]">
        {/* Empty top-left corner */}
        <div className="bg-[#faf9f7]" />
        {/* Day headers */}
        {dayLabels.map(day => (
          <div key={day} className="font-bold text-[#453142] text-center border-b border-[#453142]/20 py-2 uppercase tracking-wide">
            {day}
          </div>
        ))}
        {/* Rows for each time */}
        {uniqueTimes.map(time => (
          <React.Fragment key={time}>
            {/* Time column */}
            <div className="font-mono text-[#453142]/80 text-right border-r border-[#453142]/10 py-2 px-2 bg-[#faf9f7]">
              {time}
            </div>
            {/* Day cells for this time */}
            {dayLabels.map(day => {
              const key = `${day}-${time}`;
              const list = scheduleMap.get(key) || [];
              if (list.length === 0) {
                return (
                  <div
                    key={key}
                    className="border border-[#453142]/10 min-h-[58px] cursor-default flex items-center justify-center transition-all duration-200 text-sm px-1 bg-[#faf9f7] text-[#453142]/20"
                    title="No class"
                    aria-disabled="true"
                  >
                    {/* empty */}
                  </div>
                );
              }
              // If multiple classes exist, render stacked small buttons
              return (
                <div
                  key={key}
                  className="border border-[#453142]/10 min-h-[58px] px-2 py-2 flex flex-col gap-1 items-stretch"
                  title={list.map(i => `${i.language} (${i.type})`).join(' • ')}
                >
                  {list.map(item => (
                    <button
                      key={item.id}
                      onClick={() => onClassClick(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') onClassClick(item);
                      }}
                      className={`w-full text-left rounded-lg px-2 py-1 text-xs font-semibold transition transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-1 ${getCalendarCellColor(item.type)} ${list.length > 1 ? 'shadow-sm' : 'shadow-md'}`}
                      aria-label={`Register ${item.language} ${item.type} at ${time} on ${day}`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="truncate">{item.language}</span>
                        <span className="text-[10px] opacity-90">{item.type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs mt-4 text-[#453142]/50 text-center">Click a block to register for a class.</p>
    </div>
  );
}

// Filter helpers for UI and logic
type CourseFilter = 'all' | 'men' | 'women' | 'weekend';

function getCourseCategory(c: ClassSchedule): CourseFilter {
  // MEN: type Gents
  if (c.type === 'Gents') return 'men';
  // WOMEN: type Ladies
  if (c.type === 'Ladies') return 'women';
  // WEEKEND: has only Sat/Sun, OR has at least one Sat/Sun in c.days
  // We'll call a class 'weekend' filter if it has any day Sat or Sun
  if (c.days.some(d => d === 'Sat' || d === 'Sun')) return 'weekend';
  // FAMILY/other: include in 'all'
  return 'all';
}

function classMatchesFilter(c: ClassSchedule, filter: CourseFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'men') return getCourseCategory(c) === 'men';
  if (filter === 'women') return getCourseCategory(c) === 'women';
  if (filter === 'weekend') return getCourseCategory(c) === 'weekend';
  return true;
}

const FILTER_OPTIONS: { filter: CourseFilter; label: string }[] = [
  { filter: 'all', label: 'All Courses' },
  { filter: 'men', label: "Men's Courses" },
  { filter: 'women', label: "Women's Courses" },
  { filter: 'weekend', label: 'Weekend Courses' }
];

function OnlineCoursesContent() {
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null);
  const [formData, setFormData] = useState<Partial<ClassRegistration>>({
    country: 'India',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Filtering by category using URL search param '?filter='
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlFilterParam = searchParams?.get('filter');

  const [filter, setFilter] = useState<CourseFilter>('all');

  useEffect(() => {
    if (
      urlFilterParam === 'men' ||
      urlFilterParam === 'women' ||
      urlFilterParam === 'weekend'
    ) {
      setFilter(urlFilterParam);
    } else {
      setFilter('all');
    }
  }, [urlFilterParam]);

  // When filter is changed via UI, update URL so nav remains correct.
  const handleFilterChange = (val: CourseFilter) => {
    // Updates URL while keeping client state in sync (won't reload).
    const url = val === 'all' ? '/online-courses' : `/online-courses?filter=${val}`;
    router.push(url);
    // setFilter(val); // syncing will be handled by url param effect above
  };

  // Show only filtered classes for both grid & calendar
  const filteredClasses = useMemo(
    () => classes.filter(c => classMatchesFilter(c, filter)),
    [filter]
  );

  const handleClassSelect = (classItem: ClassSchedule) => {
    setSelectedClass(classItem);
    setFormData({
      ...formData,
      language: classItem.language,
      classType: classItem.type,
      timing: `${classItem.timeFrom} to ${classItem.timeTo}`,
      days: classItem.days.join(', '),
      contactNumber: classItem.contactNumber,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Construct payload that matches expected schema to avoid backend errors
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone, // fallback to phone if not provided, matches API schema
        country: formData.country,
        language: selectedClass?.language || "English",
        classType: selectedClass?.type || "General",
        timing: selectedClass ? `${selectedClass.timeFrom} - ${selectedClass.timeTo}` : "Flexible",
        days: selectedClass?.days.join(',') || "Flexible",
        contactNumber: selectedClass?.contactNumber || formData.phone,
        additionalNotes: formData.additionalNotes,
      };

      await api.createRegistration(payload);

      setIsSuccess(true);
      setTimeout(() => {
        setSelectedClass(null);
        setFormData({ country: 'India' });
        setIsSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-10">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-[#453142] text-center mt-10 mb-2 tracking-tight">Quran Translation Class Timetable</h1>
          <p className="text-lg text-[#453142]/70 text-center mb-3">All batches • All genders • All locations</p>

          {/* FILTER NAV BUTTONS */}
          <div className="flex justify-center gap-2 mb-5 mt-2">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.filter}
                className={`
                  px-4 py-2 rounded-full font-semibold border-2 
                  ${filter === opt.filter
                    ? 'bg-[#453142] text-white border-[#453142]'
                    : 'bg-white text-[#453142] border-[#b187fc]/30 hover:bg-[#e5e0e8]'}
                  transition focus:outline-none focus:ring-2 focus:ring-[#b187fc] shadow
                `}
                onClick={() => handleFilterChange(opt.filter)}
                aria-current={filter === opt.filter}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {fajrTimeNote}

          {/* Calendar (show only classes matching filter) */}
          <WeeklyCalendar classes={filteredClasses} onClassClick={handleClassSelect} />

          {/* Card list summary (show only filtered classes) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
            {filteredClasses.map((classItem) => (
              <Card
                key={classItem.id}
                className={`
                  h-full border-0 shadow-[0_4px_24px_#45314215] hover:shadow-[0_6px_36px_#45314233] 
                  transition-all duration-300 cursor-pointer overflow-hidden group 
                  ${getCardBgByType(classItem.type)}
                  rounded-2xl
                `}
                onClick={() => handleClassSelect(classItem)}
              >
                <div className={`h-2 w-full ${getCardBgByType(classItem.type)}`} />
                <CardContent className="p-6 space-y-4">
                  <Badge className={"rounded-full px-3 py-1 text-xs font-bold shadow-sm " + getBadgeColor(classItem.type)}>
                    {classItem.language} - {classItem.type}
                  </Badge>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[#453142]/80 font-mono">
                      <Clock className="h-4 w-4"/>{classItem.timeFrom} - {classItem.timeTo} {classItem.timezone}
                    </div>
                    <div className="flex items-center gap-2 text-[#453142]/70">
                      <Users className="h-4 w-4"/>{classItem.days.join(' ')}
                    </div>
                    <div className="flex items-center gap-2 text-[#453142]/70">
                      <Phone className="h-4 w-4"/>{classItem.contactNumber}
                    </div>
                  </div>
                  <Button
                    className={`
                      w-full font-semibold border-2 mt-2
                      ${getBorderColor(classItem.type)}
                      bg-white text-[#453142] hover:bg-[#afa0ba] hover:text-white hover:border-[#453142] transition
                    `}
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredClasses.length === 0 && (
            <div className="text-center py-16 text-xl text-[#453142]/60 font-medium">
              No courses available for this category.
            </div>
          )}
        </motion.div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => !isSubmitting && setSelectedClass(null)}
          >
            <motion.div
              initial={{ scale: 0.97, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 28 }}
              className="bg-[#faf9f7] border-[#453142]/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#faf9f7] border-b border-[#453142]/20 p-6 flex justify-between items-start z-10 rounded-t-xl">
                <div>
                  <h2 className="text-2xl font-bold text-[#453142]">Register for Class</h2>
                  <p className="text-[#453142]/70 mt-1 text-sm">
                    {selectedClass.language} - {selectedClass.days.join(', ')} ({selectedClass.timeFrom}–{selectedClass.timeTo})
                  </p>
                </div>
                <button
                  onClick={() => !isSubmitting && setSelectedClass(null)}
                  disabled={isSubmitting}
                  className="text-[#453142] hover:bg-[#453142]/10 rounded-full p-2 transition-colors"
                  aria-label="Close registration modal"
                >
                  <X className="h-6 w-6"/>
                </button>
              </div>
              <div className="p-6">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4"/>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Registration Successful!</h3>
                    <p className="text-[#453142]/70 mb-4">
                      You will be contacted on WhatsApp at <strong>{selectedClass.contactNumber}</strong>
                    </p>
                    <Badge className="bg-[#453142] text-[#faf9f7]">Check your WhatsApp for confirmation</Badge>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <Card className={`border-0 ${getCardBgByType(selectedClass.type)} text-[#453142] mb-1`}>
                      <CardContent className="p-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2 font-mono"><Calendar className="h-4 w-4"/><span><strong>Days:</strong> {selectedClass.days.join(', ')}</span></div>
                        <div className="flex items-center gap-2 font-mono"><Clock className="h-4 w-4"/><span><strong>Time:</strong> {selectedClass.timeFrom}–{selectedClass.timeTo} {selectedClass.timezone}</span></div>
                        <div className="flex items-center gap-2 font-mono"><Phone className="h-4 w-4"/><span><strong>Contact:</strong> {selectedClass.contactNumber}</span></div>
                      </CardContent>
                    </Card>
                    <div>
                      <label className="block text-[#453142] font-medium mb-2">Full Name *</label>
                      <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-2 focus:ring-[#453142] focus:border-transparent bg-[#faf9f7]" placeholder="Enter your full name"/>
                    </div>
                    <div>
                      <label className="block text-[#453142] font-medium mb-2">Email Address *</label>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-2 focus:ring-[#453142] focus:border-transparent bg-[#faf9f7]" placeholder="your.email@example.com"/>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#453142] font-medium mb-2">Phone Number *</label>
                        <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} required className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-2 focus:ring-[#453142] focus:border-transparent bg-[#faf9f7]" placeholder="+91 98765 43210"/>
                      </div>
                      <div>
                        <label className="block text-[#453142] font-medium mb-2">WhatsApp Number</label>
                        <input type="tel" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-2 focus:ring-[#453142] focus:border-transparent bg-[#faf9f7]" placeholder="Same as phone"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#453142] font-medium mb-2">Country *</label>
                      <select name="country" value={formData.country || 'India'} onChange={handleChange} required className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-2 focus:ring-[#453142] focus:border-transparent bg-[#faf9f7]">
                        <option value="India">India</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="UAE">United Arab Emirates</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Australia">Australia</option>
                        <option value="Canada">Canada</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#453142] font-medium mb-2">Additional Notes (Optional)</label>
                      <textarea name="additionalNotes" value={formData.additionalNotes || ''} onChange={handleChange} rows={3} className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-2 focus:ring-[#453142] focus:border-transparent resize-none bg-[#faf9f7]" placeholder="Any questions or special requirements?"/>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#453142] text-white py-6 text-lg rounded-lg shadow border border-[#453142]/10 hover:bg-[#7e5e77] hover:text-white transition">
                        {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin"/>Submitting...</>) : (<><CheckCircle2 className="mr-2 h-5 w-5"/>Complete Registration</>)}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setSelectedClass(null)} disabled={isSubmitting} className="border-[#453142] text-[#453142] bg-white hover:bg-[#afa0ba] hover:text-white transition rounded-lg">Cancel</Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OnlineCoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-[#453142]">Loading...</div>
      </div>
    }>
      <OnlineCoursesContent />
    </Suspense>
  );
}
