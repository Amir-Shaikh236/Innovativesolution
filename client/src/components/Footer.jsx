import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Instagram, Twitter, Linkedin } from "lucide-react";
import api from "../api";
import { Navigate } from "react-router-dom";
import logo from "../assets/generated-image (4).png"

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const goToContact = () => {
    navigate("/contact");
  };

  const goToTeamRequest = () => {
    navigate('/team-up-request');
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(""); // Clear previous messages
    try {
      await api.post("/subscriptions", { email });
      setMessage("Thanks for subscribing!");
      setEmail(""); // Clear the input field on success
    } catch (err) {
      console.error("Subscription error:", err.response?.data || err.message);
      setMessage("Failed to subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* RESPONSIVE: Adjusted padding and font size for mobile */}
      <section className="bg-[#000000] text-[#F5F5F5] pb-16 sm:pb-20 px-4 sm:px-6 text-center">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-6"
        >
          Your next big release starts with the right team
        </h2>
        {/* RESPONSIVE: Buttons stack on mobile, side-by-side on larger screens */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
          <button
            onClick={goToTeamRequest}
            className="bg-[#40E0D0] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#2E8B57] transition w-full sm:w-auto"
          >
            Request Proposal
          </button>
          <button
            onClick={goToContact}
            className="border border-[#F5F5F5]/50 px-6 py-3 rounded-lg font-semibold hover:bg-[#F5F5F5]/10 transition w-full sm:w-auto"
          >
            Talk to an Expert
          </button>
        </div>
      </section>

      {/* RESPONSIVE: Adjusted main padding for mobile */}
      <footer className="bg-[#40E0D0] text-black py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#40E0D0] text-black">
            {/* Top Section */}
            {/* RESPONSIVE: Grid is 1 col on mobile, 2 on tablet, 4 on desktop. Reduced excessive gap. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10 sm:mb-12 text-center sm:text-left">
              {/* Column 1: Brand & Headline */}
              <div className="lg:col-span-1 sm:col-span-2">
                {/* RESPONSIVE: Centered logo on mobile */}
                <div className="flex justify-center sm:justify-start">
                  <img className="h-20 w-20 mb-4" src={logo} alt="Company Logo" />
                </div>
                <p className="text-sm ">
                  Redefining recruitment with innovative staffing solutions – bridging businesses and talent to build stronger teams.
                </p>
              </div>

              {/* Column 2: Company */}
              <div>
                <h4 className="font-semibold mb-4 text-[#008080]">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/about" className="hover:text-white transition">About</Link>
                  </li>
                  <li>
                    <Link to="/careers" className="hover:text-white transition">Careers</Link>
                  </li>
                  <li>
                    <Link to="/industries" className="hover:text-white transition">Industries</Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Services (Dynamic) */}
              <div>
                <h4 className=" font-semibold mb-4 text-[#008080]">Services</h4>
                <ul className="space-y-2 text-sm">
                  {loading ? (
                    <li>Loading services...</li>
                  ) : error ? (
                    <li>{error}</li>
                  ) : (
                    categories.map((cat) => (
                      <li key={cat._id}>
                        <Link
                          to={`/category/${cat.slug || cat._id}`}
                          className="hover:text-white transition"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Column 4: Resources */}
              <div>
                <h4 className=" font-semibold mb-4 text-[#008080]">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/blogs" className="hover:text-white transition">Blog</Link>
                  </li>
                  <li>
                    <Link to="/case-studies" className="hover:text-white transition">Case Studies</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-white transition">FAQs</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Section */}
            {/* RESPONSIVE: This section's flex-col to md:flex-row is already well-suited for responsiveness. */}
            <div className="border-t border-b border-[#008080]/20 py-8 mb-8 text-center">
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📧</span>
                  <a href="mailto:contact@innovativestaffingsolutions.online" className="hover:text-white transition">
                    contact@innovativestaffingsolutions.online
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📞</span>
                  <a href="tel:+917821929953" className="hover:text-white transition">
                    +91 78219 29953
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <span>Pune</span>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="text-center mb-8">
              <h4 className="text-[#008080] font-bold text-lg mb-2">Grow Your Career. Empower Your Business.</h4>
              <p className="text-sm mb-4">
                Get the latest hiring trends, career tips, and business growth strategies in your inbox.
              </p>
              {/* RESPONSIVE: Stacked form elements on mobile for easier use. */}
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow rounded border border-[#008080]/50 px-4 py-2 text-[#F5F5F5] bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#40E0D0]"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#40E0D0] px-6 py-2 rounded text-black font-semibold hover:bg-[#2E8B57] transition border-black border-1 "
                >
                  {submitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              {message && (
                <p className={`mt-2 text-sm font-semibold ${message.startsWith('Thanks') ? 'text-green-500' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
              <p className="text-xs mt-2">
                By subscribing, you agree to our privacy policy and terms.
              </p>
            </div>

            {/* Social Media */}
            <div className="flex justify-center gap-6 text-2xl text-black mb-8">
              <a href="https://www.instagram.com/innovativestaffing_solutions?igsh=MWU5YjR5aDBiNTZhYQ==" aria-label="Instagram" className="hover:text-white transition">
                <Instagram size={24} />
              </a>
              <a href="https://twitter.com/intent/tweet?text=innovative0207" aria-label="Twitter" className="hover:text-white transition">
                <Twitter size={24} />
              </a>
              <a href="https://www.linkedin.com/in/innovative-solutions0207" aria-label="LinkedIn" className="hover:text-white transition">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Legal Section */}
          <div className="border-t border-[#008080]/20 pt-6 text-center text-sm text-black">
            <p className="mb-2">
              © {new Date().getFullYear()} TALENTRA INNOVATIVE STAFFING SOLUTIONS (OPC) PRIVATE LIMITED. All rights reserved.
            </p>
            <div className="flex justify-center gap-4 text-xs">
              <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
              <span className="text-black/50">|</span>
              <Link to="/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}