import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, HeartHandshake, Lightbulb, TrendingUp, Sparkles, BookOpen, Users, Award, Waypoints, Leaf, Handshake, Shield, ArrowRight } from 'lucide-react';

export default function CareersPage() {
  const navigate = useNavigate();

  const handleJoinTalent = () => {
    const token = localStorage.getItem("token");
    if (token) navigate("/join-as-talent");
    else navigate("/login");
  };

  return (
    <motion.main 
      className="min-h-screen bg-[#E6F7F5] text-[#134E4A] font-sans selection:bg-[#B9F2EC]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      
      {/* Hero Section - Teal Monochromatic Gradient */}
      <section className="relative w-full min-h-[80vh] flex flex-col md:flex-row items-center justify-center py-16 md:py-24 px-8 md:px-20 overflow-hidden bg-gradient-to-b from-[#B9F2EC] to-[#E6F7F5]">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/30 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        {/* Left Column: Replaced Image with Animated Icon Container */}
        <div className="w-full md:w-1/2 flex justify-center p-4 z-10">
          <motion.div 
            className="relative w-full max-w-md aspect-square bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white flex items-center justify-center shadow-2xl shadow-[#008080]/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Briefcase size={140} className="text-[#008080] opacity-80" strokeWidth={1.5} />
            </motion.div>
            <div className="absolute bottom-10 right-10 p-6 bg-white rounded-2xl shadow-lg">
                <Sparkles size={32} className="text-[#40E0D0]" />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Content */}
        <div className="w-full md:w-1/2 text-center md:text-left p-4 mt-8 md:mt-0 z-10">
          <motion.h1
            className="text-5xl md:text-7xl font-black mb-6 text-[#134E4A] leading-[1.1] tracking-tight"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Build a career <span className="text-[#008080]">that matters.</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl font-medium max-w-xl mx-auto md:mx-0 mb-10 text-[#0F766E] opacity-90 leading-relaxed"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Programs for early talent, returners, and seasoned professionals — designed to help you learn, contribute, and lead.
          </motion.p>
          <motion.button
            onClick={handleJoinTalent}
            className="px-10 py-5 bg-[#134E4A] text-white font-black rounded-2xl shadow-xl hover:bg-[#008080] transition-all flex items-center mx-auto md:mx-0 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Our Talent Network
            <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-24 px-8">
        
        {/* Our Mission & Values - Card-on-Base Style */}
        <motion.section
          className="text-center mb-32 bg-white rounded-[3rem] p-16 shadow-sm border border-[#B9F2EC]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm uppercase tracking-[0.4em] font-black mb-6 text-[#008080]">Our Purpose</h2>
          <h3 className="text-4xl md:text-5xl font-black mb-8 text-[#134E4A]">Our Mission & Values</h3>
          <p className="text-xl max-w-3xl mx-auto text-[#0F766E] font-medium leading-relaxed mb-16">
            At Innovative Staffing Solutions, we go beyond jobs—we create journeys. Our mission is to connect talent with opportunities that accelerate personal growth and organizational success.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: "Growth", desc: "Continuous learning & progress." },
              { icon: Users, title: "Inclusion", desc: "Diverse voices drive outcomes." },
              { icon: HeartHandshake, title: "Integrity", desc: "Honest, responsible delivery." },
              { icon: Award, title: "Ownership", desc: "Enabling level ownership." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center p-8 bg-[#E6F7F5] rounded-[2rem] border border-white transition-all hover:shadow-xl hover:shadow-[#008080]/5 group">
                <item.icon size={48} className="text-[#008080] mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-black mb-3 text-[#134E4A]">{item.title}</h3>
                <p className="text-sm text-[#0F766E] font-bold opacity-70 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Career Growth Pathways - Replaced Image with Waypoints Icon */}
        <motion.section
          className="mb-32 grid md:grid-cols-2 gap-16 items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative aspect-square bg-[#134E4A] rounded-[3rem] flex items-center justify-center overflow-hidden shadow-2xl group">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#008080] to-transparent opacity-40"></div>
             <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
             >
                <Waypoints size={160} className="text-[#86E0D6] relative z-10" strokeWidth={1} />
             </motion.div>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-[0.4em] font-black mb-6 text-[#008080]">Development</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-6 text-[#134E4A]">Career Growth Pathways</h3>
            <p className="text-xl text-[#0F766E] font-medium mb-10 leading-relaxed">
              We don’t just hire talent—we nurture it. Our structured pathways ensure you evolve with us:
            </p>
            <ul className="space-y-6">
              {[
                { icon: Sparkles, title: "Return-to-Work Programs", desc: "For professionals restarting their careers." },
                { icon: BookOpen, title: "Talent Accelerator", desc: "For fresh graduates eager to learn." },
                { icon: Lightbulb, title: "Mentorship & Upskilling", desc: "For continuous learning and leadership growth." }
              ].map((path, i) => (
                <li key={i} className="flex items-start group">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-[#008080] mr-5 group-hover:bg-[#008080] group-hover:text-white transition-colors">
                    <path.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-[#134E4A] mb-1">{path.title}</h4>
                    <p className="text-[#0F766E] font-medium opacity-70">{path.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Life at Innovative Staffing Solutions - Grid Cards */}
        <motion.section
          className="mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-[0.4em] font-black mb-6 text-[#008080]">Culture</h2>
            <h3 className="text-4xl md:text-5xl font-black text-[#134E4A]">Life at Innovative Staffing Solutions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Learning Culture", 
                content: ["Hybrid work options", "Regular training", "Supportive community", "Mentorship system", "Wellbeing allowances"] 
              },
              { 
                title: "Safe Commute", 
                body: "We provide pick-up and drop facilities, especially prioritizing youngsters and women, to ensure safe and convenient travel." 
              },
              { 
                title: "Perks", 
                content: ["Learning stipend", "Performance bonuses", "Remote-first kit allowance"] 
              }
            ].map((card, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-[#B9F2EC] shadow-sm hover:shadow-xl hover:shadow-[#008080]/5 transition-all">
                <h3 className="text-2xl font-black mb-6 text-[#008080] tracking-tight">{card.title}</h3>
                {card.content ? (
                    <ul className="space-y-4">
                        {card.content.map((li, idx) => (
                            <li key={idx} className="flex items-center text-[#0F766E] font-bold text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#86E0D6] mr-3"></span>
                                {li}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-[#0F766E] font-medium leading-relaxed opacity-80">{card.body}</p>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Impact in Numbers - Circular Stats */}
        <motion.section
          className="text-center mb-32"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm uppercase tracking-[0.4em] font-black mb-16 text-[#008080]">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: "100+", label: "candidates trained" },
              { val: "65%", label: "women returners" },
              { val: "95%", label: "client retention" },
              { val: "5+", label: "industries served" }
            ].map((stat, i) => (
              <div key={i} className="p-10 rounded-[2rem] bg-[#134E4A] text-white shadow-xl">
                <p className="text-5xl font-black text-[#86E0D6] mb-3">{stat.val}</p>
                <p className="text-xs uppercase tracking-widest font-black opacity-70">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Final Call-to-Action - Gradient Card */}
        <motion.section
          className="text-center bg-white rounded-[4rem] p-16 border border-[#B9F2EC] shadow-2xl shadow-[#008080]/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E6F7F5] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-5xl font-black mb-6 text-[#134E4A] relative z-10 tracking-tight">Ready to Grow With Us?</h2>
          <p className="text-2xl mb-12 text-[#0F766E] font-medium max-w-2xl mx-auto opacity-80 relative z-10">
            Whether you’re restarting, accelerating, or reshaping your career—we’re here to support your journey.
          </p>
          <motion.button
            onClick={handleJoinTalent}
            className="px-12 py-6 bg-[#134E4A] text-white font-black rounded-2xl shadow-xl hover:bg-[#008080] transition-all relative z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join Our Talent Network
          </motion.button>
        </motion.section>

      </div>
    </motion.main>
  );
}