import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { Search } from "lucide-react";
import { BASE_URL } from '../api';
export default function BlogPage() {
  const [blogData, setBlogData] = useState({
    blogs: [],
    currentPage: 1,
    totalPages: 1,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // EFFECT TO FETCH BLOGS WHEN FILTERS OR PAGE CHANGES
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await api.get("/blogs", {
          params: {
            page: currentPage,
            category: activeCategory,
            searchTerm: searchTerm,
          },
        });
        setBlogData(res.data); // The API now returns an object: { blogs, currentPage, totalPages }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, activeCategory, searchTerm]); // Re-run this effect when any of these change

  // EFFECT TO FETCH CATEGORIES ONCE ON MOUNT
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/blogs/categories");
        setCategories(["All", ...res.data]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // HANDLER TO UPDATE URL PARAMS FOR PAGE CHANGES
  const handlePageChange = (page) => {
    setSearchParams(prev => {
      prev.set('page', page);
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // HANDLER TO UPDATE URL PARAMS FOR CATEGORY CHANGES
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchParams({ page: 1, category: category, search: searchTerm });
  };

  // HANDLER FOR SEARCH INPUT, with debounce to prevent excessive API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchParams({ page: 1, category: activeCategory, search: searchTerm });
    }, 500); // Wait for 500ms of inactivity before making the API call

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeCategory, setSearchParams]);


  if (loading) {
    return <div className="py-16 text-center text-[#F5F5F5]">Loading blogs...</div>;
  }

  return (
    <main className="min-h-screen bg-[#000000] text-[#F5F5F5] font-sans px-6 py-20 md:py-32 flex flex-col items-center">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center mb-16"
      >
        <h1 className="text-5xl font-extrabold mb-4 text-[#008080]">Insights & Ideas</h1>
        <p className="text-lg text-[#F5F5F5] max-w-xl mx-auto">
          Explore expert perspectives on HR, AI, and software innovation.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for Insights"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg border border-[#008080] bg-black text-[#F5F5F5]"
            />
          </div>
        </div>
      </motion.section>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-4xl mx-auto">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${activeCategory === category
              ? "bg-[#40E0D0] text-black shadow-md"
              : "bg-transparent text-[#F5F5F5] border border-[#008080]/30 hover:bg-[#008080]/20"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <AnimatePresence>
          {blogData.blogs.map((blog, idx) => (
            <motion.div
              key={blog._id}
              className="block p-4 border rounded-xl bg-[#1a1a1a] hover:shadow-xl transition flex flex-col h-full"
              style={{ borderColor: "#008080" }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ delay: idx * 0.1 }}
            >
              <img
                src={blog.image ? `${BASE_URL}${blog.image}` : "https://via.placeholder.com/400x250/ffffff?text=Blog+Image"}
                alt={blog.title}
                className="h-48 w-full object-cover rounded-lg mb-4"
              />
              <div className="flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-xl mb-2 text-[#008080]">{blog.title}</h3>
                <p className="text-[#F5F5F5]/70 text-sm mb-4 flex-grow line-clamp-3">{blog.summary}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {blog.tags && blog.tags.map(tag => (
                    <span key={tag} className="bg-[#008080]/20 text-[#40E0D0] text-xs font-medium px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="text-[#40E0D0] font-semibold inline-flex items-center hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {blogData.totalPages > 1 && (
        <nav className="flex justify-center mt-12 space-x-2">
          {[...Array(blogData.totalPages).keys()].map((i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded ${page === blogData.currentPage
                  ? "bg-[#40E0D0] text-black"
                  : "bg-[#F5F5F5]/10 text-[#F5F5F5] hover:bg-[#F5F5F5]/20"
                  }`}
              >
                {page}
              </button>
            );
          })}
        </nav>
      )}
    </main>
  );
}