// components/sections/ImageGallerySection.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, Maximize, X } from "lucide-react";

/**
 * Premium Video Carousel / Gallery (fixed height alignment)
 *
 * NOTE:
 * - If you use Next Image optimization, add 'img.youtube.com' to next.config.js images.domains
 * - Only layout/CSS changes compared to previous: grid -> items-stretch, both columns h-full,
 *   right card is flex-col h-full, and a few min-h-0 additions so children can shrink.
 */

type VideoItem = {
  id: string;
  title: string;
  description: string;
  speaker: string;
  youTube: string;
};

const AUTO_ADVANCE_MS = 7000;
const TRANSITION_DURATION = 0.36;

const VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Views of Shaikh Aneesur Rahman Sahib on Word For Word Quran Translation Classes",
    description: "Shaikh Aneesur Rahman Sahib shares his valuable views on Word For Word Quran Translation Classes.",
    speaker: "Shaikh Aneesur Rahman Sahib",
    youTube: "https://www.youtube.com/watch?v=XsTL8hOjlXM"
  },
  {
    id: "v2",
    title: "Views of Shaikh Hafeezur Rahman Azami Umari Madani on Word for Word Quran Translation Classes",
    description: "Shaikh Hafeezur Rahman Azami Umari Madani shares his valuable views on Word for Word Quran Translation Classes.",
    speaker: "Shaikh Hafeezur Rahman Azami Umari Madani",
    youTube: "https://www.youtube.com/watch?v=bMDk0XgFzHw"
  },
  {
    id: "v3",
    title: "Views of Shaikh Abdullah Hyderabadi Umari Madani on Word for Word Quran Translation Classes",
    description: "Shaikh Abdullah Hyderabadi Umari Madani shares his valuable views on Word For Word Quran Translation Classes.",
    speaker: "Shaikh Abdullah Hyderabadi Umari Madani",
    youTube: "https://www.youtube.com/watch?v=dnzKCSBmvq4"
  },
  {
    id: "v4",
    title: "The Importance of Understanding Quran",
    description: "The Importance of Understanding the Quran By Moulana Khan Baqavi (Speech in Tamil).",
    speaker: "Moulana Khan Baqavi",
    youTube: "https://www.youtube.com/watch?v=lZfcrA60YuM"
  },
  {
    id: "v5",
    title: "Importance of Understanding Quran",
    description: "A Reminder on Importance of Understanding the QuranBy Shaih hafeez-ur-Rehman.",
    speaker: "Shaih hafeez-ur-Rehman",
    youTube: "https://www.youtube.com/watch?v=axopbH_wFwc"
  },
  {
    id: "v6",
    title: "Word for Word Translation - Scholar's Views",
    description: "Shaikh Dr. Abdul Rahim's Views on Word for Word Translation Classes. Shaikh Dr. Abdul Rahim is the Director of King Fahad Quran Printing Complex, and is the Head of Translations Department.",
    speaker: "Shaikh Dr. Abdul Rahim",
    youTube: "https://www.youtube.com/watch?v=uqdFyw5v0Nc"
  },
  {
    id: "v7",
    title: "Shaikh Dahee's appreciation for Ustaadh Imran Sait",
    description: "Shaikh Dahee is the Chief Imam of Islamic Center Johnson County. WORD FOR WORD QURAN Class is a 225 Hours course in which we go through the complete Quran beginning from Surah Al-Fathihah up to Surah An-Naas, wherein the participants are taught basic Grammar and the vocabulary relevant to understanding the Quran. We also quote the relevant Hadeeth of the Prophet Muhammad صلى الله عليه وسلم wherever required. We do not charge any fee for conducting the same.",
    speaker: "Shaikh Dahee",
    youTube: "https://www.youtube.com/watch?v=PEaHljC37_g"
  },
  {
    id: "v8",
    title: "Discussion Between Shaikh Abdul Hameed and Imran Sait",
    description: "An Interview / Discussion between Shaikh Abdul Hameed and Ustaadh Imran Sait, in Islamic Center Kansas City, U S A. WORD FOR WORD QURAN Class is a 225 Hours course in which we go through the complete Quran beginning from Surah Al-Fathihah up to Surah An-Naas, wherein the participants are taught basic Grammar and the vocabulary relevant to understanding the Quran. We also quote the relevant Hadeeth of the Prophet Muhammad صلى الله عليه وسلم wherever required. We do not charge any fee for conducting the same.",
    speaker: "Shaikh Abdul Hameed & Ustaadh Imran Sait",
    youTube: "https://www.youtube.com/watch?v=THxtDA5bQCU"
  },
  {
    id: "v9",
    title: "Hafiz Riyaad Mohammed Rinquest, Imam of Minto Masjid endorsing Quran Classes",
    description: "During the visit of Ustaad Imran Sait to Australia (Nov, 2023), the Imam of Minto Masjid shares his valuable advice and guidance to the Muslim community, encouraging them to join the Quran Classes conducted by Ustaad.",
    speaker: "Hafiz Riyaad Mohammed Rinquest (Imam, Minto Masjid, Australia)",
    youTube: "https://www.youtube.com/watch?v=HRmRsUmm-gY"
  },
];

function extractYouTubeId(urlOrId?: string) {
  if (!urlOrId) return "";
  const s = urlOrId.trim();
  if (!s.includes("/") && s.length >= 6 && s.length <= 20) return s;
  const re = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/;
  const m = s.match(re);
  return m ? m[1] : "";
}
function ytThumb(id: string) {
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

export default function ImageGallerySection(): React.ReactElement {
  const videos = useMemo(() => VIDEOS.map((v, i) => ({ ...v, index: i, ytId: extractYouTubeId(v.youTube) })), []);
  const total = videos.length;

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [playerLoaded, setPlayerLoaded] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => setActive((s) => (s + 1) % total), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [isPaused, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape" && modalOpen) setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  useEffect(() => {
    const el = thumbsRef.current?.querySelector(`[data-thumb-index="${active}"]`) as HTMLElement | null;
    if (el && thumbsRef.current) {
      const parent = thumbsRef.current;
      const px = el.offsetLeft - parent.clientWidth / 2 + el.clientWidth / 2;
      parent.scrollTo({ left: px, behavior: "smooth" });
    }
    setPlayerLoaded(true);
    animateProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const animateProgress = () => {
    const el = progressRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.width = "0%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `width ${AUTO_ADVANCE_MS}ms linear`;
        el.style.width = "100%";
      });
    });
  };

  useEffect(() => {
    let startX = 0,
      delta = 0;
    const el = containerRef.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      delta = 0;
    };
    const onMove = (e: TouchEvent) => {
      delta = e.touches[0].clientX - startX;
    };
    const onEnd = () => {
      if (Math.abs(delta) > 60) (delta > 0 ? prev() : next());
    };
    el.addEventListener("touchstart", onStart);
    el.addEventListener("touchmove", onMove);
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [active]);

  function prev() { setActive((s) => (s === 0 ? total - 1 : s - 1)); }
  function next() { setActive((s) => (s === total - 1 ? 0 : s + 1)); }
  function go(i: number) { setActive(i % total); }

  const onThumbClick = (i: number) => {
    setActive(i);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 1200);
  };

  return (
    <section className="py-16 md:py-24 bg-[#fcfbfb]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-[#2b2130] mb-6">Views of Eminent Scholars about our Classes</h2>

        {/* KEY FIXES:
            - items-stretch makes both columns match height
            - min-h-0 allows flex children to shrink correctly
            - right column uses flex-col + h-full so its internals are predictable
        */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-0"
        >
          {/* LEFT - details */}
          <div className="lg:col-span-5 flex">
            <article className="bg-white rounded-2xl p-8 shadow-md border border-[#efeaf1] h-full flex flex-col justify-between min-h-0">
              <div>
                <h3 className="text-2xl font-semibold text-[#2b2130] leading-tight">{videos[active].title}</h3>
                <p className="mt-4 text-[#6b5158] leading-relaxed">{videos[active].description}</p>

                <div className="mt-6 flex items-center gap-4">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#efe6ee] text-[#453142] font-semibold text-sm">
                    {videos[active].speaker.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-sm text-[#7a636b]">Speaker</div>
                    <div className="font-medium text-[#2b2130]">{videos[active].speaker}</div>
                  </div>
                </div>

                <div className="mt-6 text-sm text-[#7a636b] border-t pt-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Concise scholar remarks and testimonials.</li>
                    <li>Short, watchable clips—perfect for website visitors.</li>
                    <li>No fees — just commitment. Suitable for all learners.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex gap-3 items-center">
                <button onClick={() => setPlayerLoaded(true)} className="inline-flex items-center gap-3 rounded-full bg-[#453142] text-white px-4 py-2 shadow hover:bg-[#7e5e77] transition">
                  <Play className="w-4 h-4" /> Watch Now
                </button>

                <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm text-[#453142] hover:bg-[#ebe6ef] transition">
                  <Maximize className="w-4 h-4" /> Fullscreen
                </button>

                <div className="ml-auto text-sm text-[#7a636b]">{active + 1} / {total}</div>
              </div>
            </article>
          </div>

          {/* RIGHT - Player + controls */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-0">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-[#efeaf1] flex flex-col h-full min-h-0">
              {/* Player stage */}
              <div className="relative bg-black flex-shrink-0">
                {/* Keep aspect ratio but contained inside flex-column */}
                <div className="aspect-video w-full min-h-0">
                  <AnimatePresence mode="wait">
                    <motion.div key={videos[active].id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: TRANSITION_DURATION }} className="w-full h-full">
                      {playerLoaded && videos[active].ytId ? (
                        <iframe
                          title={videos[active].title}
                          src={`https://www.youtube.com/embed/${videos[active].ytId}?rel=0&modestbranding=1`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full relative flex items-center justify-center">
                          <Image src={ytThumb(videos[active].ytId)} alt={videos[active].title} fill className="object-cover opacity-80" sizes="(max-width: 1024px) 100vw, 900px" />
                          <button onClick={() => setPlayerLoaded(true)} aria-label="Play video" className="absolute z-20 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#453142]/95 text-white hover:bg-[#7e5e77] transition">
                            <Play className="w-4 h-4" /> Play
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
                {/* top progress */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-[#f2ecf4]">
                  <div ref={progressRef} className="h-full bg-[#453142] w-0" />
                </div>

                {/* navigation arrows */}
                <button onClick={prev} aria-label="Previous video" className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#453142] shadow">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={next} aria-label="Next video" className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#453142] shadow">
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* bottom overlay */}
                <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 relative rounded overflow-hidden bg-[#efe6ee] flex-shrink-0">
                        <Image src={ytThumb(videos[active].ytId)} alt={videos[active].title} fill className="object-cover" sizes="56px" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white line-clamp-1">{videos[active].title}</div>
                        <div className="text-xs text-[#ddd] opacity-90">{videos[active].speaker}</div>
                      </div>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                      <button type="button" aria-label="Toggle player load" onClick={() => setPlayerLoaded((p) => !p)} className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white">
                        {playerLoaded ? "Unload" : "Load"}
                      </button>

                      <button type="button" aria-label="Open fullscreen" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white">
                        <Maximize className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* thumbnails + dots (bottom area) */}
              <div className="px-4 py-4 bg-white mt-auto">
                <div ref={thumbsRef} className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
                  {videos.map((v, i) => (
                    <button key={v.id} data-thumb-index={i} onClick={() => onThumbClick(i)} className={`relative min-w-[140px] h-20 rounded-lg overflow-hidden flex-shrink-0 transition transform hover:scale-105 focus:outline-none ${i === active ? "ring-2 ring-[#cdabff]/60" : ""}`} aria-label={`Select ${v.title}`}>
                      <Image src={ytThumb(v.ytId)} alt={v.title} fill className="object-cover" sizes="140px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-60 transition-opacity" />
                      <div className="absolute left-3 bottom-3 right-3 text-xs text-white font-medium line-clamp-1">{v.speaker}</div>
                      <div className={`absolute -top-2 -left-2 w-3 h-3 rounded-full border ${i === active ? "bg-[#453142] border-white" : "bg-white/70 border-white/40"} shadow-sm`} />
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  {videos.map((_, i) => (
                    <button key={`dot-${i}`} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} className={`w-3 h-3 rounded-full transition ${i === active ? "bg-[#453142]" : "bg-[#efeaf1]"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-[#7a636b]"><strong>Note:</strong> These clips are short excerpts from scholar remarks about our Word-for-Word Quran Translation Classes.</div>
      </div>

      {/* fullscreen modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/80" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ duration: 0.18 }} className="relative max-w-6xl w-full bg-black rounded-xl overflow-hidden">
              <button aria-label="Close fullscreen" onClick={() => setModalOpen(false)} className="absolute top-3 right-3 z-40 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-video">
                <iframe title={videos[active].title} src={`https://www.youtube.com/embed/${videos[active].ytId}?rel=0&modestbranding=1&autoplay=1`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <div className="p-5 bg-white">
                <div className="text-lg font-semibold text-[#2b2130]">{videos[active].title}</div>
                <div className="text-sm text-[#6b5158] mt-2">{videos[active].description}</div>
                <div className="text-sm text-[#7a636b] mt-3"><strong>Speaker:</strong> {videos[active].speaker}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
