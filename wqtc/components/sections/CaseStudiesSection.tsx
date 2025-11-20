"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Laptop, Lightbulb, Languages, Clock, Brain, BadgeCheck } from "lucide-react";

// Use the two-color palette for all feature cards
const features = [
  {
    name: "Online Classes",
    description:
      "Attend live, interactive Word for Word Quran classes from anywhere in the world, guided by experienced instructors.",
    icon: Laptop,
    // bg light, text dark
    color: "bg-[#faf9f7] text-[#453142]",
  },
  {
    name: "Easy Methodology",
    description:
      "Learn Quran translation through a unique Word for Word teaching method, making understanding effortless for all levels.",
    icon: Lightbulb,
    color: "bg-[#faf9f7] text-[#453142]",
  },
  {
    name: "Multiple Languages",
    description:
      "Our Word for Word Quran courses are offered in English, Urdu, and Tamil to make learning accessible to everyone.",
    icon: Languages,
    color: "bg-[#faf9f7] text-[#453142]",
  },
  {
    name: "Flexible Time",
    description:
      "Choose timings that suit your schedule. Our flexible batch system for Word for Word classes fits your daily routine.",
    icon: Clock,
    color: "bg-[#faf9f7] text-[#453142]",
  },
  {
    name: "Greater Understanding",
    description:
      "Gain deeper meaning and true understanding of the Quran by studying each word and its translation in context.",
    icon: Brain,
    color: "bg-[#faf9f7] text-[#453142]",
  },
  {
    name: "Certified Teachers",
    description:
      "Learn from experienced and certified instructors who specialize in Word for Word Quran translation, ensuring quality and authenticity in every lesson.",
    icon: BadgeCheck,
    color: "bg-[#faf9f7] text-[#453142]",
  },
];

export default function CaseStudiesSection() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative Dotted Grid */}
      <div className="absolute inset-0 opacity-16 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #45314222 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>
      {/* Decorative Gradient Circle */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.22, 0.33, 0.22],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-[12%] right-20 w-96 h-96 bg-gradient-to-br from-[#453142]/10 to-[#faf9f7]/55 rounded-full blur-3xl z-0"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          // Increased width for this intro block: max-w-4xl instead of max-w-2xl
          className="text-center mb-12 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-2 text-[#453142]">
            Why Choose Us?
          </h2>
          <p className="text-lg text-[#453142]/80">
            We believe that authentic knowledge of the Quran is the key to better understand Islam and steer away from the misconceptions and superstitions. We are dedicated to spread the understanding of the Quran and Free translation of the Quran word by word. Our focus is to help the ummah build a strong relationship with the Quran using the simple Word for word learning technique.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8, transition: { duration: 0.22 } }}
              className="flex justify-center"
            >
              <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 h-full bg-white rounded-3xl w-full max-w-[340px] flex flex-col">
                <CardContent className="flex flex-col flex-1 p-7 space-y-5 items-center text-center">
                  <motion.div
                    animate={{ scale: [1, 1.09, 1], rotate: [0, 6, 0] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.1,
                    }}
                    className={`w-14 h-14 ${feature.color} rounded-full flex items-center justify-center shadow-md mb-2 border-2 border-[#453142]/10`}
                  >
                    <feature.icon className="w-8 h-8" />
                  </motion.div>
                  <div className="font-extrabold text-lg text-[#453142]">
                    {feature.name}
                  </div>
                  <div className="text-[#453142]/85 text-sm leading-relaxed">
                    {feature.description}
                  </div>
                  <div className="flex-1" />
                </CardContent>
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#faf9f7]/0 to-[#453142]/10 group-hover:from-[#faf9f7]/20 group-hover:to-[#453142]/15 transition-all duration-300 pointer-events-none" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
