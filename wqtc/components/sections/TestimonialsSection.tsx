"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Tajuddin",
    content:
      "I have been attending morning Quran class after Fajr for the past few years. My life has completely changed after attending this class. By the grace of Allah, I never missed Fajr salah.",
    initials: "T",
    role: "Student",
  },
  {
    id: 2,
    name: "Asraruddin Elias",
    content:
      "This course has given me an opportunity to learn and comprehend Allah's message. The dedication demonstrated in teaching is most impressive. I consider myself privileged.",
    initials: "AE",
    role: "Student",
  },
  {
    id: 3,
    name: "Syed Abbas Ibrahim",
    content:
      "It is very much useful to understand the Quran with my native language. The explanations are very much useful to us. A golden opportunity not to miss.",
    initials: "SI",
    role: "Student",
  },
];

// You can update this image and alt to best suit your project context.
const TESTIMONIAL_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";

export default function TestimonialsSection() {
  const [selected, setSelected] = useState(0);
  const testimonial = testimonials[selected];

  const prevTestimonial = () =>
    setSelected((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const nextTestimonial = () =>
    setSelected((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#faf9f7] to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 flex flex-col gap-y-16">
        {/* Top Section: Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <Badge className="mb-4 bg-[#453142] text-[#faf9f7]">Testimonials</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#453142]">
            What Our Students Say
          </h2>
          <p className="text-[#453142]/80 text-lg md:text-xl max-w-2xl mx-auto">
            Hear from our students about their transformational experiences learning Quran translation – their journeys, their growth, and the impact on their lives.
          </p>
        </motion.div>

        {/* Bottom Section: Responsive Flex Layout */}
        <div className="w-full flex flex-col md:flex-row items-center md:items-stretch justify-center gap-10 md:gap-16">
          {/* Left Bottom: Static Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            // Increased width and height for a larger image
            className="w-[380px] h-[480px] flex-shrink-0 relative rounded-3xl overflow-hidden shadow-xl bg-white border border-[#453142]/10"
            style={{
              background:
                "linear-gradient(135deg, #faf9f7 70%, #eee3ed 100%)",
            }}
          >
            <img
              src={TESTIMONIAL_IMAGE}
              alt="Student reflecting with Quran"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-95"
              loading="lazy"
              style={{ zIndex: 1 }}
            />
            {/* Decorative overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#453142]/10 via-transparent to-transparent" />
            {/* Content overlay if needed */}
            <div className="absolute bottom-4 left-4 right-4 px-3 py-2 bg-[#faf9f7]/80 backdrop-blur rounded-xl shadow border border-[#BE9BAE]/20 text-center z-10">
              <span className="font-medium text-[#453142] text-base">
                Real Students, Real Impact
              </span>
            </div>
          </motion.div>

          {/* Right Bottom: Testimonial Card with Arrows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 flex flex-col justify-center items-center min-w-0"
          >
            <div className="flex items-center justify-center w-full gap-1">
              {/* Left Arrow */}
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-[#faf9f7] border border-[#453142]/20 shadow-md hover:bg-[#453142]/20 transition-colors mx-1"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-7 w-7 text-[#453142]" />
              </button>
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-xl"
                >
                  <Card className="shadow-2xl rounded-3xl bg-[#faf9f7] border-0 relative px-2 py-2">
                    <CardContent className="pt-10 pb-8 px-10 flex flex-col items-center">
                      <Quote className="h-12 w-12 text-[#453142] opacity-50 mb-4" />
                      <p className="text-[#453142]/90 mb-8 text-lg leading-relaxed text-center">
                        {testimonial.content}
                      </p>
                      <div className="flex items-center gap-4 pt-4 border-t border-[#453142]/10 w-full justify-center">
                        <Avatar className="w-14 h-14 shadow-lg border-4 border-white -mt-12 bg-[#FAF0F6]">
                          <AvatarFallback className="bg-gradient-to-br from-[#453142] to-[#BE9BAE] text-[#faf9f7] font-semibold text-xl">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-[#453142] text-lg">{testimonial.name}</p>
                          <p className="text-sm text-[#453142]/80">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
              {/* Right Arrow */}
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-[#faf9f7] border border-[#453142]/20 shadow-md hover:bg-[#453142]/20 transition-colors mx-1"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-7 w-7 text-[#453142]" />
              </button>
            </div>
            {/* Dots for indicator */}
            <div className="flex justify-center items-center gap-2 mt-5">
              {testimonials.map((_, i) => (
                <span
                  key={i}
                  className={`transition-all duration-300 h-2 rounded-full ${
                    i === selected
                      ? "w-7 bg-[#453142]"
                      : "w-2 bg-[#BE9BAE]/30"
                  }`}
                  style={{ display: "inline-block" }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
