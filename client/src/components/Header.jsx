import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/generated-image (4).png";

export default function Header({ isLoggedIn, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const isActive = (path) =>
    path === "/services"
      ? location.pathname.startsWith(path)
      : location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/careers", label: "Careers" },
    { to: "/case-studies", label: "Case Studies" },
    { to: "/industries", label: "Industries" },
    { to: "/blogs", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* ── Header bar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled
          ? "bg-black border-b border-white/10"
          : "bg-black/80 border-b border-white/5"
          }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 h-18 flex items-center justify-between gap-8">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img
              src={logo}
              alt="Logo"
              className="h-14 w-14 object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-md text-[15px] font-medium tracking-tight transition-colors duration-150 ${isActive(link.to)
                  ? "text-[#40E0D0] bg-[#40E0D0]/8"
                  : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#40E0D0]" />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Desktop auth ── */}
          <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="px-5 py-2.5 rounded-md text-[14px] font-semibold text-white/50 border border-white/10 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all duration-150"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-md text-[14px] font-semibold text-black bg-[#40E0D0] hover:bg-[#5ee8d8] transition-colors duration-150"
              >
                Register Now
              </Link>
            )}
          </div>

          {/* ── Mobile burger ── */}
          <button
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            className="xl:hidden flex flex-col justify-center items-center gap-[6px] w-10 h-10 rounded-md border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-150 flex-shrink-0"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-[1.5px] w-5 bg-white rounded transition-all duration-250 origin-center ${isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-white rounded transition-all duration-250 ${isMobileMenuOpen ? "opacity-0 scale-x-0" : ""
                }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-white rounded transition-all duration-250 origin-center ${isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
            />
          </button>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="fixed top-20 left-0 right-0 z-40 bg-black border-b border-white/10 xl:hidden"
          >
            <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.18 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-150 ${isActive(link.to)
                      ? "text-[#40E0D0] bg-[#40E0D0]/8"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {link.label}
                    {isActive(link.to) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#40E0D0]" />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile auth */}
              <div className="pt-3 pb-2 border-t border-white/8 mt-2">
                {isLoggedIn ? (
                  <button
                    onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 rounded-lg text-[15px] font-semibold text-red-400/70 border border-red-400/15 hover:text-red-400 hover:bg-red-400/5 hover:border-red-400/25 transition-all duration-150"
                  >
                    Log out
                  </button>
                ) : (
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-lg text-[15px] font-semibold text-black bg-[#40E0D0] hover:bg-[#5ee8d8] transition-colors duration-150"
                  >
                    Register Now
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}