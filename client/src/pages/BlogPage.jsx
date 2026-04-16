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
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Insights & Ideas
          </h1>

          <p className="mb-8">
            Discover expert perspectives on HR innovation
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="bg-white/10 rounded-2xl p-2 flex items-center">
                <Search className="ml-4" />

                <input
                  ref={searchInputRef}
                  value={searchInput}
                  onChange={(e) =>
                    setSearchInput(e.target.value)
                  }
                  className="flex-1 bg-transparent px-4 py-3 outline-none"
                  placeholder="Search..."
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setShowSuggestions(false);
                    }}
                  >
                    <X />
                  </button>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 bg-white/20 rounded-xl"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  {suggestionLoading ? (
                    <div className="p-4 text-center">
                      Searching...
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <div
                        key={item._id}
                        onClick={() =>
                          handleSuggestionClick(item)
                        }
                        className="p-4 hover:bg-slate-100 cursor-pointer border-b"
                      >
                        {item.title}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      No suggestions found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="-mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Categories */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setActiveCategory(cat)
                  }
                  className={`px-6 py-3 rounded-2xl ${activeCategory === cat
                    ? "bg-[#0F766E] text-white"
                    : "bg-slate-100"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blogs */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {blogData.blogs.length > 0 ? (
              blogData.blogs.map((blog, idx) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.1,
                  }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <img
                    src={
                      blog.image
                        ? `${BASE_URL}${blog.image}`
                        : "https://via.placeholder.com/400x250"
                    }
                    alt={blog.title}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3">
                      {blog.title}
                    </h3>

                    <p className="text-slate-600 text-sm mb-4">
                      {blog.summary}
                    </p>

                    {blog.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags
                          .slice(0, 3)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-slate-100 px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                    )}

                    <Link
                      to={`/blog/${blog.slug || blog._id}`}
                      className="text-[#0F766E] font-semibold"
                    >
                      Read Full Article
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <h3 className="text-2xl font-bold mb-4">
                  No articles found
                </h3>

                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    setActiveCategory("All");
                  }}
                  className="px-6 py-3 bg-[#0F766E] text-white rounded-xl"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {blogData.totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              {[...Array(blogData.totalPages).keys()].map(
                (_, i) => {
                  const page = i + 1;

                  return (
                    <button
                      key={page}
                      onClick={() =>
                        handlePageChange(page)
                      }
                      className={`w-10 h-10 rounded-xl ${page ===
                        blogData.currentPage
                        ? "bg-[#0F766E] text-white"
                        : "bg-white"
                        }`}
                    >
                      {page}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}