import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { ArrowRight } from "lucide-react";

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for the case study list page
  const mockCaseStudies = [
    {
      slug: "career-growth-for-students",
      title: "Career Growth for Students",
      headline: "Bridging the gap between education and real-world experience.",
      description: "Many students struggle because they don’t get live project exposure, limiting their career growth. We provide real industry experience and mentorship opportunities.",
      link: "/case-studies/career-growth-for-students",
    },
    {
      slug: "safe-opportunities-for-students-and-women",
      title: "Safe Opportunities for Students & Women",
      headline: "Protecting aspirants from freelancing scams.",
      description: "Thousands of students and women are scammed through fake freelancing, affiliate marketing, and consultancy offers. We offer safe, verified opportunities that build trust.",
      link: "/case-studies/safe-opportunities-for-students-and-women",
    },
    {
      slug: "staffing-solutions-for-businesses",
      title: "Staffing Solutions for Businesses",
      headline: "Flexible staffing for modern business needs.",
      description: "Companies often need short-term workers but are forced into monthly contracts. We provide on-demand staffing — from 1 day to long-term growth support.",
      link: "/case-studies/staffing-solutions-for-businesses",
    },
  ];

  useEffect(() => {
    // In a real application, you would fetch data from your backend
    // const fetchCaseStudies = async () => {
    //   const res = await api.get("/case-studies");
    //   setCaseStudies(res.data);
    //   setLoading(false);
    // };
    // fetchCaseStudies();

    // Using mock data for demonstration purposes
    setCaseStudies(mockCaseStudies);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-[#F5F5F5]">Loading case studies...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-[#F5F5F5] font-sans px-6 py-20 md:py-32 flex flex-col items-center">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center mb-16"
      >
        <h1 className="text-5xl font-extrabold mb-4 text-[#008080]">Case Studies</h1>
        <p className="text-lg text-[#F5F5F5] max-w-xl mx-auto">
          "Proof over promises — real challenges, real solutions.”
        </p>
      </motion.section>

      {/* Case Studies Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <AnimatePresence>
          {caseStudies.length > 0 ? (
            caseStudies.map((cs, idx) => (
              <motion.div
                key={cs.slug}
                className="block p-6 border rounded-xl bg-[#1a1a1a] hover:shadow-xl transition flex flex-col h-full"
                style={{ borderColor: "#008080" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: idx * 0.15 }}
              >
                <h3 className="font-bold text-xl mb-2 text-[#008080]">{cs.title}</h3>
                <p className="text-[#F5F5F5] text-sm flex-grow mb-6">{cs.description}</p>
                <Link
                  to={`/case-studies/${cs.slug}`}
                  className="text-[#40E0D0] font-semibold inline-flex items-center hover:underline mt-auto"
                >
                  Read Case Study <ArrowRight className="ml-1" size={16} />
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center text-[#F5F5F5]/70">No case studies found.</div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}