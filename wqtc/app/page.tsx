import HeroSection from "@/components/sections/HeroSection";
import WelcomeSection from "@/components/sections/WelcomeSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import StatsSection from "@/components/sections/StatsSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import VideoGallery from "@/components/sections/VideoGallery";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NoticesSection from "@/components/sections/NoticesSection";
import ImageGallerySection from "@/components/sections/ImageGallerySection";
import BlogSection from "@/components/sections/BlogSection";
import FAQSection from "@/components/sections/FAQSection"; // ✅ Add this import

export default function Home() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <FeaturesSection />
      <VideoGallery />
      {/* <StatsSection /> */}
      <CaseStudiesSection />
      {/* <PricingSection /> */}
      <TestimonialsSection />
      <FAQSection /> {/* ✅ Add FAQ section here - positioned after testimonials and before gallery */}
      <ImageGallerySection />
      {/* <BlogSection /> */}
      <NoticesSection />
    </>
  );
}
