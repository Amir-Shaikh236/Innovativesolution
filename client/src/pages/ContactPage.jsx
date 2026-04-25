import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Sparkles,
  Briefcase,
  Handshake,
  Lock,
} from "lucide-react";

export default function ContactPage({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    inquiryType: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  // Auto-fill name and email when user is logged in
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        emailAddress: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Guard: must be logged in
    if (!user) {
      navigate("/login", { state: { from: "/contact" } });
      return;
    }

    setLoading(true);
    setSubmissionMessage("");
    setSubmissionError("");

    try {
      const res = await api.post("/contact", formData);
      if (res.status === 201) {
        setSubmissionMessage(
          "Thanks for reaching out! Our team will contact you within 24 hours."
        );
        setFormData({
          fullName: user.name || "",
          emailAddress: user.email || "",
          inquiryType: "",
          message: "",
        });
      }
    } catch {
      setSubmissionError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F766E] px-4 sm:px-6 pb-16 py-24 flex flex-col items-center">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center mb-16 text-white"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Building stronger teams through strategic recruitment
        </h1>
        <p className="text-lg text-white/90">
          Whether you have a question or a business inquiry, we're here to
          listen.
        </p>
      </motion.section>

      {/* CONTENT */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#F4F8FB] border border-[#E3EAF2] rounded-3xl p-8 md:p-14 shadow-lg text-[#1F2937]">
        {/* LEFT */}
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-emerald-800">
            Get in Touch
          </h2>

          <div className="space-y-6">
            <Info
              icon={<Mail />}
              title="Email"
              value="contact@innovativestaffingsolutions.online"
              link="mailto:contact@innovativestaffingsolutions.online"
            />
            <Info
              icon={<Phone />}
              title="Phone"
              value="+91 78219 29953"
              link="tel:+917821929953"
            />
            <Info
              icon={<Clock />}
              title="Working Hours"
              value="Monday – Friday | 9 AM – 9 PM IST"
            />
            <Info icon={<MapPin />} title="Location" value="Pune" />
          </div>

          {/* SOCIAL */}
          <div className="mt-12">
            <h3 className="font-bold mb-4 text-emerald-800">Follow Us</h3>
            <div className="flex space-x-6">
              {[Linkedin, Instagram, Twitter].map((Icon, i) => (
                <Icon
                  key={i}
                  size={28}
                  className="text-emerald-700 hover:text-[#1E4F75] transition cursor-pointer"
                />
              ))}
            </div>
          </div>

          {/* QUICK HELP */}
          <div className="mt-12 p-6 border border-[#E3EAF2] rounded-xl">
            <div className="flex items-center space-x-2 mb-2 text-emerald-800">
              <Sparkles />
              <h3 className="font-bold text-lg">Quick Help</h3>
            </div>

            <p className="text-sm text-[#374151] mb-4">
              Check our{" "}
              <Link
                to="/faqs"
                className="font-semibold text-[#2F6690] hover:text-[#1E4F75]"
              >
                FAQs
              </Link>{" "}
              for quick answers.
            </p>

            <div className="flex gap-4">
              <Link
                to="/careers"
                className="px-6 py-3 bg-[#0F766E] text-white rounded-lg hover:bg-[#0F766E]/90 transition"
              >
                <Briefcase className="inline mr-2" size={18} />
                Careers
              </Link>

              <Link
                to="/services"
                className="px-6 py-3 border border-[#0F766E] text-[#0F766E] rounded-lg hover:bg-[#0F766E] hover:text-white transition"
              >
                <Handshake className="inline mr-2" size={18} />
                Services
              </Link>
            </div>
          </div>
        </motion.section>

        {/* RIGHT */}
        <motion.section
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-emerald-800">
            Send Us a Message
          </h2>

          {/* Login gate — shown only when user is not logged in */}
          {!user && (
            <div className="mt-6 mb-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <Lock size={20} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800">
                You need to{" "}
                <Link
                  to="/login"
                  className="font-semibold underline hover:text-amber-900"
                >
                  log in
                </Link>{" "}
                or{" "}
                <Link
                  to="/signup"
                  className="font-semibold underline hover:text-amber-900"
                >
                  create an account
                </Link>{" "}
                to send us a message.
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!user}
            />
            <Input
              label="Email Address"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleInputChange}
              disabled={!user}
            />

            <div>
              <label className="block text-sm font-semibold mb-2">
                Subject
              </label>
              <select
                name="inquiryType"
                required
                value={formData.inquiryType}
                onChange={handleInputChange}
                disabled={!user}
                className="w-full p-3 rounded-lg border border-black focus:ring-2 focus:ring-[#2F6690] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select subject</option>
                <option>General</option>
                <option>Support</option>
                <option>Careers</option>
                <option>Business Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Message
              </label>
              <textarea
                minLength={10}
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleInputChange}
                disabled={!user}
                className="w-full p-3 rounded-lg border border-black focus:ring-2 focus:ring-[#2F6690] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {submissionMessage && (
              <p className="text-green-600 text-sm">{submissionMessage}</p>
            )}
            {submissionError && (
              <p className="text-red-600 text-sm">{submissionError}</p>
            )}

            {user ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#0F766E] text-white font-bold rounded-lg hover:bg-[#0F766E]/90 transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Let's Connect"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login", { state: { from: "/contact" } })}
                className="w-full py-4 bg-[#0F766E] text-white font-bold rounded-lg hover:bg-[#0F766E]/90 transition flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                Log in to Send Message
              </button>
            )}
          </form>
        </motion.section>
      </div>
    </main>
  );
}

/* REUSABLE COMPONENTS */

function Info({ icon, title, value, link }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="text-[#2F6690]">{icon}</div>
      <div>
        <p className="font-bold">{title}</p>
        {link ? (
          <a href={link} className="text-[#374151] hover:text-[#1E4F75]">
            {value}
          </a>
        ) : (
          <p className="text-[#374151]">{value}</p>
        )}
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        className="w-full p-3 rounded-lg border border-black text-[#1F2937] focus:ring-2 focus:ring-[#2F6690] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
