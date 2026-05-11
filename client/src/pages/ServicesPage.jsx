import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { BASE_URL } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  X,
} from "lucide-react";
import "./FlipCard.css";

/* ─────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────── */
function ServicesHero({ totalCount }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-10 px-6">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#40E0D0]/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#86E0D6]/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-5 py-2 text-sm text-white mb-4">
            <span className="w-2 h-2 rounded-full bg-[#40E0D0] animate-pulse" />
            What We Offer
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white mb-3">
            Our <span className="text-[#40E0D0]">Services</span>
          </h1>

          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-8 mb-3">
            Explore our full suite of staffing, automation, and digital growth
            solutions — each designed to move your business forward.
          </p>

          {totalCount > 0 && (
            <p className="text-sm text-white/40 font-medium">
              {totalCount} service{totalCount !== 1 ? "s" : ""} available
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Filter Bar
───────────────────────────────────────────── */
function FilterBar({ categories, selectedCats, onToggle, search, onSearch, onClear }) {
  return (
    <div className="px-6 pb-12">
      <div className="mx-auto max-w-3xl flex flex-col items-center gap-5">

        {/* Big centered search */}
        <div className="relative w-full">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search services…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/40 text-base font-medium focus:outline-none focus:border-[#40E0D0] focus:bg-white/15 transition-all shadow-lg"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category pills row */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={onClear}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
              selectedCats.length === 0
                ? "bg-[#40E0D0] text-black shadow-md"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const active = selectedCats.includes(cat.name);
            return (
              <button
                key={cat._id}
                onClick={() => onToggle(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  active
                    ? "bg-[#40E0D0] text-black shadow-md"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Service Card — tap/click flip (works on mobile)
───────────────────────────────────────────── */
function ServiceCard({ service, navigate }) {
  const [flipped, setFlipped] = useState(false);

  const imageUrl = service.image
    ? `${BASE_URL}${service.image}`
    : service.img
    ? service.img
    : "https://placehold.co/600x400/0F766E/ffffff?text=Service";

  const categoryName =
    typeof service.category === "object"
      ? service.category?.name
      : service.category;

  const cardStyle = {
    height: "380px",
    width: "100%",
    perspective: "1200px",
    cursor: "pointer",
    flexShrink: 0,
  };

  const innerStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    transition: "transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)",
    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    borderRadius: "16px",
  };

  const faceBase = {
    position: "absolute",
    top: 0, left: 0,
    width: "100%", height: "100%",
    borderRadius: "16px",
    WebkitBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
    overflow: "hidden",
  };

  const frontStyle = {
    ...faceBase,
    background: "#D9F3F0",
    border: "1px solid rgba(255,255,255,0.4)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    display: "flex",
    flexDirection: "column",
    transform: "rotateY(0deg)",
  };

  const backStyle = {
    ...faceBase,
    background: "linear-gradient(145deg, #0a4f4a 0%, #0F766E 45%, #14b8a6 100%)",
    border: "1px solid rgba(64,224,208,0.4)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
    padding: "24px 22px 22px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transform: "rotateY(180deg)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      style={cardStyle}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${service.title || service.name}`}
      /* Toggle flip on tap/click; navigate on double-tap is handled by the button */
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === "Enter") setFlipped((f) => !f);
      }}
      /* Desktop hover */
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div style={innerStyle}>

        {/* ── FRONT ── */}
        <div style={frontStyle}>
          <div style={{ height: "200px", flexShrink: 0, overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
            <img
              src={imageUrl}
              alt={service.title || service.name}
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) =>
                (e.currentTarget.src =
                  "https://placehold.co/600x400/0F766E/ffffff?text=Service")
              }
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "18px 20px" }}>
            {categoryName && (
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#0F766E", marginBottom: "6px", display: "block" }}>
                {categoryName}
              </span>
            )}
            <h3 style={{ fontWeight: 900, fontSize: "17px", color: "#064e3b", lineHeight: 1.35, margin: 0 }}>
              {service.title || service.name}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#0F766E", fontSize: "12px", fontWeight: 600, marginTop: "10px" }}>
              Tap to learn more
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={backStyle}>
          {/* Top accent bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg, #40E0D0, #86E0D6, #40E0D0)" }} />
          {/* Decorative blobs */}
          <div style={{ position: "absolute", bottom: "60px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(64,224,208,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "40px", left: "-30px", width: "90px", height: "90px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {categoryName && (
              <span style={{ display: "inline-block", fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "#40E0D0", background: "rgba(64,224,208,0.15)", border: "1px solid rgba(64,224,208,0.35)", borderRadius: "20px", padding: "3px 10px", marginBottom: "14px" }}>
                {categoryName}
              </span>
            )}
            <h3 style={{ fontWeight: 900, fontSize: "22px", color: "#fff", lineHeight: 1.2, marginBottom: "10px", letterSpacing: "-0.5px" }}>
              {service.title || service.name}
            </h3>
            <div style={{ width: "36px", height: "3px", borderRadius: "2px", background: "#40E0D0", marginBottom: "10px" }} />
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "13px", lineHeight: 1.7, fontWeight: 400 }}>
              {service.description || service.desc || "Explore this service to learn how we can help your business grow."}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/subpage/${service.slug}`); }}
            style={{
              position: "relative", zIndex: 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              width: "100%", padding: "13px 16px", borderRadius: "12px",
              background: "linear-gradient(135deg, #40E0D0 0%, #2dd4bf 100%)",
              color: "#064e3b", fontWeight: 800, fontSize: "15px",
              border: "none", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(64,224,208,0.5)",
              transition: "all 0.2s", marginTop: "14px", flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0F766E"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #40E0D0 0%, #2dd4bf 100%)"; e.currentTarget.style.color = "#064e3b"; }}
            aria-label={`Learn more about ${service.title || service.name}`}
          >
            Learn More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
        </div>

      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Category Spotlight (default grouped view)
───────────────────────────────────────────── */
function CategorySpotlight({ categories, subpages, navigate }) {
  return (
    <div className="space-y-8">
      {categories.map((cat) => {
        const catServices = subpages.filter(
          (sp) => (sp.category?.name || sp.category) === cat.name
        );
        if (catServices.length === 0) return null;

        return (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            style={{
              borderRadius: "20px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              overflow: "hidden",
            }}
          >
            {/* ── Category header bar ── */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 28px",
              background: "rgba(64,224,208,0.10)",
              borderBottom: "1px solid rgba(64,224,208,0.18)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {/* Teal accent dot */}
                <div style={{
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: "#40E0D0",
                  boxShadow: "0 0 8px rgba(64,224,208,0.7)",
                  flexShrink: 0,
                }} />
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "#40E0D0", marginBottom: "2px" }}>
                    Category
                  </p>
                  <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#fff", lineHeight: 1.2, margin: 0, letterSpacing: "-0.3px" }}>
                    {cat.name}
                  </h2>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                {cat.description && (
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", maxWidth: "320px", lineHeight: 1.5, margin: 0, display: "none" }}
                    className="hidden lg:block">
                    {cat.description}
                  </p>
                )}
                {cat.slug && (
                  <Link
                    to={`/category/${cat.slug}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      fontSize: "12px", fontWeight: 700, color: "#40E0D0",
                      background: "rgba(64,224,208,0.12)",
                      border: "1px solid rgba(64,224,208,0.3)",
                      borderRadius: "20px", padding: "6px 14px",
                      textDecoration: "none", whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#40E0D0"; e.currentTarget.style.color = "#064e3b"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(64,224,208,0.12)"; e.currentTarget.style.color = "#40E0D0"; }}
                  >
                    View all
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            </div>

            {/* ── Cards row ── */}
            <div style={{ padding: "20px 20px" }} className="sm:p-7">
              {cat.description && (
                <p className="lg:hidden" style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "20px", lineHeight: 1.6 }}>
                  {cat.description}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {catServices.map((service) => (
                  <ServiceCard key={service._id} service={service} navigate={navigate} />
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Flat Grid (filtered / search results)
───────────────────────────────────────────── */
function FlatGrid({ services, navigate }) {
  if (services.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-white/40 text-lg">No services match your filters.</p>
        <p className="text-white/25 text-sm mt-2">
          Try adjusting your search or category selection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} navigate={navigate} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CTA Banner
───────────────────────────────────────────── */
function CTABanner() {
  const navigate = useNavigate();
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[32px] bg-[#D9F3F0] border border-white/80 p-10 md:p-16 shadow-2xl text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-emerald-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-black/70 text-lg max-w-xl mx-auto mb-10 leading-7">
            Tell us about your goals and we'll build a tailored solution for
            your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/team-up-request")}
              className="rounded-xl bg-[#0F766E] px-8 py-4 font-bold text-white hover:bg-[#0d6560] transition-colors duration-200"
            >
              Request a Proposal
            </button>
            <Link
              to="/contact"
              className="rounded-xl border-2 border-[#0F766E] px-8 py-4 font-bold text-[#0F766E] hover:bg-[#0F766E] hover:text-white transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function ServicesPage() {
  const [allCategories, setAllCategories] = useState([]);
  const [subpages, setSubpages] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, spRes] = await Promise.all([
          api.get("/categories"),
          api.get("/subpages"),
        ]);
        setAllCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setSubpages(Array.isArray(spRes.data) ? spRes.data : []);
      } catch {
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleCategory = (catName) => {
    setSelectedCats((prev) =>
      prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName]
    );
  };

  const isFiltered = selectedCats.length > 0 || search.trim() !== "";

  const filteredSubpages = subpages.filter((sp) => {
    const catMatch =
      selectedCats.length === 0 ||
      selectedCats.includes(sp.category?.name || sp.category);
    const searchMatch =
      search.trim() === "" ||
      (sp.title || sp.name || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase()) ||
      (sp.description || sp.desc || "")
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    return catMatch && searchMatch;
  });

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F766E]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/20 border-t-[#40E0D0] rounded-full animate-spin" />
          <span className="text-white/70 text-base font-medium">Loading services…</span>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F766E] text-white">
        <div className="text-center">
          <p className="text-red-300 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-[#40E0D0] text-black font-bold hover:bg-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#0F766E] text-white"
      >
        {/* Hero */}
        <ServicesHero totalCount={subpages.length} />

        {/* Filter bar */}
        <FilterBar
          categories={allCategories}
          selectedCats={selectedCats}
          onToggle={toggleCategory}
          search={search}
          onSearch={setSearch}
          onClear={() => { setSelectedCats([]); setSearch(""); }}
        />

        {/* Content */}
        <main className="mx-auto max-w-7xl px-6 py-14">
          {isFiltered ? (
            <>
              <div className="mb-8 flex items-center justify-between">
                <p className="text-white/50 text-sm">
                  {filteredSubpages.length} result
                  {filteredSubpages.length !== 1 ? "s" : ""}
                  {search && (
                    <span>
                      {" "}for{" "}
                      <span className="text-white font-semibold">"{search}"</span>
                    </span>
                  )}
                </p>
                <button
                  onClick={() => { setSelectedCats([]); setSearch(""); }}
                  className="text-xs text-[#40E0D0] hover:text-white transition-colors font-semibold flex items-center gap-1"
                >
                  <X size={12} /> Clear filters
                </button>
              </div>
              <FlatGrid services={filteredSubpages} navigate={navigate} />
            </>
          ) : (
            <CategorySpotlight
              categories={allCategories}
              subpages={subpages}
              navigate={navigate}
            />
          )}
        </main>

        {/* CTA */}
        <CTABanner />
      </motion.div>
    </AnimatePresence>
  );
}
