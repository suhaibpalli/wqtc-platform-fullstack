"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, BookOpen, Users, GraduationCap, Award } from "lucide-react";

const features = [
  {
    title: "AI Automation",
    description: "Construction is a general term the art and science to form",
    icon: "🤖", // Using emoji for cute icons like in screenshot
    iconBg: "bg-blue-50",
    link: "View Subject →",
  },
  {
    title: "Virtual Reality",
    description: "Construction is a general term the art and science to form",
    icon: "🥽",
    iconBg: "bg-purple-50",
    link: "View Subject →",
  },
  {
    title: "Machine Learning",
    description: "Construction is a general term the art and science to form",
    icon: "🧠",
    iconBg: "bg-green-50",
    link: "View Subject →",
  },
  {
    title: "AI Cloud Services",
    description: "Construction is a general term the art and science to form",
    icon: "☁️",
    iconBg: "bg-cyan-50",
    link: "View Subject →",
  },
];

export default function QuranVerseSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-purple-50/30 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
      
      {/* Decorative stars/sparkles pattern */}
      <div className="absolute top-1/3 right-1/4 opacity-20">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <text x="10" y="30" fontSize="24">✨</text>
          <text x="40" y="60" fontSize="18">✨</text>
          <text x="70" y="40" fontSize="20">✨</text>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start mb-16">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Badge */}
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-1.5 rounded-full">
              Popular Subject
            </Badge>

            {/* Main Heading with Blue Background Highlight */}
            <div className="space-y-1">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                <span className="inline-block bg-blue-600 text-white px-4 py-2 mb-2">
                  Provide It & Technology
                </span>
                <br />
                <span className="inline-block bg-blue-600 text-white px-4 py-2">
                  Subject For You
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-lg leading-relaxed">
              Construction is a general term meaning the art and science to form systems organizations, and comes from Latin Construction is
            </p>

            {/* Pink Quote Box with Left Border */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-500 p-6 rounded-r-lg"
            >
              <p className="text-slate-700 leading-relaxed italic">
                Construction is a general term meaning the art and science to form systems organizations, and comes from Latin Construction is a organizations, and comes from Latin construction and Old
              </p>
            </motion.div>

            {/* Explore More Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                className="group bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                Explore More
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Side - 2x2 Feature Cards Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 h-full bg-white rounded-2xl">
                  <CardContent className="p-6 space-y-4">
                    {/* Cute Icon */}
                    <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Link */}
                    <button className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors flex items-center gap-1 group/link">
                      {feature.link}
                      <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                    </button>
                  </CardContent>

                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300" />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        
      </div>
    </section>
  );
}
