import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import { SlideOverProvider } from "@/components/context/SlideOverContext";
import SlideOver from "@/components/ui/SlideOver";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({ 
  weight: ['400', '700'],
  subsets: ["arabic"], 
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Word for Word Quran Translation | Learn Quran with Ustaad Imran Sait",
  description: "Learn the Qur'an translation using the Word for Word concept by Ustaad Imran Sait. Free online Quran classes in English, Urdu, and Tamil.",
  keywords: [
    "Quran translation",
    "word for word Quran",
    "learn Quran",
    "Imran Sait",
    "Quran classes",
    "Islamic education",
    "FAQ Quran classes", // ✅ Add FAQ keyword
    "free Quran learning"
  ],
  authors: [{ name: "WQTC" }],
  openGraph: {
    title: "Word for Word Quran Translation Classes",
    description: "Free Quran translation classes using innovative word-for-word learning method",
    url: "https://wordforwordquran.com",
    siteName: "WQTC",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function FAQSchema() {
  // Static FAQ question/answer pairs matching FAQSection.tsx
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where Can I Find Information?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can find comprehensive information about our Quran translation classes in our Resource Library, which includes video lectures, audio recordings, and eBooks. You can also visit our About Us section to learn more about our methodology and our mentor, Ustaad Imran Sait."
        }
      },
      {
        "@type": "Question",
        "name": "What Are Your Terms And Conditions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our classes are completely free of charge. We only ask that students attend regularly and complete their assignments. By enrolling, you agree to respect the sanctity of the Quran and maintain a conducive learning environment for all participants."
        }
      },
      {
        "@type": "Question",
        "name": "Can I Buy Directly From The Factory?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All our educational materials, including eBooks and translations, are available for free download from our website. We don't sell any physical products. Our mission is to make Quranic knowledge accessible to everyone without any financial barriers."
        }
      },
      {
        "@type": "Question",
        "name": "What Kinds of Payment Do You Accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We don't accept any payments as all our courses and resources are completely free. However, if you wish to support our mission, you can reach out to us through our Contact page for donation information."
        }
      },
      {
        "@type": "Question",
        "name": "When do I receive my order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "There are no physical orders. All our resources, including video classes, audio lectures, and eBooks, are available instantly for streaming or download through our Resource Library. You can access them anytime, anywhere."
        }
      }
      // ... add more questions if desired
    ]
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${amiri.variable}`}>
      <head>
        <FAQSchema />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SlideOverProvider>
            {/* <AnnouncementBar /> */}
            <Navbar />
            {/* mount once, globally */}
            <SlideOver />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </SlideOverProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
