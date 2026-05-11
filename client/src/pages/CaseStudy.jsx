import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, FileText, Target, Users } from "lucide-react";

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Added context-specific icons and tags to match the Premium theme
  const mockCaseStudies = [
    {
      slug: "career-growth-for-students",
      title: "Career Growth for Students",
      tag: "Career Development",
      icon: <Target size={32} />,
      description: "Many students struggle because they don’t get live project exposure, limiting their career growth. We provide real industry experience and mentorship opportunities.",
    },
    {
      slug: "safe-opportunities-for-students-and-women",
      title: "Safe Opportunities for Students & Women",
      tag: "Social Impact",
      icon: <Users size={32} />,
      description: "Thousands of students and women are scammed through fake freelancing, affiliate marketing, and consultancy offers. We offer safe, verified opportunities that build trust.",
    },
    {
      slug: "staffing-solutions-for-businesses",
      title: "Staffing Solutions for Businesses",
      tag: "Corporate",
      icon: <FileText size={32} />,
      description: "Companies often need short-term workers but are forced into monthly contracts. We provide on-demand staffing — from 1 day to long-term growth support.",
    },
  ];

  useEffect(() => {
    // Slight timeout for a smoother entrance animation
    const timer = setTimeout(() => {
      setCaseStudies(mockCaseStudies);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center bg-[#042F2E] text-[#2DD4BF] text-xl font-bold min-h-screen flex items-center justify-center">
        Loading Playbook Briefs...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#E6F7F5] font-sans pb-24 overflow-x-hidden">
      
      {/* Hero Section - Deep Forest Theme */}
      <section className="relative w-full py-32 md:py-48 px-6 flex flex-col items-center justify-center bg-[#042F2E]">
        {/* Ambient Glow Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute w-[500px] h-[500px] bg-[#14B8A6]/20 blur-[120px] rounded-full -top-32 -left-20" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-5xl text-center bg-white/5 backdrop-blur-xl p-10 md:p-20 rounded-[3rem] border border-white/10 shadow-2xl"
        >
          <div className="flex justify-center mb-8 text-[#2DD4BF]">
            <BookOpen size={64} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tight leading-none">
            Case <span className="text-[#2DD4BF]">Studies.</span>
          </h1>
          <p className="text-xl md:text-3xl font-medium text-[#CCFBF1] italic max-w-3xl mx-auto leading-relaxed opacity-90">
            "Proof over promises — real challenges, real solutions."
          </p>
        </motion.div>

        {/* Liquid Wave Transition to Light Body */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 120L0 0C161.3 56.7 455.5 111 1200 30V120Z" fill="#E6F7F5"></path>
          </svg>
        </div>
      </section>

      {/* Case Studies Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {caseStudies.length > 0 ? (
              caseStudies.map((cs, idx) => (
                <motion.div
                  key={cs.slug}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="group relative bg-white p-10 rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,128,128,0.1)] border-l-[10px] border-[#14B8A6] hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2"
                >
                  {/* Floating Tag */}
                  <div className="absolute top-8 right-8 text-[10px] font-black uppercase tracking-widest text-[#14B8A6]/40">
                    {cs.tag}
                  </div>

                  {/* Icon Box */}
                  <div className="mb-8 p-4 bg-[#E6F7F5] w-fit rounded-2xl group-hover:bg-[#14B8A6] group-hover:text-white transition-all duration-500">
                    {React.cloneElement(cs.icon, { 
                      className: "text-[#0F766E] group-hover:text-white transition-colors" 
                    })}
                  </div>

                  <h3 className="font-black text-2xl mb-5 text-[#042F2E] group-hover:text-[#0D9488] transition-colors leading-tight">
                    {cs.title}
                  </h3>
                  
                  <p className="text-[#145E59] text-lg leading-relaxed flex-grow mb-10 font-medium opacity-80">
                    {cs.description}
                  </p>
                  
                  <Link
                    to={`/case-studies/${cs.slug}`}
                    className="flex items-center justify-between w-full group/btn"
                  >
                    <span className="text-[#0D9488] font-black text-lg">View Full Brief</span>
                    <div className="p-3 rounded-full bg-[#F0FDFA] group-hover/btn:bg-[#14B8A6] group-hover/btn:text-white transition-all">
                      <ArrowRight size={20} />
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-[#145E59] text-xl font-bold py-20">
                No case studies available at the moment.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Callout */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-24 text-center px-6"
      >
        <p className="text-[#134E4A]/50 font-bold tracking-widest uppercase text-xs mb-4">Want to see more results?</p>
        <Link to="/contact" className="text-[#0D9488] text-xl font-black hover:underline underline-offset-8 transition-all">
          Schedule a Consultation →
        </Link>
      </motion.div>
    </main>
  );
}