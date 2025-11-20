"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";

export default function WelcomeSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#faf9f7] via-[#f5f3f0] to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Teacher Image (plain, no card/bg) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full max-w-2xl mx-auto">
              <Image
                src="https://wordforwordquran.com/assets/q/mainbanner.png"
                alt="Ustaad Imran Sait - Quran Teacher"
                width={1200}
                height={1200}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#453142]">
              Our Best Instructor to guide About Future
            </h2>

            <p className="text-[#453142]/80 text-lg leading-relaxed">
              Learn the Qur'an translation through our innovative Word for Word method. 
              Our experienced instructors, led by Ustaad Imran Sait, make understanding 
              the Quran accessible to everyone through structured, interactive online classes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button 
                size="lg"
                className="bg-[#453142] hover:bg-[#5a3f54] text-[#faf9f7] px-8 shadow-lg transition-all"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Classes
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-[#453142] text-[#453142] hover:bg-[#453142] hover:text-[#faf9f7] px-8 transition-all"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
