"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play, BookOpen } from "lucide-react";
import Image from "next/image";

const heroSlides = [
  {
    id: 1,
    title: "Learn the Qur'an translation",
    highlight: "Word for Word",
    description: "Understanding Quran becomes natural with our innovative teaching methodology",
    primaryCTA: "Watch Classes",
    secondaryCTA: "Learn More",
    backgroundImage: "https://images.unsplash.com/photo-1618554844984-d4ed47c7e0c0?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Master Quran Translation",
    highlight: "Step by Step",
    description: "Join thousands of students learning Quran translation in English, Urdu, and Tamil",
    primaryCTA: "Join for Free",
    secondaryCTA: "View Library",
    backgroundImage: "https://images.unsplash.com/photo-1643860636409-1952e6e30145?q=80&w=1073&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Transform Your Life",
    highlight: "Through Quran",
    description: "Experience life-changing impact through understanding Allah's message",
    primaryCTA: "Start Learning",
    secondaryCTA: "Contact Us",
    backgroundImage: "https://images.unsplash.com/photo-1619616962999-b0dcf060c93f?q=80&w=1170&auto=format&fit=crop",
  },
];


const floatingDots = [
  { top: "10%", left: "15%", delay: "0s", size: "w-2 h-2" },
  { top: "25%", left: "85%", delay: "0.5s", size: "w-3 h-3" },
  { top: "45%", left: "20%", delay: "1s", size: "w-2 h-2" },
  { top: "60%", left: "75%", delay: "1.5s", size: "w-4 h-4" },
  { top: "75%", left: "30%", delay: "0.3s", size: "w-2 h-2" },
  { top: "35%", left: "90%", delay: "1.2s", size: "w-3 h-3" },
  { top: "85%", left: "50%", delay: "0.8s", size: "w-2 h-2" },
  { top: "20%", left: "60%", delay: "1.8s", size: "w-3 h-3" },
];

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {heroSlides.map((slide, index) => (
            <div key={slide.id} className="embla__slide flex-[0_0_100%] min-w-0">
              <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.backgroundImage}
                    alt="Quran background"
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  
                  {/* Subtle vignette effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30" />
                </div>

                {/* WHITE OVERLAY LAYER - Added between image and content */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

                {/* Subtle gradient orbs - reduced opacity */}
                <div className="absolute top-20 -right-32 w-96 h-96 bg-gradient-to-br from-[#453142]/10 to-[#453142]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
                <div
                  className="absolute -bottom-20 -left-32 w-96 h-96 bg-gradient-to-br from-[#453142]/10 to-[#453142]/5 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
                  style={{ animationDelay: "2s" }}
                />

                <div className="container relative mx-auto px-4 py-20 md:py-32 lg:py-40">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left content */}
                    <AnimatePresence mode="wait">
                      {selectedIndex === index && (
                        <motion.div
                          key={slide.id}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -50 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="space-y-8 z-10"
                        >
                          {/* Title - removed text shadow since white overlay provides readability */}
                          <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight text-[#453142]"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                          >
                            {slide.title}{" "}
                            <span className="relative inline-block">
                              <span className="relative z-10 text-[#453142] font-extrabold">
                                {slide.highlight}
                              </span>
                              <motion.span
                                className="absolute bottom-2 left-0 w-full h-4 bg-[#faf9f7] -rotate-1"
                                animate={{
                                  scaleX: [0, 1],
                                  opacity: [0, 1],
                                }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                              />
                            </span>
                          </motion.h1>

                          <motion.p
                            className="text-lg md:text-xl text-[#453142] max-w-2xl leading-relaxed font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            {slide.description}
                          </motion.p>

                          {/* CTA Buttons */}
                          <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                          >
                            <Button
                              size="lg"
                              className="group relative bg-[#453142] hover:bg-[#5a3f54] text-[#faf9f7] shadow-2xl shadow-[#453142]/50 px-8 overflow-hidden font-semibold"
                              asChild
                            >
                              <Link href="#videos">
                                <span className="relative z-10 flex items-center gap-2">
                                  <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                  {slide.primaryCTA}
                                </span>
                                <span className="absolute inset-0 bg-gradient-to-r from-[#5a3f54] to-[#453142] opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                              </Link>
                            </Button>
                            <Button
                              size="lg"
                              variant="outline"
                              className="group border-2 border-[#453142] hover:bg-[#453142] text-[#453142] hover:text-[#faf9f7] px-8 bg-white/80"
                              asChild
                            >
                              <Link href="/about">
                                <BookOpen className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                                {slide.secondaryCTA}
                              </Link>
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Right - 3D Visual Effect with Quran Image */}
                    <AnimatePresence mode="wait">
                      {selectedIndex === index && (
                        <motion.div
                          key={`visual-${slide.id}`}
                          initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="relative hidden lg:block perspective-1000"
                        >
                          <div className="relative w-full aspect-square max-w-lg mx-auto transform-gpu">
                            {/* Glassmorphic circles with 3D effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-[#453142]/20 to-[#453142]/10 rounded-full backdrop-blur-sm border border-[#453142]/30 shadow-2xl"
                              animate={{
                                rotate: 360,
                                scale: [1, 1.05, 1],
                              }}
                              transition={{
                                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                              }}
                            />
                            <motion.div
                              className="absolute inset-8 bg-gradient-to-br from-[#453142]/30 to-[#453142]/20 rounded-full backdrop-blur-sm border border-[#453142]/30"
                              animate={{
                                rotate: -360,
                                scale: [1, 1.08, 1],
                              }}
                              transition={{
                                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                                scale: {
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 0.5,
                                },
                              }}
                            />
                            <motion.div
                              className="absolute inset-16 bg-gradient-to-br from-[#453142]/40 to-[#453142]/30 rounded-full backdrop-blur-sm flex items-center justify-center border border-[#453142]/40 shadow-inner overflow-hidden"
                              animate={{
                                scale: [1, 1.1, 1],
                              }}
                              transition={{
                                scale: {
                                  duration: 2.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 1,
                                },
                              }}
                            >
                              {/* Quran Image in Center Circle */}
                              <div className="relative w-full h-full rounded-full overflow-hidden">
                                <Image
                                  src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=800"
                                  alt="Holy Quran"
                                  fill
                                  className="object-cover opacity-90"
                                />
                              </div>
                            </motion.div>

                            {/* Orbiting particles */}
                            <div className="absolute inset-0">
                              {floatingDots.map((dot, i) => (
                                <motion.div
                                  key={i}
                                  className={`absolute ${dot.size} bg-gradient-to-br from-[#453142] to-[#5a3f54] rounded-full shadow-lg`}
                                  style={{
                                    top: dot.top,
                                    left: dot.left,
                                  }}
                                  animate={{
                                    y: [0, -20, 0],
                                    opacity: [0.4, 0.8, 0.4],
                                    scale: [1, 1.2, 1],
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: parseFloat(dot.delay),
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="group p-3 rounded-full bg-[#453142]/80 backdrop-blur-md border border-[#faf9f7]/20 hover:bg-[#453142] transition-all duration-300 shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-[#faf9f7] group-hover:scale-110 transition-transform" />
        </button>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-8 bg-[#453142]"
                  : "w-2 bg-[#453142]/40 hover:bg-[#453142]/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="group p-3 rounded-full bg-[#453142]/80 backdrop-blur-md border border-[#faf9f7]/20 hover:bg-[#453142] transition-all duration-300 shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-[#faf9f7] group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </section>
  );
}
