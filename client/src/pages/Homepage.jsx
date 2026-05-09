import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { BASE_URL } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Briefcase,
  Users,
  Sparkles,
  Building2,
} from "lucide-react";

import "../index.css";

const HowWeWorkFlashcard = ({ step }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full max-w-[340px] h-[420px] cursor-pointer"
      style={{ perspective: 1200 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* FRONT */}
      <motion.div
        className="absolute inset-0 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-xl bg-gradient-to-br from-[#B9F2EC] via-[#86E0D6] to-[#5CC9BC] border border-white/30"
        style={{
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="w-20 h-20 rounded-2xl bg-white/40 flex items-center justify-center text-4xl mb-6 border border-white/30">
          {step.front.icon}
        </div>

        <h3 className="text-2xl font-bold text-emerald-800 mb-4 leading-snug">
          {step.front.headline}
        </h3>

        <p className="text-sm text-black leading-7">
          {step.front.description}
        </p>
      </motion.div>

      {/* BACK */}
      <motion.div
        className="absolute inset-0 rounded-3xl p-8 flex flex-col justify-center shadow-xl bg-[#0F766E]"
        style={{
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: isFlipped ? 0 : -180 }}
        transition={{ duration: 0.7 }}
      >
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          {step.back.headline}
        </h3>

        <p className="text-white/90 text-sm leading-6 mb-5 text-center">
          {step.back.description}
        </p>

        <ul className="space-y-3 text-sm text-white/90">
          {step.back.details.map((detail, index) => (
            <li key={index} className="flex items-start gap-2 leading-6">
              <span className="text-white mt-1">●</span>
              <span>{detail}</span>
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
    setCurrentSlide(
      (prev) => (prev - 1 + categories.length) % categories.length
    );
  };

  useEffect(() => {
    if (categories.length > 1) {
      const autoScroll = setInterval(nextSlide, 5000);
      return () => clearInterval(autoScroll);
    }
  }, [categories.length]);

  if (!categories || categories.length === 0) return null;

  const currentCategory = categories[currentSlide];

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/20 bg-[#D9F3F0] shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="relative h-[600px]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${BASE_URL}${currentCategory.image})`,
            }}
          />

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 flex h-full items-end p-10 md:p-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 backdrop-blur-md px-4 py-2 text-sm text-white mb-6">
                <Sparkles size={16} />
                Featured Service Category
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                {currentCategory.name}
              </h2>

              <p className="text-lg text-white/90 leading-8 mb-8 max-w-xl">
                {currentCategory.description}
              </p>

              <Link
                to={`/category/${currentCategory.slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#40E0D0] px-8 py-4 font-semibold text-black transition hover:bg-white hover:text-[#0F766E]"
              >
                Explore Services
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0F766E] shadow-lg transition hover:bg-[#0F766E] hover:text-white"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0F766E] shadow-lg transition hover:bg-[#0F766E] hover:text-white"
      >
        <ChevronRight />
      </button>
    </section>
  );
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const categoriesRes = await api.get("/categories");

        setCategories(
          Array.isArray(categoriesRes.data) ? categoriesRes.data : []
        );
      } catch (err) {
        console.error(err);
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

        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading || loadingBlogs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F766E] text-white text-xl font-semibold">
        Loading...
      </div>
    );
  }

  const homepageBlogs = blogs.slice(0, 3);

  const businessSteps = [
    {
      front: {
        icon: "1️⃣",
        headline: "Share Goals",
        description: "Businesses tell us what they want to achieve.",
      },
      back: {
        headline: "Your Vision, Our Starting Point",
        description:
          "We understand your business goals before building solutions.",
        details: [
          "Understand business requirements",
          "Project planning & consultation",
          "Timeline and budget alignment",
        ],
      },
    },
    {
      front: {
        icon: "2️⃣",
        headline: "Tailored Strategy",
        description: "Custom solutions designed for your company.",
      },
      back: {
        headline: "Personalized Approach",
        description:
          "Every business gets a strategy designed around its goals.",
        details: [
          "Custom staffing models",
          "AI & automation planning",
          "Cost-effective execution",
        ],
      },
    },
    {
      front: {
        icon: "3️⃣",
        headline: "Build & Execute",
        description: "We build the right team and systems.",
      },
      back: {
        headline: "Execution Excellence",
        description:
          "Our experts ensure seamless delivery and implementation.",
        details: [
          "Dedicated specialists",
          "Technology implementation",
          "Quality assurance process",
        ],
      },
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen overflow-hidden bg-[#0F766E] text-white"
      >
        {/* HERO SECTION */}

        <section className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#40E0D0]/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#86E0D6]/20 blur-3xl rounded-full" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-5 py-2 text-sm text-white mb-8">
                  <Sparkles size={16} />
                  Innovative Staffing Solutions
                </div>

                <h1 className="text-5xl md:text-6xl font-black leading-tight mb-8 text-white">
                  Redefining
                  <span className="text-[#40E0D0]"> Recruitment </span>
                  & Digital Growth
                </h1>

                <p className="text-lg text-white/80 leading-8 max-w-2xl mb-10">
                  Bridging businesses and talent with modern staffing,
                  automation, AI-powered solutions, and scalable digital
                  experiences.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate("/team-up-request")}
                    className="rounded-xl bg-[#40E0D0] px-8 py-4 font-semibold text-black transition hover:bg-white hover:text-[#0F766E]"
                  >
                    Request Proposal
                  </button>

                  <Link
                    to="/services"
                    className="rounded-xl border border-white bg-transparent px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-[#0F766E]"
                  >
                    Explore Services
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="rounded-[32px] border border-white/20 bg-[#D9F3F0] p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-5">
                    {[
                      {
                        icon: Briefcase,
                        title: "Business Growth",
                        desc: "Scalable staffing & software solutions.",
                      },
                      {
                        icon: Users,
                        title: "Talent Network",
                        desc: "Real opportunities with expert guidance.",
                      },
                      {
                        icon: Building2,
                        title: "Modern Hiring",
                        desc: "Faster recruitment with better retention.",
                      },
                      {
                        icon: Sparkles,
                        title: "AI & Automation",
                        desc: "Smart digital transformation services.",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="rounded-2xl bg-gradient-to-br from-[#B9F2EC] via-[#86E0D6] to-[#5CC9BC] p-6 border border-white/30 hover:scale-105 transition-all duration-300"
                      >
                        <item.icon
                          className="text-emerald-800 mb-4"
                          size={34}
                        />

                        <h3 className="font-bold text-lg mb-2 text-emerald-900">
                          {item.title}
                        </h3>

                        <p className="text-sm text-black">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CATEGORY SECTION */}

        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-5 text-white">
                Our Core Services
              </h2>

              <p className="text-white/80 max-w-2xl mx-auto text-lg">
                Modern solutions designed to help businesses scale and talent
                grow.
              </p>
            </div>

            <CategorySlider categories={categories} />
          </div>
        </section>

        {/* HOW WE WORK */}

        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl rounded-[32px] bg-[#D9F3F0] border border-white/80 p-10 md:p-16 shadow-2xl">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-black mb-5 text-emerald-900">
                How We Work
              </h2>

              <p className="text-lg text-black max-w-2xl mx-auto">
                A modern process built for businesses and ambitious talent.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              {businessSteps.map((step, index) => (
                <HowWeWorkFlashcard key={index} step={step} />
              ))}
            </div>
          </div>
        </section>

        {/* BLOG SECTION */}

        <section className="px-6 pb-28">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-5 text-white">
                Insights & Ideas
              </h2>

              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Explore modern HR, AI, staffing, and software innovation trends.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homepageBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="group overflow-hidden rounded-[28px] border border-white/20 bg-[#D9F3F0] block transition hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={
                          blog.image
                            ? `${BASE_URL}${blog.image}`
                            : "https://via.placeholder.com/1600x900"
                        }
                        alt={blog.title}
                        className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-7">
                      <h3 className="text-2xl font-bold mb-4 text-emerald-900 group-hover:text-[#0F766E] transition">
                        {blog.title}
                      </h3>

                      <p className="text-black leading-7 line-clamp-3 mb-6">
                        {blog.summary}
                      </p>

                      <span className="inline-flex items-center gap-2 text-[#0F766E] font-semibold">
                        Read More
                        <ArrowRight size={18} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}