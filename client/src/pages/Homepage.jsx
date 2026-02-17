import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { BASE_URL } from '../api';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../index.css";


const useMarqueeScroll = (ref, dependencies = []) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationId;
    let x = 0;
    const speed = 0.5;

    const scroll = () => {
      x -= speed;
      const maxScroll = element.scrollWidth / 2;
      if (-x >= maxScroll) {
        x = 0;
      }
      element.style.transform = `translateX(${x}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);

  }, [...dependencies]);
};



const HowWeWorkFlashcard = ({ step, accent }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const frontBg = accent === "blue" ? "bg-[#008080]" : "bg-purple-700";
  const backBorder = accent === "blue" ? "border-4 border-[#40E0D0]" : "border-4 border-purple-400";
  const backHeading = accent === "blue" ? "text-[#008080]" : "text-purple-700";

  return (

    <div
      className="relative w-full max-w-xs sm:w-80 h-96 cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div

        className={`absolute w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center shadow-lg ${frontBg}`}
        style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.7, type: "tween" }}
      >

        <span className="text-3xl sm:text-4xl font-extrabold text-[#F5F5F5] mb-4">{step.front.icon}</span>
        <h3 className="text-lg sm:text-xl font-bold text-[#F5F5F5] mb-2">{step.front.headline}</h3>
        <p className="text-[#F5F5F5] text-opacity-80 text-sm">{step.front.description}</p>
      </motion.div>
      <motion.div

        className={`absolute w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-center text-center shadow-lg bg-[#F5F5F5] ${backBorder}`}
        style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 0 : -180 }}
        transition={{ duration: 0.7, type: "tween" }}
      >

        <h4 className={`text-xl sm:text-2xl font-extrabold mb-4 ${backHeading}`}>{step.back.headline}</h4>
        <p className="text-sm text-gray-600 mb-4">{step.back.description}</p>
        <ul className="text-left text-sm text-gray-700 space-y-2">
          {step.back.details.map((detail, index) => (
            <li key={index} className="flex items-start">
              <span className="text-sm mr-2 leading-tight">➡️</span>
              {detail}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};



const CategorySlider = ({ categories }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length);
  };

  useEffect(() => {
    if (categories.length > 1) {
      const autoScroll = setInterval(nextSlide, 5000);
      return () => clearInterval(autoScroll);
    }
  }, [categories.length]);

  if (!categories || categories.length === 0) {
    return <div>Loading categories...</div>;
  }

  const currentCategory = categories[currentSlide];

  return (
    <section className="relative w-full h-[70vh] sm:h-[60vh] max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-xl my-12 sm:my-20">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentCategory._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, type: "tween" }}
          className="absolute inset-0"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${BASE_URL}${currentCategory.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end">
            <div className="p-6 sm:p-8 text-[#F5F5F5]">
              <h2 className="text-3xl md:text-4xl font-bold text-[#008080]">{currentCategory.name}</h2>
              <p className="text-base md:text-lg mb-4">{currentCategory.description}</p>
              <Link
                to={`/category/${currentCategory.slug}`}
                className="inline-block px-5 py-2 sm:px-6 sm:py-3 bg-[#40E0D0] text-black rounded-lg font-semibold hover:bg-[#2E8B57] transition"
              >
                View {currentCategory.name} Services
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 sm:p-2 bg-[#40E0D0]/20 text-[#F5F5F5] rounded-full hover:bg-[#40E0D0]/40 transition z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 sm:p-2 bg-[#40E0D0]/20 text-[#F5F5F5] rounded-full hover:bg-[#40E0D0]/40 transition z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={28} className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
    </section>
  );
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("business");
  const [clients, setClients] = useState([]);
  const [featuredSolutions, setFeaturedSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const navigate = useNavigate();

  const clientsInnerRef = useRef(null);
  const featuredInnerRef = useRef(null);

  useMarqueeScroll(clientsInnerRef, [clients]);
  useMarqueeScroll(featuredInnerRef, [featuredSolutions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientsRes, featuredRes, categoriesRes] = await Promise.all([
          api.get("/clients"),
          api.get("/featuredSolutions"),
          api.get("/categories"),
        ]);
        setClients(clientsRes.data);
        setFeaturedSolutions(featuredRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true);
        const res = await api.get("/blogs");
        setBlogs(res.data.blogs);
      } catch (e) {
        console.error("Failed to fetch blogs:", e);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchBlogs();
  }, []);

  const homepageBlogs = blogs.slice(0, 3);

  if (loading || loadingBlogs) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  const onJoinTalent = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/join-as-talent" : "/login");
  };

  const goToTeamRequest = () => {
    navigate("/team-up-request");
  };

  const goToContact = () => {
    navigate("/contact")
  }

  const businessSteps = [
    {
      front: { icon: "1️⃣", headline: "Share Goals", description: "Businesses tell us what they want to achieve." },
      back: { headline: "Your Vision, Our Starting Point", description: "Tell us what challenges you’re facing and what success looks like for you. Whether it’s optimizing workflows, scaling data systems, or automating processes—we start with your goals.", details: ["Clients share their business needs (staffing, auditing, tech, design, AI, etc.).", "Clarify project goals, budget, and timeline.", "Define whether they need HR, auditors, IT, AI automation, or custom solutions"], accent: "blue" }
    },
    {
      front: { icon: "2️⃣", headline: "Tailored Plan", description: "We design a personalized strategy/software solution." },
      back: { headline: "A Strategy That Fits You", description: "Our experts analyse your requirements and create a roadmap. No cookie-cutter plans—only a solution aligned with your industry, budget, and goals.", details: ["Create a custom staffing + technology plan.", "Match services to needs (HR, QA, Testing, AI Agents, Websites, etc.).", "Define the right hiring approach (campus, lateral, executive, niche).", "Design a cost-effective strategy for startups & MSMEs."], accent: "blue" }
    },
    {
      front: { icon: "3️⃣", headline: "Build Team/Stack", description: "We assemble the right tech & talent." },
      back: { headline: "The Right People + The Right Tools", description: "We handpick specialists and the best-fit technologies to build your project. Think of it as assembling your dedicated dream team.", details: ["Assemble the right professionals (auditors, analysts, developers, consultants).", "Provide staffing consultants (temporary, permanent, contract).", "Build digital stack (data management, automation, websites, AI agents).", "Train and prepare talent with real-world readiness."], accent: "blue" }
    },
    {
      front: { icon: "4️⃣", headline: "QA & Launch", description: "Thorough testing + smooth deployment." },
      back: { headline: "Quality First, Launch With Confidence", description: "Before going live, we ensure every feature works seamlessly. Rigorous testing eliminates bugs, and our launch playbook ensures zero downtime.", details: ["Conduct manual & automation testing.", "Peer/code/product/packaging reviews.", "Ensure compliance, security & performance.", "Officially launch the project/team."], accent: "blue" }
    },
    {
      front: { icon: "5️⃣", headline: "Ongoing Care", description: "Continuous support, updates, and scaling." },
      back: { headline: "We Stay With You", description: "Launch is just the beginning. We provide long-term support, updates, and scaling so your solution grows with your business.", details: ["Continuous support, updates & optimization.", "Staff management & long-term hiring needs.", "Enhance efficiency with AI & automation.", "Build lasting client partnerships."], accent: "blue" }
    }
  ];

  const talentSteps = [
    {
      front: { icon: "1️⃣", headline: "Apply", description: "Submit profile and career goals." },
      back: { headline: "Start Your Journey With Us", description: "Take the first step by applying to become part of our global talent network. We welcome developers, designers, analysts, and problem-solvers who are ready to work on real-world projects.", details: ["Submit your application online to join Innovative Staffing Solutions.", "Share your background, interests, and career goals.", "We welcome young graduates, career restarters, and professionals looking to upskill."], accent: "purple" }
    },
    {
      front: { icon: "2️⃣", headline: "Train on Real Projects", description: "Learn with hands-on guidance." },
      back: { headline: "Learn by Doing", description: "Before joining client projects, talent undergoes guided training and practice tasks designed around real-world problems.", details: ["Get hands-on training with real client projects.", "Participate in mock interviews, skill assessments, and confidence-building workshops.", "Learn tools & domains like HR, auditing, QA, design, AI, websites, software testing, automation."], accent: "purple" }
    },
    {
      front: { icon: "3️⃣", headline: "Get Matched", description: "We connect talent with suitable businesses." },
      back: { headline: "Find Your Perfect Opportunity", description: "Once you’re trained, we match you with projects and businesses where your skills can shine the most.", details: ["Based on your skills, we match you with startups and MSMEs.", "Opportunities range from short-term projects to full-time placements.", "Specialized support for women re-entering the workforce."], accent: "purple" }
    },
    {
      front: { icon: "4️⃣", headline: "Grow", description: "Continuous learning, long-term growth opportunities." },
      back: { headline: "Build Skills, Reputation & Career", description: "As you work with businesses, you gain experience, improve your profile, and access bigger opportunities.", details: ["Gain real-world experience and build your career portfolio.", "Improve employability through continuous learning.", "Become part of a talent pool trusted by innovative businesses."], accent: "purple" }
    }
  ];

  const currentSteps = activeTab === "business" ? businessSteps : talentSteps;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        className="font-sans text-[#F5F5F5] bg-[#000000] min-h-screen"
      >
        <section className="relative w-full min-h-[100vh] flex items-center bg-no-repeat bg-cover bg-center">
          <div className="container mx-auto px-4 sm:px-6 py-20 relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2 max-w-2xl text-center lg:text-left"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <h1
                className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-[#F5F5F5]"
                style={{ textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}
              >
                Redefining recruitment with innovative staffing solution – bridging businesses and talent to build stronger teams
              </h1>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
                <motion.button
                  onClick={goToTeamRequest}
                  className="px-6 py-3 sm:px-8 sm:py-4 rounded-md bg-[#40E0D0] hover:bg-[#2E8B57] shadow-lg transition text-black font-semibold"
                  whileTap={{ scale: 0.95 }}
                >
                  Request Proposal
                </motion.button>
                <Link
                  to="/services"
                  className="px-6 py-3 sm:px-8 sm:py-4 rounded-md border border-[#40E0D0] text-[#40E0D0] font-semibold hover:bg-[#40E0D0]/10 transition drop-shadow"
                >
                  Explore Services
                </Link>
                <motion.button
                  onClick={onJoinTalent}
                  className="px-6 py-3 sm:px-8 sm:py-4 rounded-md border border-[#40E0D0] text-[#40E0D0] font-semibold hover:bg-[#40E0D0]/10 transition drop-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join as Talent
                </motion.button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 justify-center lg:justify-start text-[#F5F5F5] text-opacity-70 text-sm font-semibold">
                <span>Budget-friendly</span>
                <span>•</span>
                <span>ISO-ready quality</span>
                <span>•</span>
                <span>Fast onboarding</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-[#008080]">Our Four Pillars</h2>
          <CategorySlider categories={categories} />
        </section>

        <section
          className={`py-16 px-4 sm:px-6 max-w-6xl mx-auto text-center transition-colors duration-500 bg-[#000000] rounded-3xl`}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 sm:mb-12 text-[#008080]">How We Work</h2>
          <div className="flex flex-col justify-center items-center">
            <div className="flex w-74 flex-wrap justify-center rounded-lg ring ring-[#40E0D0]/30 bg-[#F5F5F5]/10 overflow-hidden mb-12 sm:mb-16">
              {["For Businesses", "For Talent"].map((label, idx) => (
                <button
                  key={label}
                  onClick={() => {
                    setActiveTab(idx === 0 ? "business" : "talent");
                  }}
                  className={`px-6 py-3 text-base sm:text-lg font-semibold whitespace-nowrap transition duration-300 w-1/2 sm:w-auto
              ${activeTab === (idx === 0 ? "business" : "talent")
                      ? idx === 0
                        ? "bg-[#40E0D0] text-black shadow-lg"
                        : "bg-purple-700 text-black shadow-lg"
                      : "text-[#F5F5F5] hover:bg-[#F5F5F5]/10 hover:text-white"
                    }`}
                  aria-selected={activeTab === (idx === 0 ? "business" : "talent")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-8 md:gap-10  justify-center mb-6"
            >
              {currentSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="w-full sm:w-auto flex justify-center"
                >
                  <HowWeWorkFlashcard step={step} accent={step.back.accent} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          {activeTab === "business" ? (
            <button onClick={goToTeamRequest} className="px-8 py-4 mt-12 bg-[#40E0D0] text-black text-lg font-semibold rounded-xl shadow-xl hover:bg-[#2E8B57] transition">
              Get a Custom Plan
            </button>
          ) : (
            <button
              onClick={onJoinTalent}
              className="px-8 py-4 mt-12 bg-[#40E0D0] text-black text-lg font-semibold rounded-xl shadow-xl hover:bg-[#2E8B57] transition"
            >
              Join as Talent
            </button>
          )}
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center bg-[#000000]">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-[#008080]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            “Where People Grow, Businesses Thrive”
          </motion.h2>
          <motion.h4
            className="text-base sm:text-md mt-4 font-bold text-[#F5F5F5]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            “We believe talent flourishes when given the right platform. Our programs empower professionals to grow while helping businesses succeed. We build careers and deliver impact — fast onboarding, high retention, and real growth for every talent.”
          </motion.h4>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 my-8 sm:my-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-[#000000] p-4 sm:p-6 rounded-lg shadow-lg text-[#F5F5F5] border border-[#40E0D0]/20">
              <p className="text-3xl sm:text-4xl font-bold">100+</p>
              <p className="text-sm">Candidates Trained</p>
            </div>
            <div className="bg-[#000000] p-4 sm:p-6 rounded-lg shadow-lg text-[#F5F5F5] border border-[#40E0D0]/20">
              <p className="text-3xl sm:text-4xl font-bold">65%</p>
              <p className="text-sm">Women Returners</p>
            </div>
            <div className="bg-[#000000] p-4 sm:p-6 rounded-lg shadow-lg text-[#F5F5F5] border border-[#40E0D0]/20">
              <p className="text-3xl sm:text-4xl font-bold">95%</p>
              <p className="text-sm">Client Retention</p>
            </div>
            <div className="bg-[#000000] p-4 sm:p-6 rounded-lg shadow-lg text-[#F5F5F5] border border-[#40E0D0]/20">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">1 day – 6 months </p>
              <p className="text-sm">Avg. Onboarding</p>
            </div>
          </motion.div>
          <motion.h4
            className="text-base sm:text-md mb-6 font-bold text-[#F5F5F5]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            “A workplace built on: Growth | Flexibility | Diversity | Collaboration”
          </motion.h4>
          <Link
            to="/careers"
            className="text-[#40E0D0] font-semibold border border-[#40E0D0] px-6 py-3 rounded-lg hover:bg-[#40E0D0]/10 transition"
          >
            Learn About Our Programs
          </Link>
        </section>

        <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 bg-[#000000]">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-[#008080]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            “Proof over promises — real challenges, real solutions.”
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {[
              { title: "Career Growth for Students", headline: "Bridging the gap between education and real-world experience.", description: "Many students struggle because they don’t get live project exposure, limiting their career growth. We provide real industry experience and mentorship opportunities.", link: "/case-studies/career-growth-for-students" },
              { title: "Safe Opportunities for Students & Women", headline: "Protecting aspirants from freelancing scams.", description: "Thousands of students and women are scammed through fake freelancing, affiliate marketing, and consultancy offers. We offer safe, verified opportunities that build trust.", link: "/case-studies/safe-opportunities-for-students-and-women" },
              { title: "Staffing Solutions for Businesses", headline: "Flexible staffing for modern business needs.", description: "Companies often need short-term workers but are forced into monthly contracts. We provide on-demand staffing — from 1 day to long-term growth support.", link: "/case-studies/staffing-solutions-for-businesses" }
            ].map(({ title, headline, description, link }, idx) => (
              <motion.div
                key={idx}
                className="block p-6 border rounded-xl bg-[#F5F5F5] transition flex flex-col"
                style={{ borderColor: "#000000" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <p className="font-semibold text-sm text-[#008080] mb-2">{title}</p>
                <h3 className="text-xl font-bold text-[#008080] mb-4">{headline}</h3>
                <p className="text-gray-600 text-sm flex-grow mb-6">{description}</p>
                <Link
                  to={link}
                  className="text-[#40E0D0] font-semibold inline-flex items-center hover:underline mt-auto"
                >
                  Read Case Study →
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/case-studies"
              className="bg-[#40E0D0] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#2E8B57] transition"
            >
              View All Case Studies
            </Link>
          </div>
        </section>

        <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 text-center bg-[#000000]">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4 text-[#008080]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Industries We Serve
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-[#F5F5F5] mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From startups to enterprises, we build solutions tailored for your world.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 sm:gap-12 max-w-5xl mx-auto">
            {[
              { label: "IT & SaaS", blurbs: "Scale smarter with modern software solutions.", icon: "🖥️" },
              { label: "Education", blurbs: "Digital tools for smarter learning and management.", icon: "🎓" },
              { label: "Retail & E-commerce", blurbs: "Boost customer engagement and sales efficiency.", icon: "🛒" },
              { label: "Finance", blurbs: "Secure, scalable tech for financial services.", icon: "💳" },
              { label: "Non-profit", blurbs: "Tech that empowers impact and community reach.", icon: "🤝" },
            ].map(({ label, blurbs, icon }, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center space-y-2 w-32"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-5xl">
                  {icon}
                </div>
                <p className="text-sm font-semibold text-[#F5F5F5]">{label}</p>
                <p className="text-xs text-gray-400">{blurbs}</p>
              </motion.div>
            ))}
          </div>
          <Link to="/industries" className="text-[#40E0D0] mt-12 inline-block font-semibold hover:underline">
            See Industry Playbooks →
          </Link>
        </section>

        <section className="bg-black py-16 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <motion.h2
                className="text-3xl font-bold tracking-tight text-[#40E0D0] sm:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Insights & Ideas
              </motion.h2>
              <motion.p
                className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Explore expert perspectives on HR, AI, and software innovation.
              </motion.p>
            </div>

            <div className="mx-auto mt-12 sm:mt-16 grid max-w-lg gap-6 sm:gap-8 lg:max-w-none lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
              {homepageBlogs.map((blog, idx) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                >
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="group block overflow-hidden rounded-xl bg-zinc-900 shadow-lg transition-all duration-300 hover:shadow-[#40E0D0] hover:-translate-y-2"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={blog.image ? `${BASE_URL}${blog.image}` : "https://via.placeholder.com/1600x900/1E293B/FFFFFF?text=Insight"}
                        alt={blog.title}
                        className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col p-6 text-left">
                      <h3 className="text-xl font-semibold text-[#40E0D0] group-hover:text-[#40E0D0]">
                        {blog.title}
                      </h3>
                      <p className="mt-3 min-h-[3rem] text-sm text-gray-400 line-clamp-2">
                        {blog.summary}
                      </p>
                      <div className="mt-6">
                        <span className="font-semibold text-[#40E0D0]">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                to="/blogs"
                className="inline-block rounded-md bg-[#40E0D0] px-8 py-3 font-semibold text-black transition hover:bg-[#2E8B57]"
              >
                Explore Other Interesting Blogs
              </Link>
            </div>
          </div>
        </section>

      </motion.div>
    </AnimatePresence>
  );
}