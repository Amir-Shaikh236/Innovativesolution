import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { Share2, Linkedin, Twitter, Facebook } from 'lucide-react';
import { BASE_URL } from '../api';
export default function BlogOverviewPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/slug/${slug}`);
        setBlog(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setLoading(false);
        setBlog(null);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return <div className="py-16 text-center text-[#F5F5F5] bg-black min-h-screen">Loading blog post...</div>;
  }

  if (!blog) {
    return <div className="py-16 text-center text-red-500 bg-black min-h-screen">Blog post not found.</div>;
  }

  const renderContent = (content) => {
    if (!content) return null;
    return content.split('\n').map((line, index) => (
      <p key={index} className="mb-4">{line}</p>
    ));
  };

  const renderSections = () => {
    if (!blog.body) return <p>{blog.summary}</p>;
    const sections = blog.body.split('§ ');
    return sections.map((section, index) => {
      if (!section.trim()) return null;
      const [title, ...rest] = section.split('\n');
      const content = rest.join('\n');

      if (index === 0 && sections.length > 1) {
        return renderContent(section);
      }

      if (title.trim().startsWith('Expert Insight') || title.trim().startsWith('Key Takeaway')) {
        return (
          <div key={index} className="my-6 p-6 rounded-lg bg-[#008080]/10 border-l-4 border-[#40E0D0] text-[#F5F5F5] italic">
            <h3 className="font-bold text-lg text-[#40E0D0] mb-2">{title.trim()}</h3>
            {renderContent(content)}
          </div>
        );
      } else if (title.trim().startsWith('Conclusion')) {
        return (
          <div key={index} className="mt-8 pt-8 border-t border-[#008080]/20">
            <h3 className="text-2xl font-bold mb-4 text-[#008080]">{title.trim()}</h3>
            {renderContent(content)}
          </div>
        );
      }
      return (
        <div key={index} className="my-6">
          <h3 className="text-2xl font-bold mb-4 text-[#008080]">{title.trim()}</h3>
          {renderContent(content)}
        </div>
      );
    });
  };

  const imageUrl = blog.image ? `${BASE_URL}${blog.image}` : "https://placehold.co/800x800/4F46E5/ffffff?text=Blog+Image";

  return (
    <main className="min-h-screen bg-[#000000] text-[#F5F5F5] font-sans pb-20">
      {/* Hero Section */}
      <section className="w-full min-h-[70vh] flex flex-col md:flex-row items-center justify-center py-16 md:py-24 px-6 md:px-12">

        <div className="w-full md:w-1/2 flex justify-center p-4">
          <motion.img
            src={imageUrl}
            alt={blog.title}
            className="rounded-2xl shadow-2xl w-full max-w-lg aspect-square object-cover"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />

        </div>


        <div className="w-full md:w-1/2 text-center md:text-left p-4 mt-8 md:mt-0">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-[#008080]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {blog.title}
          </motion.h1>
          <motion.div
            className="flex flex-wrap gap-2 justify-center md:justify-start"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {blog.tags && blog.tags.map(tag => (
              <span key={tag} className="bg-[#40E0D0]/20 text-[#F5F5F5] text-xs font-medium px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto bg-black rounded-3xl shadow-xl border border-[#008080]/30 "
      >

        <div className="p-8 md:p-12 prose max-w-none text-[#F5F5F5]">
          <p className="lead text-lg mb-8 text-[#F5F5F5]">{blog.summary}</p>

          {renderSections()}

          <div className="mt-12 flex justify-center space-x-4 border-t pt-8 border-[#008080]/20">
            <Link to="/contact" className="px-6 py-3 bg-[#40E0D0] text-black rounded-lg font-semibold hover:bg-[#2E8B57] transition text-center">
              🚀 Contact us to explore how this applies to your business
            </Link>
          </div>
        </div>

        <div className="p-8 md:p-12 flex justify-end items-center space-x-4 bg-[#000000] border-t border-[#008080]/20 rounded-b-3xl">
          <span className="font-semibold text-[#F5F5F5]">Share:</span>
          <a href="#" aria-label="LinkedIn" className="text-[#40E0D0] hover:text-[#F5F5F5] transition">
            <Linkedin size={24} />
          </a>
          <a href="#" aria-label="Twitter" className="text-[#40E0D0] hover:text-[#F5F5F5] transition">
            <Twitter size={24} />
          </a>
          <a href="#" aria-label="Facebook" className="text-[#40E0D0] hover:text-[#F5F5F5] transition">
            <Facebook size={24} />
          </a>
        </div>
      </motion.article>
    </main>
  );
}
