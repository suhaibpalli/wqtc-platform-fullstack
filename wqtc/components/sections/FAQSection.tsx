"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Where Can I Find Information?",
    answer: "You can find comprehensive information about our Quran translation classes in our Resource Library, which includes video lectures, audio recordings, and eBooks. You can also visit our About Us section to learn more about our methodology and our mentor, Ustaad Imran Sait.",
    category: "General",
  },
  {
    id: 2,
    question: "What Are Your Terms And Conditions?",
    answer: "Our classes are completely free of charge. We only ask that students attend regularly and complete their assignments. By enrolling, you agree to respect the sanctity of the Quran and maintain a conducive learning environment for all participants.",
    category: "General",
  },
  {
    id: 3,
    question: "Can I Buy Directly From The Factory?",
    answer: "All our educational materials, including eBooks and translations, are available for free download from our website. We don't sell any physical products. Our mission is to make Quranic knowledge accessible to everyone without any financial barriers.",
    category: "Materials",
  },
  {
    id: 4,
    question: "What Kinds of Payment Do You Accept?",
    answer: "We don't accept any payments as all our courses and resources are completely free. However, if you wish to support our mission, you can reach out to us through our Contact page for donation information.",
    category: "Payments",
  },
  {
    id: 5,
    question: "When do I receive my order?",
    answer: "There are no physical orders. All our resources, including video classes, audio lectures, and eBooks, are available instantly for streaming or download through our Resource Library. You can access them anytime, anywhere.",
    category: "Access",
  },
  {
    id: 6,
    question: "What languages are the classes available in?",
    answer: "Our Word for Word Quran translation classes are currently available in English, Urdu, and Tamil. We're working on adding more languages to reach a wider audience and make the Quran accessible to people worldwide.",
    category: "Languages",
  },
  {
    id: 7,
    question: "How do I enroll in online courses?",
    answer: "You can enroll in our free online courses by visiting the 'Online Courses' section and choosing between courses for Men, Women, or Weekend classes. Fill out the registration form and you'll receive joining details via email within 24 hours.",
    category: "Enrollment",
  },
  {
    id: 8,
    question: "Are the courses suitable for beginners?",
    answer: "Absolutely! Our Word for Word methodology is designed specifically for beginners. You don't need any prior knowledge of Arabic or Quranic studies. Ustaad Imran Sait's unique teaching approach makes understanding the Quran natural and accessible for everyone.",
    category: "Learning",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(faqData[0]?.id ?? null);

  return (
    <section className="w-full bg-[#faf9f7] py-16 md:py-24 border-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="w-full flex flex-col md:flex-row gap-16 md:gap-8">
          {/* Left: Title and description */}
          <div className="md:w-1/2 flex flex-col justify-center">
            {/* "F.A.Q" badge */}
            <span className="inline-block uppercase bg-[#e9e6e3] text-[#453142] text-xs px-3 py-1 rounded font-semibold tracking-wider mb-4" style={{letterSpacing:1}}>
              F.A.Q
            </span>
            <h2 className="text-[2.1rem] md:text-[3rem] font-extrabold text-[#2d2632] leading-tight mb-4">
              Frequently Asked <br className="hidden md:block" /> Questions
            </h2>
            <p className="text-[#877e8c] text-base md:text-lg max-w-md mb-10 md:mb-0">
              Can’t find the answer? Please contact us and we’ll be happy to help. Browse below for some commonly asked questions about our Quran translation classes and resources.
            </p>
            <hr className="mt-8 w-16 border-t-2 border-[#ad99b2]" />
          </div>
          {/* Right: FAQ Panel */}
          <div className="md:w-1/2 w-full flex flex-col items-stretch justify-center">
            <div className="w-full flex flex-col gap-0 border rounded bg-white border-[#e2dde2] shadow-sm">
              {/* Each FAQ as minimal panel */}
              {faqData.map((faq, idx) => (
                <div
                  key={faq.id}
                  className={`
                    ${idx !== 0 ? 'border-t' : ''}
                    border-[#e2dde2] bg-white 
                    ${openId === faq.id ? "z-10 relative" : ""}
                  `}
                  style={{
                    boxShadow: openId === faq.id
                      ? "0 2px 14px 0 rgba(92,62,99,0.08)"
                      : undefined,
                  }}
                >
                  <button
                    className={`
                      flex items-center w-full justify-between px-4 md:px-6 py-3.5 text-left 
                      font-semibold text-[#2d2632] bg-transparent focus:outline-none transition-colors
                      ${openId === faq.id
                        ? "bg-[#f7f2fa]"
                        : "hover:bg-[#f6f4fa]"
                      }
                    `}
                    aria-expanded={openId === faq.id}
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    tabIndex={0}
                  >
                    <span className="text-base">{faq.question}</span>
                    <span
                      className={`ml-4 transition-transform duration-300 ${openId === faq.id ? "rotate-180" : ""}`}
                    >
                      <ChevronDown className="w-5 h-5 text-[#9a82a6]" aria-hidden="true"/>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openId === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.20, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-6 pb-4 text-[#5b4864] text-sm md:text-base leading-relaxed bg-[#f7f2fa] rounded-b">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
