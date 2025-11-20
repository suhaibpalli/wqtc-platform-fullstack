"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const galleryImages = [
  { id: 1, gradient: "from-blue-500 to-purple-600" },
  { id: 2, gradient: "from-purple-500 to-pink-600" },
  { id: 3, gradient: "from-orange-500 to-red-600" },
  { id: 4, gradient: "from-cyan-500 to-blue-600" },
  { id: 5, gradient: "from-teal-500 to-green-600" },
  { id: 6, gradient: "from-indigo-500 to-purple-600" },
  { id: 7, gradient: "from-pink-500 to-rose-600" },
  { id: 8, gradient: "from-amber-500 to-orange-600" },
];

const blogPosts = [
  {
    id: 1,
    title: "Facebook design is dedicated and Inspired by future tech",
    date: "10 Dec",
    category: "Design",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    id: 2,
    title: "Facebook design is dedicated and Inspired by future tech",
    date: "10 Dec",
    category: "Development",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: 3,
    title: "Facebook design is dedicated and Inspired by future tech",
    date: "10 Dec",
    category: "Technology",
    gradient: "from-purple-600 to-pink-600",
  },
];

export default function ScholarSection() {
  return (
    <>
      {/* Image Gallery Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="aspect-square overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300">
                  <div className={`w-full h-full bg-gradient-to-br ${image.gradient} group-hover:scale-110 transition-transform duration-500`}>
                    <div className="w-full h-full flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                      {/* Placeholder for actual images */}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News & Blogs Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Latest News & Blogs
            </h2>
            <p className="text-slate-600 text-lg">
              Stay updated with our latest articles and insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <div className={`h-48 bg-gradient-to-br ${post.gradient} group-hover:scale-105 transition-transform duration-500`}>
                    <div className="w-full h-full flex items-center justify-center bg-black/20">
                      {/* Placeholder for blog images */}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-slate-600">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
              size="lg"
            >
              View all
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
