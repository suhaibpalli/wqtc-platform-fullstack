'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const socialMedia = [
  { icon: Facebook, name: 'Facebook', link: 'https://www.facebook.com/profile.php?id=100093641951236', color: '#1877F2' },
  { icon: Instagram, name: 'Instagram', link: 'https://www.instagram.com/wqtc2024', color: '#E4405F' },
  { icon: Youtube, name: 'YouTube', link: 'https://www.youtube.com/@WQTC-Chennai', color: '#FF0000' },
  { icon: MessageCircle, name: 'WhatsApp', link: '#', color: '#25D366' },
];

const faqs = [
  {
    question: 'Are the classes really free?',
    answer: 'Yes! All our classes are 100% free. We believe Quranic education should be accessible to everyone.',
  },
  {
    question: 'Do I need prior Arabic knowledge?',
    answer: 'Not at all! Our word-for-word method is designed for complete beginners with zero Arabic background.',
  },
  {
    question: 'How do I join classes?',
    answer: "Simply fill out the form below and we'll send you all the details via email.",
  },
  {
    question: 'Are recordings available?',
    answer: 'Yes, all live classes are recorded and available for students to review at their convenience.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
    joinClasses: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Placeholder for actual API call, replace with fetch/axios call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSuccess(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: '',
        message: '',
        joinClasses: true,
      });
      setIsSuccess(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

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
            <Badge className="mb-4 bg-[#453142] text-[#faf9f7] px-4 py-2">Get In Touch</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-[#453142] leading-tight">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6e4d66] to-[#453142]">Connect</span>
            </h1>
            <p className="text-xl text-[#453142]/80 leading-relaxed">
              Have questions? Want to join our classes? We're here to help you begin your Quranic journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-[#453142] mb-2">Send Us a Message</h2>
                    <p className="text-[#453142]/70">Fill out the form and we'll get back to you within 24 hours.</p>
                  </div>
                  {isSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                      <CheckCircle2 className="w-16 h-16 text-[#453142] mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-[#453142] mb-2">Message Sent!</h3>
                      <p className="text-[#453142]/70">We'll get back to you soon via email.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-[#453142] font-medium mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-2 focus:ring-[#453142] focus:border-transparent transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-[#453142] font-medium mb-2">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-2 focus:ring-[#453142] focus:border-transparent transition-all"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-[#453142] font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-2 focus:ring-[#453142] focus:border-transparent transition-all"
                          placeholder="+1 234 567 8900"
                        />
                      </div>

                      <div>
                        <label className="block text-[#453142] font-medium mb-2">Country *</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-2 focus:ring-[#453142] focus:border-transparent transition-all"
                        >
                          <option value="">Select your country</option>
                          <option value="India">India</option>
                          <option value="USA">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="UAE">United Arab Emirates</option>
                          <option value="Saudi Arabia">Saudi Arabia</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#453142] font-medium mb-2">Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-2 focus:ring-[#453142] focus:border-transparent transition-all resize-none"
                          placeholder="Tell us how we can help you..."
                        />
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-[#6e4d66]/10 rounded-lg border border-[#6e4d66]/30">
                        <input
                          type="checkbox"
                          name="joinClasses"
                          checked={formData.joinClasses}
                          onChange={handleChange}
                          id="joinClasses"
                          className="mt-1 w-5 h-5 text-[#453142] border-[#453142]/30 rounded focus:ring-[#453142]"
                        />
                        <label htmlFor="joinClasses" className="text-[#453142] text-sm cursor-pointer">
                          <strong>Yes, I want to join WQTC classes!</strong>
                          <br />
                          <span className="text-[#453142]/70">
                            Send me details about upcoming classes, schedules, and learning materials
                          </span>
                        </label>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#453142] to-[#6e4d66] hover:from-[#2d1c26] hover:to-[#453142] text-white py-6 text-lg font-semibold shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Side - Social, Contact Info & FAQs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Social Media & Contact Info */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-2xl font-bold text-[#453142]">Connect With Us</h3>
                  <p className="text-[#453142]/70 mb-6">Follow us on social media for updates, tips, and inspiration</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {socialMedia.map((social) => (
                      <motion.a
                        key={social.name}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#453142]/10 hover:border-[#453142]/30 transition-all"
                        style={{ borderLeftColor: social.color, borderLeftWidth: '4px' }}
                      >
                        <social.icon className="h-6 w-6" style={{ color: social.color }} />
                        <span className="font-medium text-[#453142]">{social.name}</span>
                      </motion.a>
                    ))}
                  </div>

                  {/* Contact Info Block */}
                  <div className="pt-6 space-y-4">
                    <div className="flex items-center gap-3 text-[#453142] text-sm">
                      <Mail className="h-5 w-5" />
                      <a href="mailto:support@wqtc.org" className="hover:underline">
                        support@wqtc.org
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-[#453142] text-sm">
                      <Phone className="h-5 w-5" />
                      <a href="tel:+919876543210" className="hover:underline">
                        +91 98765 43210
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-[#453142] text-sm">
                      <MapPin className="h-5 w-5" />
                      <span>Chennai, Tamil Nadu, India</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#453142] text-sm">
                      <Clock className="h-5 w-5" />
                      <span>Mon-Fri: 9AM - 6PM IST</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQs */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-[#453142] mb-6">Quick Questions</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-[#453142]/10 last:border-0 pb-4 last:pb-0"
                      >
                        <h4 className="font-semibold text-[#453142] mb-2">{faq.question}</h4>
                        <p className="text-[#453142]/70 text-sm">{faq.answer}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
