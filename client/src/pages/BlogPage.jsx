import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { Search, X } from "lucide-react";
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

  // Separate input value from search term - no auto search
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");

  // Live search suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null); // For canceling requests

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

  // LIVE SEARCH SUGGESTIONS EFFECT
  useEffect(() => {
<<<<<<< feature/blogpage-update
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Only show suggestions if there's input and it's different from current search
    if (searchInput.trim() && searchInput !== searchTerm) {
      setSuggestionLoading(true);
      setShowSuggestions(true);

      // Debounce the suggestions API call
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await api.get("/blogs/suggestions", {
            params: {
              searchTerm: searchInput,
              limit: 5,
            },
          });
          setSuggestions(res.data || []);
        } catch (err) {
          console.error("Failed to fetch suggestions:", err);
          setSuggestions([]);
        } finally {
          setSuggestionLoading(false);
=======
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
>>>>>>> main
        }
      }, 300); // Faster debounce for suggestions
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
      setSuggestionLoading(false);
    }

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchInput, searchTerm, activeCategory]);

  // EFFECT FOR DATA FETCHING (only when searchTerm, category, or page changes)
  useEffect(() => {
    fetchBlogs(currentPage, activeCategory, searchTerm);

    // Update URL
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set("search", searchTerm);
    if (activeCategory !== "All") newParams.set("category", activeCategory);
    if (currentPage > 1) newParams.set("page", currentPage.toString());

    // Only update URL if it's different
    const currentUrl = searchParams.toString();
    const newUrl = newParams.toString();
    if (currentUrl !== newUrl) {
      setSearchParams(newParams, { replace: true });
    }
  }, [currentPage, activeCategory, searchTerm, fetchBlogs, searchParams, setSearchParams]);

  // EFFECT TO FETCH CATEGORIES ONCE ON MOUNT
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/blogs/categories");
        const cats = Array.isArray(res.data) ? res.data : [];
        setCategories(["All", ...cats]);
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

  // HANDLER FOR SEARCH INPUT (only updates input value, no search)
  const handleSearchChange = useCallback((e) => {
    setSearchInput(e.target.value);
  }, []);

  // HANDLER FOR SEARCH BUTTON CLICK
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setShowSuggestions(false);
  }, [searchInput]);

  // HANDLER FOR ENTER KEY IN SEARCH INPUT
  const handleSearchKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchTerm(searchInput);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      searchInputRef.current?.blur();
    }
  }, [searchInput]);

  // HANDLER FOR SUGGESTION CLICK
  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchInput(suggestion.title);
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
  }, []);

  // HANDLER FOR CLICKING OUTSIDE SUGGESTIONS
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

            {/* Enhanced Search Bar with Live Suggestions */}
            <div className="max-w-2xl mx-auto relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2">
                    <div className="flex items-center">
                      <Search className="ml-4 text-white/60 pointer-events-none" size={22} />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search articles, topics, or keywords..."
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyPress}
                        onFocus={() => searchInput.trim() && setShowSuggestions(true)}
                        className="flex-1 bg-transparent text-white placeholder-white/60 px-4 py-3 text-lg focus:outline-none"
                        autoComplete="off"
                      />
                      {searchInput && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchInput("");
                            setShowSuggestions(false);
                            searchInputRef.current?.focus();
                          }}
                          className="mr-2 p-1 text-white/60 hover:text-white/80 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <button
                        type="submit"
                        className="bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-4 py-2 text-sm font-medium cursor-pointer"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Live Search Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    ref={suggestionsRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl z-50 overflow-hidden"
                  >
                    {suggestionLoading ? (
                      <div className="p-4 text-center">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-slate-600 text-sm">Searching...</p>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <div className="max-h-80 overflow-y-auto">
                        {suggestions.map((suggestion, idx) => (
                          <motion.div
                            key={suggestion._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="flex items-center p-4 hover:bg-emerald-50/50 cursor-pointer transition-colors border-b border-slate-200/30 last:border-b-0"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                              <img
                                src={suggestion.image ? `${BASE_URL}${suggestion.image}` : "https://via.placeholder.com/48x48/f1f5f9/64748b?text=?"}
                                alt={suggestion.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-800 text-sm line-clamp-1 mb-1">
                                {suggestion.title}
                              </h4>
                              <p className="text-slate-600 text-xs line-clamp-1">
                                {suggestion.summary}
                              </p>
                            </div>
                            <Search className="w-4 h-4 text-slate-400 ml-2 flex-shrink-0" />
                          </motion.div>
                        ))}
                        <div className="p-3 bg-slate-50/50 text-center">
                          <button
                            onClick={handleSearchSubmit}
                            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
                          >
                            See all results for "{searchInput}"
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600 text-sm">No suggestions found</p>
                        <button
                          onClick={handleSearchSubmit}
                          className="text-emerald-600 hover:text-emerald-700 font-medium text-sm mt-2 transition-colors"
                        >
                          Search anyway
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${activeCategory === category
<<<<<<< feature/blogpage-update
                      ? "bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white shadow-lg shadow-emerald-500/25"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900"
=======
                    ? "bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white shadow-lg shadow-emerald-500/25"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900"
>>>>>>> main
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <AnimatePresence>
              {blogData.blogs.length > 0 ? (
                blogData.blogs.map((blog, idx) => (
                  <motion.div
                    key={blog._id}
                    className="p-4 border rounded-xl bg-[#1a1a1a] hover:shadow-xl transition flex flex-col h-full"
                    style={{ borderColor: "#008080" }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <img
                      src={
                        blog.image
                          ? `${BASE_URL}${blog.image}`
                          : "https://via.placeholder.com/400x250/ffffff?text=Blog+Image"
                      }
                      alt={blog.title}
                      className="h-48 w-full object-cover rounded-lg mb-4"
                    />

<<<<<<< feature/blogpage-update
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
=======
                    <div className="flex-1 flex flex-col justify-between">
                      <h3 className="font-bold text-xl mb-2 text-[#008080]">
                        {blog.title}
                      </h3>

                      <p className="text-[#F5F5F5]/70 text-sm mb-4 flex-grow line-clamp-3">
                        {blog.summary}
                      </p>

                      <div className="mt-auto flex flex-wrap gap-2">
                        {blog.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="bg-[#008080]/20 text-[#40E0D0] text-xs font-medium px-2 py-1 rounded-full"
>>>>>>> main
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                // ✅ EMPTY STATE
                <div className="col-span-full text-center py-20">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    No articles found
                  </h3>
                  <p className="text-slate-600 mb-8">
                    {searchTerm || activeCategory !== "All"
                      ? "Try adjusting your search terms or browse different categories"
                      : "New content is coming soon. Check back later"}
                  </p>

                  {(searchTerm || activeCategory !== "All") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setActiveCategory("All");
                      }}
                      className="bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white px-6 py-3 rounded-2xl font-semibold"
                    >
<<<<<<< feature/blogpage-update
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
                      setSearchInput("");
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
=======
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
>>>>>>> main

          {/* Pagination */}
          {blogData.totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="bg-white rounded-2xl shadow-lg border p-2">
                <div className="flex items-center space-x-1">
                  {blogData.currentPage > 1 && (
                    <button onClick={() => handlePageChange(blogData.currentPage - 1)}>
                      Prev
                    </button>
                  )}

<<<<<<< feature/blogpage-update
                  {/* Page numbers */}
                  {[...Array(blogData.totalPages).keys()].map((i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${page === blogData.currentPage
                            ? "bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white shadow-lg"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        aria-label={`Page ${page}`}
                        aria-current={page === blogData.currentPage ? "page" : undefined}
                      >
=======
                  {[...Array(blogData.totalPages).keys()].map((i) => {
                    const page = i + 1;
                    return (
                      <button key={page} onClick={() => handlePageChange(page)}>
>>>>>>> main
                        {page}
                      </button>
                    );
                  })}

<<<<<<< feature/blogpage-update
                  {/* Next button */}
=======
>>>>>>> main
                  {blogData.currentPage < blogData.totalPages && (
                    <button onClick={() => handlePageChange(blogData.currentPage + 1)}>
                      Next
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