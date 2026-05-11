import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { Search, X } from "lucide-react";
import { BASE_URL } from "../api";

export default function BlogPage() {
  const [blogData, setBlogData] = useState({
    blogs: [],
    currentPage: 1,
    totalPages: 1,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All"
  );

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const currentPage = parseInt(searchParams.get("page")) || 1;

  const fetchBlogs = useCallback(async (page, category, search) => {
    setLoading(true);
    try {
      const res = await api.get("/blogs", {
        params: {
          page,
          category: category === "All" ? "" : category,
          searchTerm: search,
        },
      });

      setBlogData(res.data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setBlogData({
        blogs: [],
        currentPage: 1,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Suggestions
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchInput.trim() && searchInput !== searchTerm) {
      setShowSuggestions(true);
      setSuggestionLoading(true);

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
          console.error("Suggestion error:", err);
          setSuggestions([]);
        } finally {
          setSuggestionLoading(false);
        }
      }, 300);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
      setSuggestionLoading(false);
    }

    return () => clearTimeout(debounceTimeoutRef.current);
  }, [searchInput, searchTerm]);

  // Main fetch
  useEffect(() => {
    fetchBlogs(currentPage, activeCategory, searchTerm);

    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (activeCategory !== "All")
      params.set("category", activeCategory);
    if (currentPage > 1)
      params.set("page", currentPage.toString());

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [
    currentPage,
    activeCategory,
    searchTerm,
    fetchBlogs,
    searchParams,
    setSearchParams,
  ]);

  // Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/blogs/categories");
        const cats = Array.isArray(res.data) ? res.data : [];
        setCategories(["All", ...cats]);
      } catch (err) {
        console.error(err);
        setCategories(["All"]);
      }
    };

    fetchCategories();
  }, []);

  // Outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handlePageChange = useCallback(
    (page) => {
      const params = new URLSearchParams();

      if (searchTerm) params.set("search", searchTerm);
      if (activeCategory !== "All")
        params.set("category", activeCategory);

      params.set("page", page.toString());

      setSearchParams(params);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [searchTerm, activeCategory, setSearchParams]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (item) => {
    setSearchInput(item.title);
    setSearchTerm(item.title);
    setShowSuggestions(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0F766E]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/20 border-t-[#40E0D0] rounded-full animate-spin" />
          <span className="text-white/70 text-base font-medium">Loading articles…</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F766E]">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-8 px-6">
        {/* Ambient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#40E0D0]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#86E0D6]/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-5 py-2 text-sm text-white mb-3">
              <span className="w-2 h-2 rounded-full bg-[#40E0D0] animate-pulse" />
              Our Blog
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white mb-2">
              Insights &amp; <span className="text-[#40E0D0]">Ideas</span>
            </h1>

            <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-8 mb-6">
              Discover expert perspectives on HR innovation
            </p>

            {/* Big search bar */}
            <div className="max-w-2xl mx-auto relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative flex items-center">
                  <Search size={20} className="absolute left-5 text-white/50 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-14 pr-32 py-4 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/40 text-base font-medium focus:outline-none focus:border-[#40E0D0] focus:bg-white/15 transition-all shadow-lg"
                    placeholder="Search articles…"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => { setSearchInput(""); setShowSuggestions(false); }}
                      className="absolute right-24 text-white/40 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-2 px-5 py-2.5 bg-[#40E0D0] text-black font-bold text-sm rounded-xl hover:bg-white transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Suggestions dropdown — z-50 so it floats above everything */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    ref={suggestionsRef}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl overflow-hidden"
                    style={{ zIndex: 100, background: "#0a4f4a", border: "1px solid rgba(64,224,208,0.25)" }}
                  >
                    {suggestionLoading ? (
                      <div className="p-4 text-center text-white/50 text-sm">Searching…</div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => handleSuggestionClick(item)}
                          className="px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white cursor-pointer border-b border-white/10 text-sm transition-colors"
                        >
                          {item.title}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-white/40 text-sm">No suggestions found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Category filter bar — sits between hero and content ── */}
      <div className="px-6 py-5">
        <div className="mx-auto max-w-7xl flex justify-center">
          <div className="inline-flex flex-wrap gap-2 justify-center bg-white/8 border border-white/15 rounded-2xl px-4 py-3 backdrop-blur-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#40E0D0] text-black shadow-md"
                    : "text-white/65 hover:text-white hover:bg-white/15"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">

          {/* Blog grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogData.blogs.length > 0 ? (
              blogData.blogs.map((blog, idx) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                >
                  <Link
                    to={`/blog/${blog.slug || blog._id}`}
                    className="group block overflow-hidden rounded-[24px] border border-white/20 bg-[#D9F3F0] transition hover:-translate-y-2 hover:shadow-2xl duration-300"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={blog.image ? `${BASE_URL}${blog.image}` : "https://via.placeholder.com/400x250"}
                        alt={blog.title}
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      {blog.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs bg-[#0F766E]/15 text-[#0F766E] px-2.5 py-1 rounded-full font-semibold">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="font-black text-xl mb-3 text-emerald-900 group-hover:text-[#0F766E] transition leading-snug">
                        {blog.title}
                      </h3>
                      <p className="text-black/60 text-sm leading-6 line-clamp-3 mb-4">
                        {blog.summary}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[#0F766E] font-bold text-sm">
                        Read Article
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
                    <Search size={28} className="text-white/30" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">No articles found</h3>
                  <p className="text-white/40 text-sm mb-6">Try a different search term or browse all categories.</p>
                  <button
                    onClick={() => { setSearchInput(""); setSearchTerm(""); setActiveCategory("All"); }}
                    className="px-6 py-3 bg-[#40E0D0] text-black font-bold rounded-xl hover:bg-white transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {blogData.totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              {[...Array(blogData.totalPages).keys()].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 ${
                      page === blogData.currentPage
                        ? "bg-[#40E0D0] text-black shadow-md"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </main>
  );
}