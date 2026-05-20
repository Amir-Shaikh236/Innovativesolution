import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import api from "../api";
import logo from "../assets/generated-image (4).png";

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
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setCategories([]);
        console.error("Failed to fetch categories:", err);
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const goToContact = () => navigate("/contact");
  const goToTeamRequest = () => navigate('/team-up-request');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await api.post("/subscriptions", { email });
      setMessage("Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      console.error("Subscription error:", err.response?.data || err.message);
      setMessage("Failed to subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Call to Action Section - Deep Cyan Blue */}
      <section className="bg-[#083344] text-[#E0F2FE] py-16 px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold mb-8">
          Your next big release starts with the right team
        </h2>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
          <button
            onClick={goToTeamRequest}
            className="bg-[#0891B2] text-white px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-[#0E7490] transition-all w-full sm:w-auto shadow-md"
          >
            Request Proposal
          </button>
          <button
            onClick={goToContact}
            className="border border-[#CFFAFE]/40 text-[#CFFAFE] px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-white/10 transition-all w-full sm:w-auto"
          >
            Talk to an Expert
          </button>
        </div>
      </section>

      {/* Main Footer Section - Rich Dark Cyan */}
      <footer className="bg-[#082F37] text-[#CFFAFE] py-12 px-6 sm:px-8 border-t border-[#164E63]">
        <div className="max-w-7xl mx-auto">
          <div>
            {/* Top Grid Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 text-center sm:text-left">
              
              {/* Column 1: Brand */}
              <div className="lg:col-span-1 sm:col-span-2">
                <div className="flex justify-center sm:justify-start">
                  <img className="h-20 w-20 mb-5 brightness-110" src={logo} alt="Company Logo" />
                </div>
                <p className="text-base leading-relaxed text-[#A5F3FC]">
                  Redefining recruitment with innovative staffing solutions – bridging businesses and talent to build stronger teams.
                </p>
              </div>

              {/* Column 2: Company */}
              <div>
                <h4 className="text-xl font-bold mb-5 text-[#22D3EE]">Company</h4>
                <ul className="space-y-3 text-base">
                  <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link to="/industries" className="hover:text-white transition-colors">Industries</Link></li>
                </ul>
              </div>

              {/* Column 3: Services */}
              <div>
                <h4 className="text-xl font-bold mb-5 text-[#22D3EE]">Services</h4>
                <ul className="space-y-3 text-base">
                  {loading ? (
                    <li className="opacity-70 italic text-sm">Loading services...</li>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      <li key={cat._id}>
                        <Link to={`/category/${cat.slug || cat._id}`} className="hover:text-white transition-colors">
                          {cat.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>No services available</li>
                  )}
                </ul>
              </div>

              {/* Column 4: Resources */}
              <div>
                <h4 className="text-xl font-bold mb-5 text-[#22D3EE]">Resources</h4>
                <ul className="space-y-3 text-base">
                  <li><Link to="/blogs" className="hover:text-white transition-colors">Insights Blog</Link></li>
                  <li><Link to="/case-studies" className="hover:text-white transition-colors">Case Studies</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Help & FAQs</Link></li>
                </ul>
              </div>
            </div>

            {/* Stylish Contact Row */}
            <div className="border-t border-b border-[#164E63] py-10 mb-10 text-center">
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16 text-base font-medium">
                <div className="flex items-center gap-3 group">
                  <Mail size={20} className="text-[#22D3EE] group-hover:scale-110 transition-transform" />
                  <a href="mailto:contact@innovativestaffingsolutions.online" className="hover:text-[#22D3EE] transition-colors">
                    contact@innovativestaffingsolutions.online
                  </a>
                </div>
                <div className="flex items-center gap-3 group">
                  <Phone size={20} className="text-[#22D3EE] group-hover:scale-110 transition-transform" />
                  <a href="tel:+917821929953" className="hover:text-[#22D3EE] transition-colors">
                    +91 78219 29953
                  </a>
                </div>
                <div className="flex items-center gap-3 group">
                  <MapPin size={20} className="text-[#22D3EE] group-hover:scale-110 transition-transform" />
                  <span>Pune, MH</span>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="text-center mb-12">
              <h4 className="text-[#22D3EE] font-bold text-xl md:text-2xl mb-3">Grow Your Career. Empower Your Business.</h4>
              <p className="text-base mb-6 text-[#A5F3FC] max-w-xl mx-auto">
                Get the latest hiring trends, career tips, and business growth strategies in your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Professional email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow rounded-lg px-4 py-3 text-base text-[#082F37] bg-white focus:ring-2 focus:ring-[#22D3EE] focus:outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0891B2] px-6 py-3 rounded-lg text-white font-bold hover:bg-[#0E7490] transition-colors disabled:opacity-50"
                >
                  {submitting ? "..." : "Subscribe"}
                </button>
              </form>
              {message && (
                <p className={`mt-3 text-sm font-semibold ${message.startsWith('Thanks') ? 'text-[#22D3EE]' : 'text-red-300'}`}>
                  {message}
                </p>
              )}
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center gap-8 mb-10">
              <a href="https://www.instagram.com/innovativestaffing_solutions?igsh=MWU5YjR5aDBiNTZhYQ==" aria-label="Instagram" className="text-[#22D3EE] hover:text-white transition-all transform hover:-translate-y-1">
                <Instagram size={26} />
              </a>
              <a href="https://twitter.com/intent/tweet?text=innovative0207" aria-label="Twitter" className="text-[#22D3EE] hover:text-white transition-all transform hover:-translate-y-1">
                <Twitter size={26} />
              </a>
              <a href="https://www.linkedin.com/in/innovative-solutions0207" aria-label="LinkedIn" className="text-[#22D3EE] hover:text-white transition-all transform hover:-translate-y-1">
                <Linkedin size={26} />
              </a>
            </div>
          </div>

          {/* Legal Section */}
          <div className="border-t border-[#164E63] pt-8 text-center text-sm text-[#67E8F9]">
            <p className="mb-3">
              © {new Date().getFullYear()} TALENTRA INNOVATIVE STAFFING SOLUTIONS (OPC) PRIVATE LIMITED.
            </p>
            <div className="flex justify-center gap-5 text-xs font-semibold tracking-wide uppercase">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="opacity-20">|</span>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}