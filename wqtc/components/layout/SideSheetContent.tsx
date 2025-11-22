"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

const socialLinks = [
  {
    href: "https://www.facebook.com/profile.php?id=100093641951236",
    icon: Facebook,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/wqtc2024",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/@WQTC-Chennai",
    icon: Youtube,
    label: "YouTube",
  },
];

export default function SideSheetContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "India",
    interest: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Compose payload to match backend schema requirements.
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        language: "English",
        classType: "General Interest",
        timing: "Flexible",
        days: "Flexible",
        contactNumber: formData.phone,
        additionalNotes: formData.interest ? `Interest: ${formData.interest}` : null,
        whatsapp: formData.phone, // safe fallback
      };

      await api.createRegistration(payload);

      setIsSuccess(true);
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "India",
          interest: "",
        });
        setIsSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside
      className="flex flex-col h-full bg-[#faf9f7] px-0 py-0 rounded-xl max-w-[560px] w-full"
      style={{ color: "#453142" }}
    >
      {/* Sheet Content Layout: main content scrollable, footer sticky */}
      <div className="flex-1 overflow-y-auto py-6 px-8 flex flex-col">
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#453142]/60 font-bold">
            WORD FOR WORD QURAN
          </p>
          <h2 className="text-2xl font-bold mt-2 text-[#453142]">
            Join Our Learning Program
          </h2>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-48 mt-6 mb-4 rounded-xl overflow-hidden ring-1 ring-[#453142]/10 shadow-md">
          <Image
            src="https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80"
            alt="Students learning the Quran"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
          />
        </div>

        {/* Description */}
        <p className="text-base leading-relaxed mb-5 text-[#453142]/80">
          Join thousands of students worldwide learning Quran translation through our immersive
          word-for-word methodology. Start your journey today!
        </p>

        {/* Registration Form */}
        <div className="flex-1 flex flex-col justify-start">
          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-3 w-full">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h3 className="text-lg font-bold text-green-700">Registration Successful!</h3>
              <p className="text-sm text-green-600">
                We&apos;ll contact you soon with program details.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 w-full"
              style={{ maxWidth: "100%" }}
            >
              {/* Name */}
              <div className="w-full">
                <label className="block text-sm font-semibold mb-1.5 text-[#453142]">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-1 focus:ring-[#453142] focus:border-transparent bg-white text-[#453142] placeholder:text-[#453142]/40 outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div className="w-full">
                <label className="block text-sm font-semibold mb-1.5 text-[#453142]">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-1 focus:ring-[#453142] focus:border-transparent bg-white text-[#453142] placeholder:text-[#453142]/40 outline-none transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone */}
              <div className="w-full">
                <label className="block text-sm font-semibold mb-1.5 text-[#453142]">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-1 focus:ring-[#453142] focus:border-transparent bg-white text-[#453142] placeholder:text-[#453142]/40 outline-none transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Country */}
              <div className="w-full">
                <label className="block text-sm font-semibold mb-1.5 text-[#453142]">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-1 focus:ring-[#453142] focus:border-transparent bg-white text-[#453142] outline-none transition-all"
                >
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Interest */}
              <div className="w-full">
                <label className="block text-sm font-semibold mb-1.5 text-[#453142]">
                  What interests you? (Optional)
                </label>
                <textarea
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-[#453142]/20 rounded-lg focus:ring-1 focus:ring-[#453142] focus:border-transparent bg-white text-[#453142] placeholder:text-[#453142]/40 resize-none outline-none transition-all"
                  placeholder="e.g., Quran translation course, Tajweed classes..."
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#453142] text-[#faf9f7] font-semibold py-6 hover:bg-[#5a3f54] transition-colors shadow-md disabled:opacity-70 text-lg mt-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Register Now"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Sheet footer: Social, contact, CTA */}
      <div className="flex-shrink-0 pt-4 pb-6 px-8 bg-[#faf9f7] border-t border-[#453142]/10">
        {/* Social Links */}
        <div className="mb-4">
          <h3 className="font-semibold mb-3 text-base text-[#453142]">
            Connect With Us
          </h3>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                className="p-2.5 rounded-full bg-[#453142]/10 text-[#453142] hover:bg-[#453142] hover:text-white transition-all duration-200"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-base text-[#453142]">
            Contact Us
          </h3>
          <div className="text-sm space-y-2 text-[#453142]/80">
            <p className="flex items-center gap-2">
              <span className="font-medium">📞</span> +91 44 4776 6611
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">✉️</span> info@wordforwordquran.com
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="w-full border-[#453142] text-[#453142] hover:bg-[#453142] hover:text-white"
        >
          <Link href="/online-courses">View All Courses</Link>
        </Button>
      </div>
    </aside>
  );
}
