import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
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
  const searchInputRef = useRef(null);

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // SINGLE FETCH FUNCTION
  const fetchBlogs = useCallback(async (page, category, search) => {
    setLoading(true);
    try {
      const res = await api.get("/blogs", {
        params: {
          page: page,
          category: category === "All" ? "" : category,
          searchTerm: search,
        },
      });
      setBlogData(res.data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setBlogData({ blogs: [], currentPage: 1, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, []);

  // SINGLE EFFECT FOR ALL DATA FETCHING
  useEffect(() => {
    let timeoutId;

    // If it's a search/category change, debounce it
    if (currentPage === 1) {
      timeoutId = setTimeout(() => {
        fetchBlogs(currentPage, activeCategory, searchTerm);
        
        // Update URL without causing re-render
        const newParams = new URLSearchParams();
        if (searchTerm) newParams.set("search", searchTerm);
        if (activeCategory !== "All") newParams.set("category", activeCategory);
        newParams.set("page", "1");
        
        // Only update URL if it's different
        const currentUrl = searchParams.toString();
        const newUrl = newParams.toString();
        if (currentUrl !== newUrl) {
          setSearchParams(newParams, { replace: true });
        }
      }, 500);
    } else {
      // For page changes, fetch immediately
      fetchBlogs(currentPage, activeCategory, searchTerm);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentPage, activeCategory, searchTerm, fetchBlogs, searchParams, setSearchParams]);

  // EFFECT TO FETCH CATEGORIES ONCE ON MOUNT
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/blogs/categories");
        setCategories(["All", ...res.data]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories(["All"]);
      }
    };
    fetchCategories();
  }, []);

  // HANDLER TO UPDATE URL PARAMS FOR PAGE CHANGES
  const handlePageChange = useCallback((page) => {
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set("search", searchTerm);
    if (activeCategory !== "All") newParams.set("category", activeCategory);
    newParams.set("page", page.toString());
    
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchTerm, activeCategory, setSearchParams]);

  // HANDLER TO UPDATE CATEGORY
  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  // HANDLER FOR SEARCH INPUT
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-[#0F766E] rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-slate-600 font-medium">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#0F766E] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-bold mb-4 border border-white/20 text-white">
              <span className="w-2 h-2 bg-emerald-300 rounded-full mr-2 animate-pulse"></span>
              Latest Insights & Trends
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-3 text-white leading-tight">
              Insights & Ideas
            </h1>
            
            <p className="text-xl lg:text-2xl text-white max-w-3xl mx-auto leading-relaxed">
              Discover expert perspectives on HR innovation, AI transformation, and cutting-edge software solutions
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2">
                  <div className="flex items-center">
                    <Search className="ml-4 text-white/60 pointer-events-none" size={22} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search articles, topics, or keywords..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="flex-1 bg-transparent text-white placeholder-white/60 px-4 py-3 text-lg focus:outline-none"
                      autoComplete="off"
                    />
                    <div className="bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-4 py-2 text-sm font-medium cursor-pointer">
                      Search
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Content Section */}
      <section className="relative -mt-16 z-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Categories Filter */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 mb-12 backdrop-blur-sm">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white shadow-lg shadow-emerald-500/25"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          {blogData.blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
              {blogData.blogs.map((blog, idx) => (
                <motion.article
                  key={`${blog._id}-${activeCategory}-${searchTerm}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/50"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={blog.image ? `${BASE_URL}${blog.image}` : "https://via.placeholder.com/400x250/f1f5f9/64748b?text=Blog+Image"}
                      alt={blog.title}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="font-bold text-xl mb-4 text-slate-800 line-clamp-2 group-hover:text-[#0F766E] transition-colors duration-300">
                      {blog.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">
                      {blog.summary}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {blog.tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag} 
                            className="bg-gradient-to-r from-emerald-50 to-teal-50 text-[#0F766E] text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-200/50"
                          >
                            #{tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full">
                            +{blog.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Read More Link */}
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center font-semibold text-[#0F766E] hover:text-[#0D9488] transition-colors duration-300 group/link"
                    >
                      Read Full Article
                      <svg 
                        className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">No articles found</h3>
                <p className="text-slate-600 mb-8">
                  {searchTerm || activeCategory !== "All" 
                    ? "Try adjusting your search terms or browse different categories" 
                    : "New content is coming soon. Check back later for fresh insights"}
                </p>
                {(searchTerm || activeCategory !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("All");
                    }}
                    className="bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Pagination */}
          {blogData.totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-2" aria-label="Blog pagination">
                <div className="flex items-center space-x-1">
                  {/* Previous button */}
                  {blogData.currentPage > 1 && (
                    <button
                      onClick={() => handlePageChange(blogData.currentPage - 1)}
                      className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
                      aria-label="Previous page"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Page numbers */}
                  {[...Array(blogData.totalPages).keys()].map((i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                          page === blogData.currentPage
                            ? "bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white shadow-lg"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                        aria-label={`Page ${page}`}
                        aria-current={page === blogData.currentPage ? "page" : undefined}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  {/* Next button */}
                  {blogData.currentPage < blogData.totalPages && (
                    <button
                      onClick={() => handlePageChange(blogData.currentPage + 1)}
                      className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
                      aria-label="Next page"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}