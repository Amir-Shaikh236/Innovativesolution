import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from '../api';
// Helper to render content by section type
function SectionContent({ section }) {
  if (!section || !section.type) return null;

  switch (section.type) {
    case "overview":
    case "description":
      return (
        <motion.p
          className="text-lg text-[#F5F5F5] leading-relaxed mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      );

    case "features":
    case "benefits":
      const items = Array.isArray(section.content)
        ? section.content
        : section.content.split("\n").filter(Boolean);
      return (
        <motion.ul
          className="list-disc pl-8 space-y-2 text-slate-300 text-lg mb-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {items.map((item, i) => (
            <motion.li
              key={i}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>
      );

    case "cta":
      return (
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href={section.content}
            className="inline-block bg-[#40E0D0] text-black px-8 py-4 rounded font-semibold hover:bg-[#2E8B57] hover:text-white transition-colors duration-300"
          >
            {section.heading || "Call To Action"}
          </a>
        </motion.div>
      );

    default:
      return (
        <motion.div
          className="prose max-w-none text-slate-300 mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      );
  }
}

export default function CategoryOverviewPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategoryAndSubs() {
      try {
        const { data: cat } = await api.get(`/api/categories/slug/${slug}`);
        setCategory(cat);

        if (cat?._id) {
          const { data: subs } = await api.get(`/api/subpages?category=${cat._id}`);
          setSubCategories(subs);
        }
      } catch {
        setError("Failed to load category data.");
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryAndSubs();
  }, [slug]);

  if (loading)
    return (
      <div className="text-center py-20 bg-black text-[#F5F5F5] min-h-screen">
        Loading category...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500 bg-black min-h-screen">
        {error}
      </div>
    );

  if (!category)
    return (
      <div className="text-center py-20 bg-black text-[#F5F5F5] min-h-screen">
        Category not found
      </div>
    );

  return (
    <div className="bg-black min-h-screen w-full">
      <AnimatePresence>
        <motion.main
          className="container mx-auto px-6 pt-22 space-y-20 max-w-6xl text-[#F5F5F5]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero Section */}
          <motion.section
            className="md:flex md:items-center md:justify-between bg-[#008080] text-white rounded-lg p-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="md:w-1/2">
              <h1 className="text-5xl font-bold mb-4">
                {category.heroHeadline || category.name}
              </h1>
              <p className="text-xl mb-8 text-slate-200">
                {category.heroSubtext || category.description}
              </p>
              <div className="space-x-4">
                {category.heroCTAs?.map((btn, idx) => (
                  <a
                    key={idx}
                    href={btn.link}
                    className="inline-block bg-[#40E0D0] text-black px-6 py-3 rounded font-semibold hover:bg-[#2E8B57] hover:text-white transition-colors duration-300"
                  >
                    {btn.text}
                  </a>
                ))}
              </div>
            </div>
            {category.image && (
              <div className="md:w-1/2 mt-8 md:mt-0 text-center">
                <motion.img
                  src={`${BASE_URL}${category.image}`}
                  alt={category.name}
                  className="inline-block w-3/4 rounded shadow-lg"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            )}
          </motion.section>

          {/* Dynamic Sections */}
          {category.sections?.map((section, idx) => (
            <motion.section
              key={section._id || section.heading || idx}
              className={`p-10 rounded-xl ${section.type === "cta"
                ? "bg-[#008080] text-white"
                : "bg-gray-900/50 border border-gray-700"
                }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.3 }}
            >
              {section.heading && (
                <h2
                  className={`text-3xl font-bold mb-6 ${section.type === "cta" ? "text-white" : "text-[#008080]"
                    }`}
                >
                  {section.type === "features"
                    ? `Our ${section.heading}`
                    : section.heading}
                </h2>
              )}
              <SectionContent section={section} />
            </motion.section>
          ))}

          {/* Subcategories Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-[#008080]">
              Our {category.name} Subcategories
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {subCategories.length ? (
                subCategories.map((subcat) => (
                  <Link
                    to={`/subpage/${subcat.slug}`}
                    key={subcat._id}
                    className="border border-gray-700 rounded-lg p-6 hover:bg-gray-900/50 transition-colors block cursor-pointer"
                  >
                    {subcat.image && (
                      <img
                        src={`${BASE_URL}${subcat.image}`}
                        alt={subcat.title}
                        className="mb-4 w-12 h-12 object-cover"
                      />
                    )}
                    <h3 className="font-semibold text-xl mb-2 text-[#F5F5F5]">
                      {subcat.title}
                    </h3>
                    <p className="text-slate-300 mb-4">
                      {subcat.description}
                    </p>
                    <button className="text-[#40E0D0] font-semibold hover:underline">
                      Learn More
                    </button>
                  </Link>
                ))
              ) : (
                <p className="text-slate-400">No subcategories added.</p>
              )}
            </div>
          </motion.section>

          {/* Industries Section */}
          {category.industries?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-[#008080]">
                Industries We Serve
              </h2>
              <ul className="flex flex-wrap gap-4 text-[#40E0D0] font-semibold">
                {category.industries.map((industry, i) => (
                  <li
                    key={i}
                    className="bg-[#008080]/30 rounded-full px-4 py-2"
                  >
                    {industry}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Process Flow Section */}
          {category.processFlow?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-[#008080]">
                How It Works
              </h2>
              <ol className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
                {category.processFlow.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex-1 bg-gray-900/50 border border-gray-700 p-6 rounded text-center"
                  >
                    <div className="text-[#40E0D0] font-bold text-xl mb-2">
                      {idx + 1}
                    </div>
                    <h3 className="font-semibold mb-1 text-[#F5F5F5]">
                      {step.title}
                    </h3>
                    <p className="text-slate-300">{step.description}</p>
                  </li>
                ))}
              </ol>
            </motion.section>
          )}

          {/* Case Studies Section */}
          {category.caseStudies?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-[#008080]">
                Case Studies / Success Stories
              </h2>
              <div className="space-y-6">
                {category.caseStudies.map((caseStudy, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-700 rounded-lg p-6"
                  >
                    <h3 className="font-semibold text-xl mb-2 text-[#F5F5F5]">
                      {caseStudy.title}
                    </h3>
                    <p className="text-slate-300">{caseStudy.summary}</p>
                    {caseStudy.link && (
                      <a
                        href={caseStudy.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#40E0D0] hover:underline"
                      >
                        Read More
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Call To Action Section */}
          {category.cta && (
            <motion.section
              className="bg-[#008080] text-white rounded-lg p-10 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-4">
                {category.cta.headline}
              </h2>
              <p className="mb-6 text-lg text-slate-200">
                {category.cta.subtext}
              </p>
              {category.cta.buttons?.map((btn, i) => (
                <a
                  key={i}
                  href={btn.link}
                  className="inline-block bg-[#40E0D0] text-black px-6 py-3 rounded font-semibold mx-2 hover:bg-[#2E8B57] hover:text-white transition-colors duration-300"
                >
                  {btn.text}
                </a>
              ))}
            </motion.section>
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
