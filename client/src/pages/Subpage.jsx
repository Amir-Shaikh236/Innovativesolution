import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import FlipCard from "../components/FlipCard";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight } from 'lucide-react';
import { BASE_URL } from '../api';
// Helper component to render different section content types
function SectionContent({ section, flipcards }) {
  if (["features", "benefits"].includes(section.type) && section.content) {
    const items = Array.isArray(section.content)
      ? section.content
      : section.content.split("\n").filter(Boolean);
    return (
      <ul className="list-none space-y-2 text-slate-300 text-lg">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start">
            <CheckCircle size={20} className="text-[#40E0D0] mr-3 mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (section.type === "examples" && section.content) {
    const items = Array.isArray(section.content)
      ? section.content
      : section.content.split("\n").filter(Boolean);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center space-x-3 p-4 bg-gray-800 rounded-xl"
          >
            <ArrowRight size={20} className="text-[#40E0D0] flex-shrink-0" />
            <p className="font-medium text-slate-300">{item}</p>
          </div>
        ))}
      </div>
    );
  }
  if (section.type === "flipcards") {
    return (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {(flipcards || []).map((card) => (
          <motion.div
            key={card._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <FlipCard data={card} />
          </motion.div>
        ))}
      </motion.div>
    );
  }
  if (section.type === "packages" && section.content) {
    return (
      <div
        className="overflow-x-auto prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    );
  }
  if (section.type === "cta" && section.content) {
    return (
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/team-up-request"
          className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#40E0D0] text-black font-bold text-lg hover:bg-[#2E8B57] hover:text-white transition-colors duration-300 text-center"
        >
          REQUEST AS BUSINESS
        </Link>
        <Link
          to="/join-as-talent"
          className="w-full sm:w-auto px-8 py-4 rounded-lg border-2 border-[#40E0D0] text-[#40E0D0] font-bold text-lg hover:bg-[#40E0D0] hover:text-black transition-colors duration-300 text-center"
        >
          REQUEST AS INTERN
        </Link>
      </div>
    );
  }
  if (section.type === "target" && section.content) {
    return (
      <div className="bg-[#008080]/10 border-l-4 border-[#40E0D0] p-6 text-[#F5F5F5] font-medium rounded-lg">
        {section.content}
      </div>
    );
  }
  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: section.content || "" }}
    />
  );
}

const sectionStyles = {
  hero: "bg-gray-900/50 p-10 rounded-xl border border-gray-700 shadow-lg",
  default: "bg-transparent",
  features: "bg-gray-800/50 rounded-xl p-6",
  benefits: "bg-gray-800/50 rounded-xl p-6",
  examples: "bg-gray-800/50 rounded-xl p-6",
  cta: "bg-gradient-to-r from-[#008080] to-[#2E8B57] border border-[#008080] p-10 rounded-xl",
  target: "bg-[#008080]/10 border-l-4 border-[#40E0D0] p-6 rounded-lg",
  flipcards: "bg-gray-900/50 p-10 rounded-xl border border-gray-700",
};

export default function Subpage() {
  const { slug } = useParams();
  const [subpage, setSubpage] = useState(null);
  const [flipcards, setFlipcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        const res = await api.get(`/subpages/slug/${slug}`);
        setSubpage(res.data);
        setFlipcards(res.data.flipcards || []);
      } catch {
        setSubpage(null);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [slug]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <p className="text-slate-400 text-lg">Loading...</p>
      </div>
    );
  if (!subpage)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <p className="text-red-400 text-lg font-semibold">Page not found.</p>
      </div>
    );

  return (
    <AnimatePresence>
      <motion.main
        className="bg-black text-[#F5F5F5] pt-20 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-12 space-y-14 mt-10">

          <section className={` flex flex-col md:flex-row items-center md:gap-10`}>
            {subpage.image && (
              <motion.div
                className="md:w-[320px] flex justify-center mb-8 md:mb-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={`${BASE_URL}${subpage.image}`}
                  alt={subpage.title}
                  className="rounded-lg w-full max-w-[320px] h-[240px] object-cover border border-gray-600"
                />
              </motion.div>
            )}
            <motion.div
              className="flex-1 max-w-full text-center md:text-left"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-extrabold mb-3 text-[#F5F5F5] leading-tight">
                {subpage.title}
              </h1>
              {subpage.description && (
                <p className="text-xl text-slate-300 mb-4">{subpage.description}</p>
              )}
              {subpage.content && (
                <div
                  className="prose prose-invert max-w-none max-w-xl mx-auto md:mx-0"
                  dangerouslySetInnerHTML={{ __html: subpage.content }}
                />
              )}
            </motion.div>
          </section>


          {subpage.sections?.map((section, index) => (
            <motion.section
              key={section._id || section.heading || index}
              className={`py-10 px-6 rounded-xl ${sectionStyles[section.type] || sectionStyles.default}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              {section.heading && (
                <h2
                  className={`text-3xl font-bold mb-6 ${section.type === "cta" ? "text-white" : "text-[#008080]"}`}
                >
                  {section.type === "features" ? `Our ${section.heading}` : section.heading}
                </h2>
              )}
              <SectionContent section={section} flipcards={flipcards} />
            </motion.section>
          ))}

          {flipcards.length > 0 && !subpage.sections?.some(s => s.type === "flipcards") && (
            <motion.section
              className={`p-10 rounded-xl ${sectionStyles.flipcards}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-[#008080]">Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {flipcards.map(card => (
                  <motion.div
                    key={card._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <FlipCard data={card} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </motion.main>
    </AnimatePresence>
  );
}