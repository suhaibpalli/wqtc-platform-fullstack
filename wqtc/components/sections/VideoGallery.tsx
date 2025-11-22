"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, User, X, Loader2, CheckCircle2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom"; // <--- ADD THIS IMPORT
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

// --- ORIGINAL DATA (Preserved) ---
const courses = [
  {
    id: 1,
    title: "Online | Free",
    classType: "Daily",
    category: "English & Urdu · Men",
    instructor: "Ustad Imran Sait",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    students: "45 min",
    time: "6:45 A.M.",
    description: "A daily class for men, covering Quran recitation and understanding in English and Urdu.",
  },
  {
    id: 2,
    title: "Online | Free",
    classType: "Daily",
    category: "English & Urdu · Women",
    instructor: "Ustad Imran Sait",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    students: "45 min",
    time: "6:45 A.M.",
    description: "A daily class for women, covering Quran recitation and understanding in English and Urdu.",
  },
  {
    id: 3,
    title: "Online | Free",
    classType: "Daily",
    category: "Tamil · Men",
    instructor: "Ustad Imran Sait",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    students: "45 min",
    time: "6:45 A.M.",
    description: "A daily class for men in Tamil language, focusing on Quranic teachings and recitation.",
  },
  {
    id: 4,
    title: "Online | Free",
    classType: "Daily",
    category: "Tamil · Women",
    instructor: "Ustad Imran Sait",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    students: "45 min",
    time: "6:45 A.M.",
    description: "A daily class for women in Tamil language, focusing on Quranic teachings and recitation.",
  },
  {
    id: 5,
    title: "Online | Free",
    classType: "Weekend",
    category: "English & Urdu · Men",
    instructor: "Ustad Imran Sait",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    students: "45 min",
    time: "6:45 A.M.",
    description: "Weekend classes for men for Quran learning, conducted in English and Urdu.",
  },
  {
    id: 6,
    title: "Online | Free",
    classType: "Weekend",
    category: "English & Urdu · Women",
    instructor: "Ustad Imran Sait",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    students: "1.2K",
    time: "2 hrs",
    description: "Weekend classes for women for Quran learning, conducted in English and Urdu.",
  },
];

// --- REGISTRATION FORM SUBCOMPONENT ---
function RegistrationForm({ course, onSuccess }: { course: any; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "India",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.phone,
        country: formData.country,
        language: course.category.split('·')[0].trim(),
        classType: course.classType,
        timing: course.time,
        days: course.classType === "Daily" ? "Mon-Fri" : "Sat-Sun",
        contactNumber: formData.phone,
        additionalNotes: `Enrolled via Video Gallery Modal. \nUser Notes: ${formData.notes}`,
      };

      await api.createRegistration(payload);
      onSuccess();
    } catch (error: any) {
      alert(error.message || "Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mt-6 pt-6 border-t border-[#453142]/10 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="bg-[#faf9f7] p-5 rounded-xl border border-[#453142]/10 shadow-sm">
        <h4 className="font-bold text-[#453142] mb-4 flex items-center gap-2">
          <Send className="w-4 h-4" /> Register for this Class
        </h4>

        <div className="space-y-3">
          <div>
            <input
              required
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-[#453142]/20 bg-white text-sm focus:ring-1 focus:ring-[#453142] outline-none placeholder:text-[#453142]/40"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              required
              name="email"
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-[#453142]/20 bg-white text-sm focus:ring-1 focus:ring-[#453142] outline-none placeholder:text-[#453142]/40"
            />
            <input
              required
              name="phone"
              type="tel"
              placeholder="Phone / WhatsApp *"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-[#453142]/20 bg-white text-sm focus:ring-1 focus:ring-[#453142] outline-none placeholder:text-[#453142]/40"
            />
          </div>

          <div>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-[#453142]/20 bg-white text-sm focus:ring-1 focus:ring-[#453142] outline-none text-[#453142]"
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">United Kingdom</option>
              <option value="UAE">UAE</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <textarea
            name="notes"
            placeholder="Any questions? (Optional)"
            rows={2}
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-[#453142]/20 bg-white text-sm focus:ring-1 focus:ring-[#453142] outline-none resize-none placeholder:text-[#453142]/40"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 bg-[#453142] hover:bg-[#5a3f54] text-[#faf9f7] font-semibold shadow-md transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registering...
            </>
          ) : (
            "Confirm Registration"
          )}
        </Button>
      </div>
    </form>
  );
}

// --- UPDATED MODAL COMPONENT WITH PORTAL ---
function CourseModal({ open, course, onClose }: { open: boolean; course: any; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false); // Added for Portal safety

  // 1. Handle mounting state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) setIsSuccess(false);
  }, [open]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      onClose();
    }
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      // Slight delay to allow render before focus
      setTimeout(() => modalRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, handleKeyDown]);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  // Prevent rendering on server or if closed
  if (!mounted || !open || !course) return null;

  // 2. Wrap in createPortal to move it to document.body
  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        tabIndex={-1}
        onClick={handleOverlayClick}
        ref={modalRef}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          className="bg-white rounded-2xl max-w-lg w-full relative shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 210, damping: 22 }}
        >
          {/* Sticky Header Image */}
          <div className="relative h-48 w-full shrink-0">
            <Image
              src={course.image}
              alt={course.category}
              fill
              className="object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <button
              className="absolute top-4 right-4 text-[#faf9f7] bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors z-10 backdrop-blur-sm"
              aria-label="Close"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 left-6 right-6">
              <Badge className="bg-[#faf9f7] text-[#453142] hover:bg-white border-0 mb-2 shadow-sm">
                {course.classType} Class
              </Badge>
              <h2 className="text-2xl font-bold text-white leading-tight shadow-sm">{course.title}</h2>
              <p className="text-white/90 font-medium text-sm mt-1">{course.category}</p>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-[#453142]/10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#453142]/80">
                  <User className="h-4 w-4 text-[#453142]" />
                  <span className="font-medium">{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#453142]/80">
                  <Clock className="h-4 w-4 text-[#453142]" />
                  <span className="font-medium">{course.time}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-[#453142]/50 font-bold">Duration</p>
                <p className="font-bold text-[#453142]">{course.students}</p>
              </div>
            </div>

            <div className="text-[#453142]/80 text-sm leading-relaxed">
              {course.description || "No further details available for this class at the moment."}
            </div>

            {/* Success View or Registration Form */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 bg-green-50 border border-green-200 rounded-xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-[#453142] mb-2">Registration Complete!</h3>
                <p className="text-[#453142]/70 text-sm mb-6">
                  Jazakallah Khair. We have received your details. Our team will contact you on WhatsApp shortly with the joining link.
                </p>
                <Button variant="outline" onClick={onClose} className="border-[#453142] text-[#453142] hover:bg-[#453142] hover:text-white">
                  Close
                </Button>
              </motion.div>
            ) : (
              <RegistrationForm course={course} onSuccess={() => setIsSuccess(true)} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body // <--- The Portal Target
  );
}

// --- MAIN COMPONENT ---
export default function VideoGallery() {
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);
  const [openCourse, setOpenCourse] = useState<any>(null);

  return (
    <section id="videos" className="py-16 md:py-24 bg-[#faf9f7] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-[#453142] text-center">Online Free Quran Class Schedules</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCourse(course.id)}
              onMouseLeave={() => setHoveredCourse(null)}
              onClick={() => setOpenCourse(course)}
              tabIndex={0}
              role="button"
              aria-label={`Open details about ${course.category}`}
              style={{ cursor: "pointer" }}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg rounded-3xl bg-white">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.category}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#453142]/70 to-[#faf9f7]/70 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCourse === course.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="h-8 w-8 text-[#453142] ml-1" />
                    </motion.div>
                  </motion.div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-[#453142]">{course.title}</span>
                    <Badge className="bg-[#453142] text-[#faf9f7] rounded-full px-3 py-1 capitalize text-xs">
                      {course.classType}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base mb-2 text-[#453142] leading-snug">
                    {course.category}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[#453142]/80 mb-2">
                    <User className="h-4 w-4 text-[#453142]" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#453142]/70 pt-2 border-t border-[#453142]/10">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-[#453142]" />
                      <span>{course.time}</span>
                    </div>
                    <span className="font-semibold">{course.students}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* Modal for showing more details and Registration Form */}
        <CourseModal open={!!openCourse} course={openCourse} onClose={() => setOpenCourse(null)} />
      </div>
    </section>
  );
}
