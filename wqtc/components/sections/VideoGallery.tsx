"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

// Updated categories/classes
const categories = [
  {
    id: 1,
    title: "Daily English & Urdu Classes",
    subtitle: "For Men",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    gradient: "from-[#453142]/80 via-[#6e4d66]/80 to-[#faf9f7]/80",
  },
  {
    id: 2,
    title: "Daily English & Urdu Classes",
    subtitle: "For Women",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    gradient: "from-[#6e4d66]/80 via-[#453142]/80 to-[#faf9f7]/80",
  },
  {
    id: 3,
    title: "Daily Tamil Classes",
    subtitle: "For Men",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    gradient: "from-[#453142]/80 via-[#faf9f7]/80 to-[#6e4d66]/80",
  },
  {
    id: 4,
    title: "Daily Tamil Classes",
    subtitle: "For Women",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    gradient: "from-[#faf9f7]/80 via-[#6e4d66]/80 to-[#453142]/80",
  },
  {
    id: 5,
    title: "Weekend Classes in English & Urdu",
    subtitle: "For Men",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    gradient: "from-[#453142]/80 via-[#faf9f7]/80 to-[#6e4d66]/80",
  },
  {
    id: 6,
    title: "Weekend Classes in English & Urdu",
    subtitle: "For Women",
    image: "https://media.istockphoto.com/id/482765777/photo/quran-in-the-mosque.jpg?b=1&s=612x612&w=0&k=20&c=56KQuVPCH2jLanrMPjMG7Sdx-7qnwt2RhOJA62YW7ro=",
    gradient: "from-[#6e4d66]/80 via-[#453142]/80 to-[#faf9f7]/80",
  },
];

// Always "Free", no stars, trending or complete
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

// Modal Component
function CourseModal({ open, course, onClose }: { open: boolean; course: any; onClose: () => void }) {
  // Add escape key handler
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      onClose();
    }
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      // Optionally trap focus for accessibility
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  // Close on overlay click
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  if (!open || !course) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
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
          className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 210, damping: 22 }}
        >
          <button
            className="absolute top-4 right-4 text-[#faf9f7] bg-[#453142] hover:bg-[#6e4d66] rounded-full p-2 transition-colors z-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#453142]/70"
            aria-label="Close"
            onClick={onClose}
            autoFocus
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mb-5">
            <div className="relative h-48 w-full mb-4 rounded-xl overflow-hidden">
              <Image
                src={course.image}
                alt={course.category}
                fill
                className="object-cover"
              />
            </div>
            <Badge className="bg-[#453142] text-[#faf9f7] rounded-full px-4 py-1 capitalize text-xs mb-2">
              {course.classType}
            </Badge>
            <h2 className="text-2xl font-bold text-[#453142] mb-2">{course.title}</h2>
            <p className="font-semibold text-[#453142]/90 mb-2">{course.category}</p>
          </div>
          <div className="mb-3 flex items-center gap-2 text-sm text-[#453142]/80">
            <User className="h-5 w-5 text-[#453142]" />
            <span>{course.instructor}</span>
          </div>
          <div className="mb-2 flex items-center gap-4 text-sm text-[#453142]/70">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-[#453142]" />
              <span>{course.time}</span>
            </div>
            <div className="font-semibold">{course.students}</div>
          </div>
          <div className="mt-4 text-[#453142]/90 text-base">
            {course.description || "No further details available for this class at the moment."}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function VideoGallery() {
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);
  const [openCourse, setOpenCourse] = useState<any>(null);

  return (
    <section id="videos" className="py-16 md:py-24 bg-[#faf9f7] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* 
        // -------------------------------------------
        // The following section is commented as per instruction.
        // It displays the "Latest Classes" & categories cards grid.
        // Includes:
        //   - Section Header:
        //        Latest Classes
        //        Live Quran Classes – Organized by Language & Group
        //   - Categories Cards Grid:
        //        Daily English & Urdu Classes (Men/Women)
        //        Daily Tamil Classes (Men/Women)
        //        Weekend Classes in English & Urdu (Men/Women)
        // -------------------------------------------

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block mb-4"
          >
            <Badge className="bg-[#453142] text-[#faf9f7] px-6 py-2 text-sm font-semibold shadow-md">
              Latest Classes
            </Badge>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#453142]">
            Live Quran Classes – Organized by Language & Group
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="group relative overflow-hidden cursor-pointer border-0 shadow-xl h-full rounded-3xl">
                <div className="relative h-56">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />
                  <div className="absolute inset-0 bg-[#453142]/20 group-hover:bg-[#faf9f7]/10 transition-colors" />
                  <div className="absolute inset-0 flex flex-col justify-end items-start p-6">
                    <div className="relative z-10">
                      <h3 className="text-xl font-extrabold mb-1 text-[#faf9f7] group-hover:text-[#453142] transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm opacity-90 text-[#faf9f7] group-hover:text-[#faf9f7]/80">{category.subtitle}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        */}

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-[#453142]">Online Free Quran Class Schedules</h2>
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
              <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg rounded-3xl">
                <div className="relative h-44 overflow-hidden">
                  {/* Course Image */}
                  <Image
                    src={course.image}
                    alt={course.category}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Play Button Overlay */}
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
        {/* Modal for showing more details */}
        <CourseModal open={!!openCourse} course={openCourse} onClose={() => setOpenCourse(null)} />
      </div>
    </section>
  );
}
