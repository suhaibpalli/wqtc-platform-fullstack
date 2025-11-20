'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart,
  Brain,
  Shield,
  Star,
  Lightbulb,
  Target,
  Users,
  BookOpen,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

// Updated gradients and palette per brand theme
const reasons = [
  {
    icon: Heart,
    title: 'Strengthen Your Faith',
    description: 'Understanding the Quran deepens your connection with Allah and reinforces your belief through His divine wisdom.',
    gradient: 'from-[#453142] to-[#6e4d66]',
  },
  {
    icon: Brain,
    title: 'Gain True Knowledge',
    description: 'Move beyond mere recitation to comprehend the profound meanings and guidance within every verse.',
    gradient: 'from-[#6e4d66] to-[#faf9f7]',
  },
  {
    icon: Shield,
    title: 'Find Life Guidance',
    description: 'Discover practical solutions to modern challenges through timeless Quranic wisdom and principles.',
    gradient: 'from-[#453142] to-[#faf9f7]',
  },
  {
    icon: Star,
    title: 'Fulfill Your Purpose',
    description: 'The Quran was revealed for understanding and reflection, not just melodious recitation.',
    gradient: 'from-[#6e4d66] to-[#453142]',
  },
  {
    icon: Lightbulb,
    title: 'Develop Critical Thinking',
    description: 'The Quran encourages reflection, contemplation, and intellectual growth in every verse.',
    gradient: 'from-[#fae7ef] to-[#6e4d66]',
  },
  {
    icon: Target,
    title: 'Achieve Inner Peace',
    description: 'Understanding Allah\'s words brings tranquility, clarity, and purpose to your daily life.',
    gradient: 'from-[#453142] to-[#faf9f7]',
  },
];

const verses = [
  {
    arabic: 'أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ',
    translation: 'Do they not then reflect on the Quran?',
    reference: 'Surah An-Nisa (4:82)',
  },
  {
    arabic: 'كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ',
    translation: 'A blessed Book which We have revealed to you, that they might reflect upon its verses',
    reference: 'Surah Sad (38:29)',
  },
  {
    arabic: 'إِنَّ فِي ذَٰلِكَ لَذِكْرَىٰ لِمَن كَانَ لَهُ قَلْبٌ',
    translation: 'Indeed in that is a reminder for whoever has a heart',
    reference: 'Surah Qaf (50:37)',
  },
];

const benefits = [
  'Make informed decisions based on divine guidance',
  'Strengthen family bonds through shared understanding',
  'Raise children with Quranic values and wisdom',
  'Navigate life challenges with confidence',
  'Deepen your prayers and worship',
  'Answer questions about your faith authentically',
  'Build a meaningful relationship with Allah',
  'Inspire others through your transformed character',
];

const myths = [
  {
    myth: 'Reading without understanding is enough',
    reality: 'Allah explicitly commands us to reflect and ponder over the Quran\'s meanings',
  },
  {
    myth: 'Arabic is too difficult to learn',
    reality: 'With the word-for-word method, anyone can understand Quranic Arabic systematically',
  },
  {
    myth: 'Only scholars can understand the Quran',
    reality: 'The Quran was revealed for all of humanity, and Allah made it easy to understand',
  },
  {
    myth: 'I need years of study to start',
    reality: 'You can begin understanding immediately with the right methodology and guidance',
  },
];

export default function WhyUnderstandQuranPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf9f7] to-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Updated gradient overlays to theme palette */}
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#6e4d66]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#453142]/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            <Badge className="mb-4 bg-[#453142]/90 text-[#faf9f7] px-4 py-2">
              Our Purpose
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[#453142] leading-tight">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6e4d66] to-[#453142]">Understanding</span> the Quran Matters
            </h1>
            
            <p className="text-xl text-[#453142]/80 leading-relaxed">
              The Quran is not just a book to be recited - it's Allah's direct message to guide, transform, and elevate your life. Discover why understanding its meanings is essential for every Muslim.
            </p>

            <Button size="lg" className="bg-[#453142] hover:bg-[#6e4d66] text-white shadow-lg mt-4 transition-colors">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Quranic Verses Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#453142] to-[#6e4d66] text-[#faf9f7]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Allah Commands Us to Reflect
            </h2>
            <p className="text-[#faf9f7]/80 text-lg max-w-2xl mx-auto">
              The Quran itself emphasizes the importance of understanding and contemplation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {verses.map((verse, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-[#faf9f7]/10 backdrop-blur-md border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <p className="text-2xl font-arabic text-right leading-relaxed">{verse.arabic}</p>
                    <p className="text-[#faf9f7]/90 italic text-lg">&ldquo;{verse.translation}&rdquo;</p>
                    <p className="text-sm text-[#faf9f7]/60">{verse.reference}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Reasons Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-[#453142]/10 text-[#453142]">Key Reasons</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#453142] mb-4">
              Transform Your Life Through Understanding
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${reason.gradient} rounded-2xl flex items-center justify-center`}>
                      <reason.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#453142]">{reason.title}</h3>
                    <p className="text-[#453142]/70 leading-relaxed">{reason.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-[#faf9f7]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge className="bg-[#6e4d66]/10 text-[#453142]">Life Benefits</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-[#453142]">
                Practical Benefits in Your Daily Life
              </h2>
              <p className="text-xl text-[#453142]/70">
                Understanding the Quran is not just spiritual - it transforms every aspect of your existence
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <CheckCircle2 className="h-6 w-6 text-[#6e4d66] flex-shrink-0 mt-0.5" />
                  <span className="text-[#453142] font-medium">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Myths vs Reality Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-[#453142]/10 text-[#453142]">Common Misconceptions</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-[#453142] mb-4">
              Breaking Down Barriers
            </h2>
            <p className="text-[#453142]/70 text-lg max-w-2xl mx-auto">
              Let's address common myths that prevent people from understanding the Quran
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {myths.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#6e4d66]" />
                      <div>
                        <h3 className="text-lg font-semibold text-[#6e4d66] mb-2">
                          Myth: {item.myth}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#453142]" />
                      <div>
                        <h3 className="text-lg font-semibold text-[#453142] mb-2">
                          Reality: {item.reality}
                        </h3>
                      </div>
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
            <BookOpen className="w-16 h-16 mx-auto text-[#faf9f7]/80" />
            <h2 className="text-3xl md:text-5xl font-bold">
              Begin Your Transformation Today
            </h2>
            <p className="text-xl text-[#faf9f7]/80">
              Join thousands who have discovered the life-changing power of understanding Allah's words
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#453142] hover:bg-[#faf9f7] transition-colors">
                Enroll for Free
              </Button>
              <Button size="lg" variant="outline" className="border-[#453142] text-[#453142] hover:bg-[#453142]/10 transition-colors">
                Learn Our Method
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
