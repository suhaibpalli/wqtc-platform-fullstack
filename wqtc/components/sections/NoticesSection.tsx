"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

const events = [
  {
    id: 1,
    date: "03/05/2024",
    title: "USA Tour May-2024 | Jumma Khutbah",
    location: "Islamic Association of Allen",
    type: "past",
  },
  {
    id: 2,
    date: "25/04/2024",
    title: "Word For Word Concept of Learning Quran",
    location: "Islamic Community Center of Des Plaines",
    type: "past",
  },
  {
    id: 3,
    date: "16/07/2023",
    title: "Guest Lecture - Understanding Quran",
    location: "Masjid Jafar, Atlanta USA",
    type: "past",
  },
];

export default function NoticesSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#faf9f7] to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#453142]">
            Recent / Upcoming Events
          </h2>
          <p className="text-[#453142]/80 text-lg">
            Join our sessions and lectures worldwide
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full rounded-2xl bg-[#faf9f7] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-[#453142] text-[#faf9f7] px-3 py-1 font-semibold">{event.type === "past" ? "Past Event" : "Upcoming"}</Badge>
                    <div className="flex items-center gap-1 text-sm text-[#453142] font-semibold">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold mb-3 min-h-[56px] text-[#453142]">
                    {event.title}
                  </h3>
                  <div className="flex items-start gap-2 text-sm text-[#453142]/80">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
