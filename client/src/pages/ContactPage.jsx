import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin, Instagram, Twitter, Linkedin, Sparkles, Briefcase, Handshake } from 'lucide-react';
import api from "../api"; // Import the API service

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    inquiryType: '',
    message: ''
  });

  const [submissionMessage, setSubmissionMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionMessage('');
    setSubmissionError('');

    try {
      const res = await api.post("/contact", formData);

      if (res.status === 201) {
        setSubmissionMessage('Thanks for reaching out! Our team will get back to you within 24 hours');
        setFormData({
          fullName: '',
          emailAddress: '',
          inquiryType: '',
          message: ''
        });
      } else {
        setSubmissionError('Failed to submit the form. Please try again.');
      }
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      const message = error.response?.data?.error || "An unexpected error occurred.";
      setSubmissionError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-[#F5F5F5] font-sans px-6 py-20 md:py-32 flex flex-col items-center">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          Redefining recruitment with innovative staffing solutions – bridging businesses and talent to build stronger teams
        </h1>
        <p className="text-lg text-slate-300 max-w-xl mx-auto">
          Whether you have a question, a business inquiry, or just want to say hello, we’re here to listen.
        </p>
      </motion.section>

      <div className="max-w-6xl w-full bg-gray-900/50 border border-gray-700 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Left Column */}
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold mb-8 text-[#008080]">Get in Touch</h2>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="text-[#40E0D0]" size={24} />
              <div>
                <p className="font-bold">Email</p>
                <a href="mailto:contact@innovativestaffingsolutions.online" className="text-slate-300 hover:text-[#40E0D0] transition">
                  contact@innovativestaffingsolutions.online
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="text-[#40E0D0]" size={24} />
              <div>
                <p className="font-bold">Phone</p>
                <a href="tel:+917821929953" className="text-slate-300 hover:text-[#40E0D0] transition">
                  +91 78219 29953
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="text-[#40E0D0]" size={24} />
              <div>
                <p className="font-bold">Working Hours</p>
                <p className="text-slate-300">Monday – Friday | 9 AM – 9 PM IST</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="text-[#40E0D0]" size={24} />
              <div>
                <p className="font-bold">Location</p>
                <p className="text-slate-300">Pune</p>
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div className="mt-12">
            <h3 className="font-bold text-lg mb-4 text-[#F5F5F5]">Follow Us</h3>
            <p className="text-sm text-slate-300 mb-6">Stay connected and updated:</p>
            <div className="flex space-x-6">
              <a href="https://www.linkedin.com/in/innovative-solutions0207" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#40E0D0] transition">
                <Linkedin size={28} />
              </a>
              <a href="https://www.instagram.com/innovativestaffing_solutions?igsh=MWU5YjR5aDBiNTZhYQ==" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#40E0D0] transition">
                <Instagram size={28} />
              </a>
              <a href="https://twitter.com/intent/tweet?text=innovative0207" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#40E0D0] transition">
                <Twitter size={28} />
              </a>
            </div>
          </div>

          {/* Quick Help */}
          <div className="mt-12 p-6 bg-[#008080]/20 rounded-xl">
            <div className="flex items-center space-x-3 mb-2">
              <Sparkles className="text-[#40E0D0]" size={24} />
              <h3 className="font-bold text-xl text-[#F5F5F5]">Quick Help</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Looking for immediate answers? Check out our <Link to="/faqs" className="font-semibold text-[#40E0D0] hover:underline">FAQs</Link> for quick solutions before reaching out.
            </p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Link to="/careers" className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-[#40E0D0] text-black rounded-lg font-semibold hover:bg-[#2E8B57] hover:text-white transition-colors duration-300">
                <Briefcase size={20} className="mr-2" />
                Explore Careers
              </Link>
              <Link to="/services" className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-transparent text-[#40E0D0] border border-[#40E0D0] rounded-lg font-semibold hover:bg-[#40E0D0] hover:text-black transition-colors duration-300">
                <Handshake size={20} className="mr-2" />
                Our Services
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Right Column (Contact Form) */}
        <motion.section
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-[#008080]">Send Us a Message</h2>
          <p className="text-slate-300 mb-6">
            Have a project in mind? Fill out the form and we’ll get back to you as soon as possible.
          </p>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-200 mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-[#F5F5F5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition"
              />
            </div>
            <div>
              <label htmlFor="emailAddress" className="block text-sm font-semibold text-slate-200 mb-2">Email Address</label>
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-[#F5F5F5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition"
              />
            </div>
            <div>
              <label htmlFor="inquiryType" className="block text-sm font-semibold text-slate-200 mb-2">Subject / Inquiry Type</label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleInputChange}
                required
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition appearance-none"
              >
                <option value="" disabled>Select a subject</option>
                <option value="General">General</option>
                <option value="Support">Support</option>
                <option value="Careers">Careers</option>
                <option value="Business Inquiry">Business Inquiry</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-200 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your project or inquiry..."
                rows="6"
                required
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-[#F5F5F5] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition"
              />
            </div>
            {submissionMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-green-500/20 text-green-300 p-4 rounded-lg text-sm text-center"
              >
                {submissionMessage}
              </motion.div>
            )}
            {submissionError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-red-500/20 text-red-300 p-4 rounded-lg text-sm text-center"
              >
                {submissionError}
              </motion.div>
            )}
            <motion.button
              type="submit"
              className="w-full px-8 py-4 rounded-lg bg-[#40E0D0] text-black font-bold text-lg hover:bg-[#2E8B57] hover:text-white shadow-lg transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? "Sending..." : "Let’s Connect"}
            </motion.button>
          </form>
        </motion.section>
      </div>
    </main>
  );
}