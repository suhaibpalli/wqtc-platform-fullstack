'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target,
  Eye,
  Heart,
  Globe,
  Users,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const visionPoints = [
  {
    icon: Globe,
    title: 'Global Accessibility',
    description: 'Make Quranic understanding accessible to every Muslim, regardless of location, language, or background.',
  },
  {
    icon: Users,
    title: 'Community Building',
    description: 'Create a worldwide community of Quran learners united by understanding and reflection.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation in Education',
    description: 'Lead the transformation of Islamic education through innovative, student-centric methodologies.',
  },
  {
    icon: Heart,
    title: 'Spiritual Connection',
    description: 'Foster deep, personal relationships between believers and the divine message of Allah.',
  },
];

const missions = [
  {
    icon: BookOpen,
    title: 'Simplify Learning',
    description: 'Break down complex Arabic grammar into simple, digestible word-for-word translations that anyone can master.',
    color: 'from-[#453142] to-[#6e4d66]',
  },
  {
    icon: Users,
    title: 'Free Education',
    description: 'Provide completely free, high-quality Quran education to remove financial barriers to knowledge.',
    color: 'from-[#6e4d66] to-[#8b6f85]',
  },
  {
    icon: Target,
    title: 'Comprehensive Curriculum',
    description: 'Develop systematic courses covering complete Juz-by-Juz translation with structured learning paths.',
    color: 'from-[#453142] to-[#5a3f54]',
  },
  {
    icon: Globe,
    title: 'Digital Platform',
    description: 'Leverage technology to reach millions through online classes, videos, and interactive learning tools.',
    color: 'from-[#5a3f54] to-[#6e4d66]',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Improvement',
    description: 'Constantly evolve our teaching methods based on student feedback and educational research.',
    color: 'from-[#6e4d66] to-[#453142]',
  },
  {
    icon: Award,
    title: 'Quality Assurance',
    description: 'Maintain highest standards of authenticity, accuracy, and scholarly integrity in all materials.',
    color: 'from-[#8b6f85] to-[#453142]',
  },
];

const values = [
  'Sincerity (Ikhlas) - Teaching purely for Allah\'s pleasure',
  'Excellence (Ihsan) - Delivering the best quality education',
  'Accessibility - Making knowledge free and available to all',
  'Authenticity - Staying true to classical Islamic scholarship',
  'Innovation - Embracing modern tools while honoring tradition',
  'Community - Building supportive learning networks',
  'Patience - Understanding that learning is a journey',
  'Gratitude - Appreciating the blessing of Quranic knowledge',
];

const milestones = [
  { year: '2025', goal: 'Reach 100,000 active students globally' },
  { year: '2026', goal: 'Complete translation courses for all 30 Juz' },
  { year: '2027', goal: 'Launch mobile app with offline learning' },
  { year: '2028', goal: 'Establish physical learning centers in 10 countries' },
  { year: '2030', goal: 'Impact 1 million lives with Quranic understanding' },
];

export default function VisionMissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#453142]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6e4d66]/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            <Badge className="mb-4 bg-[#453142] text-[#faf9f7] px-4 py-2">
              Our Direction
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[#453142] leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#453142] to-[#6e4d66]">Vision</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6e4d66] to-[#8b6f85]">Mission</span>
            </h1>
            
            <p className="text-xl text-[#453142]/80 leading-relaxed">
              Empowering millions to understand and live by the Quran through innovative education and unwavering commitment to accessibility
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Eye className="w-16 h-16 mx-auto mb-4 text-[#453142]" />
            <Badge className="mb-4 bg-[#453142]/10 text-[#453142]">Our Vision</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#453142] mb-4">
              A World Where Every Muslim Understands the Quran
            </h2>
            <p className="text-xl text-[#453142]/70 max-w-3xl mx-auto">
              We envision a global community where understanding the Quran is not a privilege but a reality for every Muslim, transforming lives through divine wisdom
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
            {visionPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#453142] to-[#6e4d66] rounded-xl flex items-center justify-center flex-shrink-0">
                        <point.icon className="h-6 w-6 text-[#faf9f7]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#453142] mb-2">{point.title}</h3>
                        <p className="text-[#453142]/70">{point.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#faf9f7] to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Target className="w-16 h-16 mx-auto mb-4 text-[#6e4d66]" />
            <Badge className="mb-4 bg-[#6e4d66]/10 text-[#6e4d66]">Our Mission</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#453142] mb-4">
              How We're Making It Happen
            </h2>
            <p className="text-xl text-[#453142]/70 max-w-3xl mx-auto">
              Strategic initiatives driving our vision into reality, one student at a time
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {missions.map((mission, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                  <div className={`h-2 bg-gradient-to-r ${mission.color}`} />
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${mission.color} rounded-xl flex items-center justify-center mb-4`}>
                      <mission.icon className="h-7 w-7 text-[#faf9f7]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#453142] mb-2">{mission.title}</h3>
                    <p className="text-[#453142]/70 leading-relaxed">{mission.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#6e4d66]" />
            <Badge className="mb-4 bg-[#6e4d66]/10 text-[#6e4d66]">Core Values</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#453142] mb-4">
              Principles That Guide Us
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 bg-gradient-to-r from-[#faf9f7] to-white p-4 rounded-lg border border-[#453142]/10 hover:border-[#453142]/30 transition-colors"
                >
                  <CheckCircle2 className="h-6 w-6 text-[#6e4d66] flex-shrink-0" />
                  <span className="text-[#453142] font-medium">{value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#faf9f7] to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-[#6e4d66]" />
            <Badge className="mb-4 bg-[#6e4d66]/10 text-[#6e4d66]">Roadmap</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#453142] mb-4">
              Our Journey Ahead
            </h2>
            <p className="text-xl text-[#453142]/70 max-w-3xl mx-auto">
              Ambitious goals driving us toward a future where Quranic understanding is universal
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 pb-10 border-l-4 border-[#453142]/20 last:pb-0"
              >
                <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#453142] to-[#6e4d66] flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-[#faf9f7] rounded-full" />
                </div>

                <Card className="ml-8 border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <Badge className="mb-2 bg-[#453142]/10 text-[#453142]">{milestone.year}</Badge>
                        <p className="text-lg font-semibold text-[#453142]">{milestone.goal}</p>
                      </div>
                      <ArrowRight className="h-6 w-6 text-[#453142]/40" />
                    </div>
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
            <Heart className="w-16 h-16 mx-auto text-[#faf9f7]/80" />
            <h2 className="text-3xl md:text-5xl font-bold">
              Be Part of This Global Movement
            </h2>
            <p className="text-xl text-[#faf9f7]/80">
              Join thousands of students worldwide in making Quranic understanding a reality for all
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-[#faf9f7] text-[#453142] hover:bg-white">
                Start Learning Now
              </Button>
              <Button size="lg" variant="outline" className="border-[#faf9f7] text-[#faf9f7] hover:bg-[#faf9f7]/10">
                Support Our Mission
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
