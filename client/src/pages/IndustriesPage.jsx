import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Cloud,
  GraduationCap,
  ShoppingCart,
  CreditCard,
  Handshake,
} from "lucide-react";

export default function IndustriesPage() {
  const industries = [
    {
      label: "IT & SaaS",
      description:
        "Scale and secure your tech infrastructure with reliable cloud and SaaS solutions designed for steady growth.",
      icon: Cloud,
      link: "/industries/it-saas",
    },
    {
      label: "Education",
      description:
        "Support learners and educators with thoughtful digital platforms built for clarity and engagement.",
      icon: GraduationCap,
      link: "/industries/education",
    },
    {
      label: "Retail & E-commerce",
      description:
        "Improve conversions with simplified storefronts and seamless checkout experiences.",
      icon: ShoppingCart,
      link: "/industries/retail-ecommerce",
    },
    {
      label: "Finance",
      description:
        "Create secure dashboards and intuitive tools that simplify complex financial insights.",
      icon: CreditCard,
      link: "/industries/finance",
    },
    {
      label: "Non-Profit",
      description:
        "Strengthen your mission with digital solutions focused on clarity, trust, and impact.",
      icon: Handshake,
      link: "/industries/non-profit",
    },
  ];

  return (
    <main className="min-h-screen bg-[#E6F7F5] text-[#134E4A] font-sans">

      {/* Hero Section */}
      <section className="bg-[#0F766E] text-white px-6 py-28">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide mb-6">
            Industries We Serve
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-white/95 font-semibold">
            Every industry has unique needs. We design tailored digital
            strategies aligned with long-term growth and sustainability.
          </p>
        </motion.div>
      </section>

      {/* Industries Section */}
      <section className="px-6 py-24 bg-[#D9F3F0]">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {industries.map((industry, idx) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={idx}
                className="rounded-3xl p-8 
                bg-gradient-to-br from-[#B9F2EC] via-[#86E0D6] to-[#5CC9BC]
                shadow-lg hover:shadow-xl
                transition-all duration-300
                flex flex-col text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                {/* Icon */}
                <div className="mx-auto mb-6 p-4 rounded-full bg-white/40 text-[#0F766E]">
                  <Icon size={32} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold tracking-wide mb-3 text-[#134E4A]">
                  {industry.label}
                </h3>

                {/* Description */}
                <p className="text-base md:text-lg leading-relaxed text-[#145E59] mb-6 flex-grow font-semibold">
                  {industry.description}
                </p>

                {/* Link */}
                <Link
                  to={industry.link}
                  className="inline-flex items-center justify-center font-semibold text-[#0F766E] hover:text-[#0A5C55] transition"
                >
                  View Playbook
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

    </main>
  );
}