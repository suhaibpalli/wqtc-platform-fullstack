// components/context/SlideOverContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

type SlideOverContextType = {
  open: boolean;
  content: React.ReactNode | null;
  openSlideOver: (content: React.ReactNode) => void;
  closeSlideOver: () => void;
};

const SlideOverContext = createContext<SlideOverContextType | undefined>(undefined);

export function SlideOverProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode | null>(null);

  function openSlideOver(c: React.ReactNode) {
    setContent(c);
    setOpen(true);
  }
  function closeSlideOver() {
    setOpen(false);
    // keep content for small delay if you want animation, or clear immediately:
    setTimeout(() => setContent(null), 300);
  }

  return (
    <SlideOverContext.Provider value={{ open, content, openSlideOver, closeSlideOver }}>
      {children}
    </SlideOverContext.Provider>
  );
}

export function useSlideOver() {
  const ctx = useContext(SlideOverContext);
  if (!ctx) throw new Error("useSlideOver must be used inside SlideOverProvider");
  return ctx;
}
