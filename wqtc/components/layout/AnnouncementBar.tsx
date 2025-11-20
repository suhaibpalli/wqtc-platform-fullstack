"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 px-4 relative animate-gradient">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm md:text-base">
        <span className="font-medium">Latest Videos are uploaded, Please click here!</span>
        <Link 
          href="#videos" 
          className="underline underline-offset-4 hover:text-emerald-100 transition-colors font-semibold"
        >
          View Now
        </Link>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
