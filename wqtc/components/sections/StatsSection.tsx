"use client";

import { motion } from "framer-motion";
import { Users, Award, BookOpen, Globe } from "lucide-react";

const stats = [
  {
    value: "5K",
    label: "Student Enrolled",
    icon: Users,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    value: "46K+",
    label: "Class Completed",
    icon: BookOpen,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    value: "3K",
    label: "Satisfaction Rate",
    icon: Award,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    value: "68K+",
    label: "Students Community",
    icon: Globe,
    gradient: "from-orange-500 to-red-500",
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Diagonal Stripe Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #6366f1 0px,
              #6366f1 1px,
              transparent 1px,
              transparent 20px
            )`,
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl relative`}
              >
                <stat.icon className="w-10 h-10 text-white" />
                {/* Pulse effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${stat.gradient}`}
                />
              </motion.div>

              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {stat.value}
              </h3>
              <p className="text-slate-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
