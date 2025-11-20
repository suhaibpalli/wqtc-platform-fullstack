"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Facebook, Instagram, Youtube, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useSlideOver } from "@/components/context/SlideOverContext"
import SideSheetContent from "@/components/layout/SideSheetContent"

const aboutMenuItems = [
  { label: 'Our Mentor', href: '/about/our-mentor' },
  { label: 'Why Understand Quran', href: '/about/why-understand-quran' },
  { label: 'Vision & Mission', href: '/about/vision-mission' },
]

// NOTE: "Contact Us" has been moved out of navLinks; "Online Courses" is now handled separately in both desktop and mobile menus.
const navLinks = [
  { href: "/", label: "Home" },
  {
    label: "Translations",
    submenu: [
      { href: "/library/ebooks", label: "English" },
      { href: "/library/ebooks-urdu", label: "Urdu" },
    ],
  },
  {
    label: "Resource Library",
    submenu: [
      { href: "/library/videos", label: "Video Library" },
      { href: "/library/audio", label: "Audio Library" },
      { href: "/library/ebooks", label: "EBooks" },
    ],
  }
  // "Online Courses" is now handled as a dedicated dropdown below navLinks
  // "Contact Us" will come after "Online Courses"
]

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
]

// Filter options for online courses
const onlineCourseFilters = [
  { label: "All Courses", filter: "all" },
  { label: "Men's Courses", filter: "men" },
  { label: "Women's Courses", filter: "women" },
  { label: "Weekend Courses", filter: "weekend" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Split desktop vs mobile dropdown state (no collision)
  const [desktopOpenDropdown, setDesktopOpenDropdown] = useState<string | null>(null)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)

  const { openSlideOver } = useSlideOver();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#453142] backdrop-blur supports-[backdrop-filter]:bg-[#453142]">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - UPDATED WITH SVG */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-16 w-16 flex items-center justify-center transition-transform group-hover:scale-105">
              <svg
                viewBox="0 0 1200 900"
                className="h-full w-full text-[#e0def4]"
                fill="currentColor"
                aria-label="WQTC Logo"
              >
                <g>
                  {/* unchanged SVG (only color updated above) */}
                  <path d="M637.9,563.7c-4.4,1.7-8.9,3.3-13.6,5.1c0-52.2,0-104.1,0-156.6c15.6-5,31.3-10.1,47-15.2
                    c30.4-9.8,60.8-19.6,91.2-29.2c2.2-0.7,5.4-0.8,7.3,0.2c42.9,24.6,85.6,49.3,128.4,74.1c0.7,0.4,1.4,1,2.5,1.7
                    c-3.2,2-6.1,3.8-9,5.7c-12.8,5.7-25.7,11.3-38.5,17.1c-17.2,7.8-34.2,15.7-51.4,23.5c-28.9,13-57.9,25.9-86.8,38.9
                    C689.3,540.4,663.6,552.1,637.9,563.7z" />
                  <path d="M288.8,249.3c4.2-3.8,7.4-8.8,14.1-9.3c4.3-0.3,7.5,0.3,9.6,4.5c7.3,14.3,14.8,28.5,22,42.8
                    c6.5,12.9,12.7,26,19.1,39c0.4,0.9,1.3,1.5,2.5,2.9c0.5-1.8,1-2.8,1-3.9c0.4-26.3,0.6-52.6,1-78.9c0.1-3.5,0.5-7.1,1.1-10.5
                    c1.3-7.1,8-12.6,16.3-13.9c8.4-1.4,12.6,0.7,16.9,8.4c13.1,23.2,26.1,46.5,39.1,69.7c1.6,2.8,2.9,5.8,5,10c0.8-2.5,1.5-3.5,1.4-4.5
                    c-0.6-29.1-1.2-58.2-1.8-87.3c-0.1-7.1,3.3-11.8,9.4-13.7c9-2.7,14.4,0.5,16,9.8c0.5,3.1,0.8,6.3,0.9,9.5c0.1,35,0.1,70,0,105
                    c0,2.5-0.1,5-0.3,7.4c-1.1,8.8-5.1,13.6-12.8,15.5c-7.9,1.9-14.4-0.5-18.8-8.3c-13.7-24.1-27.1-48.3-40.6-72.5
                    c-2.5-4.5-5-9-7.5-13.5c-0.6,0.2-1.2,0.3-1.8,0.5c0,7.7,0.1,15.3,0,23c-0.5,23.1-1.4,46.2-1.6,69.3c-0.1,11.1-3.1,19.8-14.8,23.1
                    c-2.5,0-4.9,0-7.4,0c-3.9-4.1-9.1-7.5-11.6-12.3c-19-35.7-37.5-71.6-56.2-107.5C288.8,252.1,288.8,250.7,288.8,249.3z" />
                  <path d="M496.6,263.5c1.9-9.1,2.9-18.4,5.9-27.1c8.5-24.2,26.2-37.8,51.6-41.4c13.9-2,27.6-1,40.9,3.1
                    c10.2,3.1,18.8,9.3,24.8,18.2c18.1,27,19.9,55.8,8.3,85.7c-1.6,4.2-4.5,8-7.1,11.7c-2.3,3.2-1.4,4.4,1.9,5.8
                    c5.8,2.5,11.5,5.3,17.1,8.3c5.1,2.6,7,7.4,5.2,11.8c-2,4.8-6.9,7.6-12.2,5.4c-8.2-3.5-16.2-7.7-23.9-12.2c-3.8-2.3-6.6-2.7-11-1
                    c-19,7.6-38.6,8.5-58,2c-24.1-8.1-40.9-33.1-41.8-60.8c-0.1-3,0-6,0-9C497.6,263.7,497.1,263.6,496.6,263.5z M583.2,312.5
                    c-0.1-0.5-0.1-1-0.2-1.6c-6.3-3.1-12.7-5.9-18.8-9.3c-2.1-1.2-4.9-4.9-4.4-6c1.2-2.5,4-5.1,6.6-5.8c3-0.7,6.8-0.1,9.8,1.1
                    c5.2,2.1,10.2,4.8,15.1,7.7c6.2,3.7,6.8,3.8,10-2.6c1.3-2.7,2.5-5.5,3.2-8.4c3.6-16,3.4-31.8-2.1-47.4c-5.9-16.4-19.1-25.4-37-25.4
                    c-17.1,0-30.2,9.2-35.7,25.6c-5.6,16.8-5.2,33.8,1,50.3c7.2,19.1,28.6,29.8,47.2,24.2C579.8,314.5,581.5,313.4,583.2,312.5z" />
                  <path d="M825.7,359.5c-37.7,0-63.3-24.4-66-62.2c-1.3-18.5,1.2-35.9,11.2-51.7c15.4-24.4,45.7-35.2,75.4-27
                    c18.1,5,31.1,15.5,36.4,34c2,7-0.7,13.1-6.4,15.6c-5.7,2.5-11.4,0.5-15.3-5.5c-1.6-2.5-3-5.2-4.5-7.8
                    c-7.1-12.5-17.7-18.8-32.2-18.2c-13.8,0.6-24.3,7.1-30,19.4c-9.6,20.9-10.4,42.6-0.6,63.5c6.5,13.9,19,19.8,34.4,19.2
                    c14.2-0.6,23.9-7.7,29.6-20.4c1.2-2.7,2.2-5.6,3.5-8.3c3.2-6.6,9-9.3,15.7-7.4c4.4,1.3,7.2,6.1,6.6,13.1c-1.2,14.2-9,24.7-20,32.9
                    C852.5,356.8,839.5,359.9,825.7,359.5z" />
                  <path d="M721.2,221.7c-0.6,8.8-1.3,17.2-1.8,25.6c-1.5,25.9-3,51.8-4.4,77.6c-0.5,8.1-4.1,13.2-10.5,14.8
                    c-8.8,2.1-17-3.5-16.9-12.5c0.1-13.2,1-26.4,1.7-39.6c0.4-8.4,1.2-16.9,1.7-25.3c0.7-11.2,1.4-22.5,2.1-33.8c0-0.4,0-0.7,0.1-1.1
                    c1-7.7,1-7.6-7.2-8c-9.5-0.5-19-1-28.5-2.2c-5.4-0.6-8.7-4.9-8.8-9.6c-0.1-4.7,3.1-9.1,8.1-10.5c2.5-0.7,5.2-0.9,7.8-0.8
                    c4.6,0.1,9.2,0.5,13.7,0.8c26.3,1.5,52.5,3,78.8,4.6c7.3,0.4,10,3.5,10.1,10.8c0,6.7-4.4,10.9-12.2,10.9
                    c-8.1-0.1-16.2-0.8-24.3-1.2C727.7,222,724.7,221.9,721.2,221.7z" />
                  <path d="M584.3,566.6c-92.4-41.3-183.5-82.1-274.9-123c1.6-0.9,3.2-1.9,4.9-2.9c42.5-23.5,85-46.9,127.4-70.5
                    c3.2-1.8,5.9-2.1,9.4-1c43.7,13.9,87.4,27.7,131.1,41.6c1.3,0.4,2.6,0.9,3.7,1.3C585.5,463.4,584.9,514.5,584.3,566.6z" />
                  <path d="M1159.3,456.9c-0.2,1.8-0.4,3.4-0.7,5.4c-16.1,6-32.8,12.3-49.5,18.5c-287.3,107.4-574.6,214.7-861.9,322
                    c-2.2,0.8-5.5,1.6-7.2,0.6c-4.3-2.5-3.2-7.4,1.9-9.9c25.5-12.5,51.1-24.9,76.6-37.4c94-46,188.1-91.9,282.1-137.9
                    c99.9-48.8,199.8-97.6,299.8-146.4c6.5-3.2,13.4-5.8,19.5-9.6c11.2-7,23.1-6.8,35.7-6c17.1,1,34.3,0.5,51.4,0.5
                    c49.3,0.1,98.6,0.1,147.9,0.1C1156.6,456.9,1158.4,456.9,1159.3,456.9z" />
                  <path d="M270.8,457.1c7.5,3.9,15,7.8,22.5,11.6c222.4,108.9,444.8,217.7,667.3,326.5c1.9,0.9,3.9,1.5,5.8,2.3
                    c-0.4,2.8-0.7,5.7-1.1,8.5c-1.5-0.8-2.8-1.9-4.4-2.5c-225.3-84.4-450.6-168.8-675.9-253.2c-80.6-30.2-161.1-60.3-241.7-90.4
                    c-0.5-0.2-0.9-0.5-2.7-1.5c8.9,0,16.5,0,24,0c35.5-0.1,71-0.1,106.5-0.3c23.8-0.1,47.7-0.2,71.5-0.4c1.9,0,3.8-0.5,5.7-0.7
                    C256,457.1,263.4,457.1,270.8,457.1z" />
                </g>
              </svg>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              key="/"
              href="/"
              className="text-lg text-[#e0def4] hover:text-[#cdabff] transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#cdabff] group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* ABOUT Dropdown using shared wrapper for robust hover + focus management */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                className="text-lg text-[#e0def4] font-semibold hover:text-[#cdabff] transition-colors flex items-center gap-1 bg-transparent border-none outline-none"
                aria-haspopup="true"
                aria-expanded={aboutDropdownOpen}
                tabIndex={0}
                onFocus={() => setAboutDropdownOpen(true)}
                onBlur={() => setAboutDropdownOpen(false)}
                type="button"
              >
                About Us
                <ChevronDown className="h-5 w-5" />
              </button>
              <div
                className={`
                  absolute left-0 top-full w-64 bg-[#faf9f7] rounded-lg mt-2 shadow-xl border border-[#453142]/20 z-50 py-2
                  transition-all duration-200
                  ${aboutDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
                `}
                tabIndex={-1}
              >
                {aboutMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-5 py-3 text-base text-[#453142] font-medium hover:bg-[#453142] hover:text-[#faf9f7] transition-colors rounded-md mx-1"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Resource Library and Translations nav items (Online Courses, Contact Us handled separately) */}
            {navLinks
              .filter((link) => link.label !== "Home")
              .map((link) =>
                link.submenu ? (
                  <div
                    key={link.label}
                    className="relative group"
                    onMouseEnter={() => setDesktopOpenDropdown(link.label)}
                    onMouseLeave={() => setDesktopOpenDropdown(null)}
                  >
                    <button className="text-lg text-[#e0def4] hover:text-[#cdabff] transition-colors flex items-center gap-1">
                      {link.label}
                      <ChevronDown className="h-5 w-5" />
                    </button>
                    <div
                      className={`absolute left-0 top-full mt-2 w-64 bg-[#faf9f7] rounded-lg shadow-xl border border-[#453142]/20 py-2 transition-all duration-200 ${
                        desktopOpenDropdown === link.label
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }`}
                    >
                      {link.submenu.map((sublink, i) => (
                        <Link
                          key={`${sublink.href}|${sublink.label}|${i}`}
                          href={sublink.href}
                          className="block px-5 py-3 text-base text-[#453142] font-medium hover:bg-[#453142] hover:text-[#faf9f7] transition-colors rounded-md mx-1"
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null // skip non-submenu here, Contact Us handled below
              )}

            {/* Online Courses filter (Desktop) as dropdown for category filtering */}
            <div
              className="relative group"
              onMouseEnter={() => setDesktopOpenDropdown("Online Courses")}
              onMouseLeave={() => setDesktopOpenDropdown(null)}
            >
              <button className="text-lg text-[#e0def4] hover:text-[#cdabff] transition-colors flex items-center gap-1">
                Online Courses
                <ChevronDown className="h-5 w-5" />
              </button>
              <div
                className={`absolute left-0 top-full mt-2 w-64 bg-[#faf9f7] rounded-lg shadow-xl border border-[#453142]/20 py-2 transition-all duration-200 ${
                  desktopOpenDropdown === "Online Courses"
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                {onlineCourseFilters.map((filterLink) => (
                  <Link
                    key={filterLink.filter}
                    href={`/online-courses?filter=${filterLink.filter}`}
                    className="block px-5 py-3 text-base text-[#453142] font-medium hover:bg-[#453142] hover:text-[#faf9f7] transition-colors rounded-md mx-1"
                  >
                    {filterLink.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Us always last */}
            <Link
              key="/contact"
              href="/contact"
              className="text-lg text-[#e0def4] hover:text-[#cdabff] transition-colors relative group"
            >
              Contact Us
              <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#cdabff] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Social Icons, Opener Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Social Icons */}
            {/*
            <div className="hidden md:flex items-center gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:text-[#cdabff] hover:bg-[#cdabff]/10"
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-6 w-6 text-[#e0def4]" />
                  </a>
                </Button>
              ))}
            </div>
            */}

            {/* Register Now Button */}
            <button
              onClick={() => openSlideOver(<SideSheetContent />)}
              className="hidden md:inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#453142] text-[#faf9f7] font-semibold shadow hover:bg-[#faf9f7] hover:text-[#453142] hover:scale-105 transition"
              aria-label="Register now"
            >
              Register Now
            </button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(s => !s)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="text-[#e0def4]" /> : <Menu className="text-[#e0def4]" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3 border-t border-[#453142]/20 pt-4 bg-[#faf9f7] rounded-xl shadow-lg">
            {/* Home link first in mobile */}
            <Link
              key="/"
              href="/"
              className="block py-3 px-4 rounded-md hover:bg-[#453142] hover:text-[#faf9f7] transition-colors text-lg text-[#453142] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* About (mobile accordion) */}
            <div className="space-y-2">
              <button
                onClick={() =>
                  setMobileOpenDropdown(mobileOpenDropdown === 'About Us' ? null : 'About Us')
                }
                className="w-full flex items-center justify-between py-3 px-4 rounded-md hover:bg-[#453142] hover:text-[#faf9f7] transition-colors text-left text-lg text-[#453142] font-medium"
              >
                About Us
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    mobileOpenDropdown === 'About Us' ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileOpenDropdown === 'About Us' && (
                <div className="pl-4 space-y-1">
                  {aboutMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2 px-4 rounded-md hover:bg-[#453142] hover:text-[#faf9f7] transition-colors text-base text-[#453142]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Resource Library and Translations (mobile accordions, skip Contact/Online Courses here) */}
            {navLinks
              .filter((link) => link.label !== "Home")
              .map((link) =>
                link.submenu ? (
                  <div key={link.label} className="space-y-2">
                    <button
                      onClick={() =>
                        setMobileOpenDropdown(mobileOpenDropdown === link.label ? null : link.label)
                      }
                      className="w-full flex items-center justify-between py-3 px-4 rounded-md hover:bg-[#453142] hover:text-[#faf9f7] transition-colors text-left text-lg text-[#453142] font-medium"
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          mobileOpenDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileOpenDropdown === link.label && (
                      <div className="pl-4 space-y-1">
                        {link.submenu.map((sublink, i) => (
                          <Link
                            key={`${sublink.href}|${sublink.label}|${i}`}
                            href={sublink.href}
                            className="block py-2 px-4 rounded-md hover:bg-[#453142] hover:text-[#faf9f7] transition-colors text-base text-[#453142]"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sublink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null
              )}

            {/* Online Courses filter (Mobile) */}
            <div className="space-y-2">
              <button
                onClick={() =>
                  setMobileOpenDropdown(mobileOpenDropdown === "Online Courses" ? null : "Online Courses")
                }
                className="w-full flex items-center justify-between py-3 px-4 rounded-md hover:bg-[#453142] hover:text-[#faf9f7] transition-colors text-left text-lg text-[#453142] font-medium"
              >
                Online Courses
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${mobileOpenDropdown === "Online Courses" ? "rotate-180" : ""}`}
                />
              </button>
              {mobileOpenDropdown === "Online Courses" && (
                <div className="pl-4 space-y-1">
                  {onlineCourseFilters.map((filterLink) => (
                    <Link
                      key={filterLink.filter}
                      href={`/online-courses?filter=${filterLink.filter}`}
                      className="block py-2 px-4 rounded-md hover:bg-[#453142] hover:text-[#faf9f7] transition-colors text-base text-[#453142]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {filterLink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Us (always last in mobile menu) */}
            <Link
              key="/contact"
              href="/contact"
              className="block py-3 px-4 rounded-md hover:bg-[#453142] hover:text-[#faf9f7] transition-colors text-lg text-[#453142] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>

            {/* Mobile Social Icons */}
            {/*
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  asChild
                  className="border-[#cdabff] hover:text-[#cdabff] hover:bg-[#cdabff]/10"
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-6 w-6 text-[#e0def4]" />
                  </a>
                </Button>
              ))}
            </div>
            */}
          </div>
        )}
      </nav>
    </header>
  )
}
