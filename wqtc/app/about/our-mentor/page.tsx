"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap,
  Users, 
  Globe, 
  Heart,
  Quote,
  Play
} from 'lucide-react';
// DO NOT import or use next/image for external unconfigured sources
// import Image from 'next/image';

// No statistics/achievements now

const timeline = [
  {
    year: '2008',
    title: 'The Beginning',
    description: 'Started teaching Quran translation in Chennai with a small group of dedicated students.',
  },
  {
    year: '2012',
    title: 'Word-for-Word Method',
    description: 'Developed the revolutionary word-for-word concept that makes Quranic Arabic accessible to everyone.',
  },
  {
    year: '2018',
    title: 'Global Expansion',
    description: 'Expanded classes to USA, UK, and Middle East through online and in-person sessions.',
  },
  {
    year: '2024',
    title: 'WQTC Platform',
    description: 'Launched comprehensive digital platform making free Quran education accessible globally.',
  },
];

const qualities = [
  {
    title: 'Passionate Educator',
    description: 'Dedicated to making Quranic knowledge accessible to every Muslim, regardless of background.',
    icon: Heart,
  },
  {
    title: 'Innovative Methodology',
    description: 'Pioneer of the word-for-word translation approach that simplifies Arabic learning.',
    icon: GraduationCap,
  },
  {
    title: 'Global Impact',
    description: 'Teaching students across continents through online and offline classes.',
    icon: Globe,
  },
  {
    title: 'Community Builder',
    description: 'Creating lasting connections between students and the Quran through systematic learning.',
    icon: Users,
  },
];

export default function OurMentorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-[#faf9f7]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#453142]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#453142]/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Badge className="bg-[#453142] text-[#faf9f7] px-4 py-2">
                Our Beloved Mentor
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-[#453142] leading-tight">
                Ustaad <span className="text-[#453142] bg-clip-text">Imran</span> <span className="text-[#453142] bg-clip-text">Sait</span>
              </h1>
              
              <p className="text-xl text-[#453142]/80 leading-relaxed">
                The visionary founder of WQTC, revolutionizing Quran education through his innovative word-for-word translation methodology. With over 15 years of dedication, Ustaad Imran has transformed how millions understand the divine message.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-[#453142] hover:bg-[#2d1c26] text-[#faf9f7] shadow-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Introduction
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-[#453142] text-[#453142] hover:bg-[#453142]/10"
                >
                  Join His Classes
                </Button>
              </div>

              {/* No Quick Stats */}
            </motion.div>

            {/* Right - Actual Ustaad Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Replace next/image usage with native <img> for unconfigured external src */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-[#faf9f7]">
                <img
                  src="https://wordforwordquran.amlc.in/wp-content/uploads/2025/09/Kd2k4nPY_NA-HD.jpg"
                  alt="Ustaad Imran Sait"
                  className="object-cover w-full h-full absolute inset-0"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  loading="eager"
                  fetchPriority="high"
                />
                {/* Overlay Quote Card */}
                <div className="absolute bottom-8 left-8 right-8 bg-[#faf9f7]/95 backdrop-blur-md rounded-xl p-6 shadow-xl border border-[#453142]/10">
                  <Quote className="h-8 w-8 text-[#453142] mb-2" />
                  <p className="text-[#453142] italic font-medium">
                    "Understanding the Quran is not just about translation - it's about transforming lives."
                  </p>
                  <p className="text-[#453142]/60 text-sm mt-2">- Ustaad Imran Sait</p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#453142] to-[#6e4d66] text-[#faf9f7] px-6 py-3 rounded-full shadow-lg font-bold">
                15+ Years Experience
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-16 md:py-24 bg-[#faf9f7]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-[#453142]/10 text-[#453142]">Biography</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-[#453142] mb-4">
                The Journey of a Visionary
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-[#453142]/80 space-y-6">
              <p className="text-xl leading-relaxed">
                Ustaad Imran Sait's journey with the Quran began in his youth, where he developed a profound connection with the divine words. Born and raised in Chennai, India, his passion for Islamic education led him to pursue in-depth studies in Quranic Arabic, Tafsir, and pedagogy.
              </p>

              <p className="leading-relaxed">
                Recognizing the challenges faced by non-Arabic speakers in understanding the Quran, Ustaad Imran dedicated himself to finding a solution. After years of research and experimentation, he developed the revolutionary <strong>Word-for-Word Translation Concept</strong> - a methodology that breaks down Quranic verses into individual words, making Arabic vocabulary and sentence structure easily comprehensible.
              </p>

              <p className="leading-relaxed">
                What started as informal sessions in a small mosque in Chennai has now grown into a global movement. Ustaad Imran's classes have reached students across India, USA, UK, Middle East, and Southeast Asia. His approach combines traditional Islamic scholarship with modern educational techniques, making the Quran accessible to people of all ages and backgrounds.
              </p>

              <Card className="bg-gradient-to-r from-[#faf9f7] to-[#faf9f7] border-l-4 border-[#453142] my-8">
                <CardContent className="p-6">
                  <p className="text-[#453142] leading-relaxed italic">
                    "My mission is simple: to help every Muslim develop a personal, meaningful relationship with the Quran by understanding its message in their own language. When you understand what Allah is saying to you, your life transforms."
                  </p>
                  <p className="text-[#453142]/60 text-sm mt-3">- Ustaad Imran Sait</p>
                </CardContent>
              </Card>

              <p className="leading-relaxed">
                Beyond teaching, Ustaad Imran is a prolific author, having written several books and study materials on Quranic translation. He regularly delivers lectures at Islamic conferences, community centers, and online platforms, inspiring thousands to embark on their own journey of understanding the Quran.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#faf9f7] to-[#faf9f7]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-[#453142] text-[#faf9f7]">Journey</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#453142] mb-4">
              Milestones & Achievements
            </h2>
            <p className="text-[#453142]/70 text-lg max-w-2xl mx-auto">
              A timeline of dedication, innovation, and global impact
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 pb-12 border-l-4 border-[#453142]/20 last:pb-0"
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#453142] to-[#6e4d66] flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-[#faf9f7] rounded-full" />
                </div>

                <div className="ml-8">
                  <Badge className="mb-2 bg-[#453142]/10 text-[#453142]">{item.year}</Badge>
                  <h3 className="text-2xl font-bold text-[#453142] mb-2">{item.title}</h3>
                  <p className="text-[#453142]/70 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualities Section */}
      <section className="py-16 md:py-24 bg-[#faf9f7]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-[#453142]/10 text-[#453142]">Qualities</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#453142] mb-4">
              What Makes Him Special
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {qualities.map((quality, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-[#faf9f7]">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#453142] to-[#6e4d66] rounded-2xl flex items-center justify-center">
                      <quality.icon className="h-8 w-8 text-[#faf9f7]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#453142]">{quality.title}</h3>
                    <p className="text-[#453142]/70">{quality.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#453142] to-[#6e4d66] text-[#faf9f7]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold">
              Join Thousands of Students Worldwide
            </h2>
            <p className="text-xl text-[#faf9f7]/80">
              Begin your transformative journey of understanding the Quran with Ustaad Imran Sait
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-[#faf9f7] text-[#453142] hover:bg-[#f3eae8]">
                Enroll Now - Free
              </Button>
              <Button size="lg" variant="outline" className="border-[#faf9f7] text-[#faf9f7] hover:bg-[#faf9f7]/10">
                View Class Schedule
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
