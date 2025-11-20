// components/ui/SlideOver.tsx

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useSlideOver } from "@/components/context/SlideOverContext";

export default function SlideOver() {
  const { open, content, closeSlideOver } = useSlideOver();

  return (
    <Dialog.Root open={open} onOpenChange={(val) => { if (!val) closeSlideOver(); }}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 bg-black z-40"
              />
            </Dialog.Overlay>

            {/* panel */}
            <Dialog.Content asChild>
              {/* motion.div must contain the required Dialog.Title */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed right-0 top-0 h-full w-full sm:w-[640px] max-w-full z-50 bg-white shadow-2xl overflow-auto"
                role="dialog"
                aria-modal="true"
              >
                {/* Accessible title for screen-readers. 
                    Use 'sr-only' to hide visually but keep for assistive tech.
                    If you'd like it visible, replace these classes with normal text classes. */}
                <Dialog.Title className="sr-only">Side panel</Dialog.Title>
                <Dialog.Description className="sr-only">
                  A panel containing additional information and controls.
                </Dialog.Description>

                <div className="relative min-h-full">
                  <button
                    onClick={closeSlideOver}
                    aria-label="Close panel"
                    className="absolute top-5 right-5 p-3 rounded-full shadow-lg focus:outline-none
                               bg-[#faf9f7] text-[#453142] hover:bg-[#b187fc] hover:text-white transition-all border border-[#b187fc]/30"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="p-8 pt-16">
                    {content}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
