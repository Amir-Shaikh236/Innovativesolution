import React, { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    inquiryType: "",
    message: "",
  });
<<<<<<< HEAD

  const [submissionMessage, setSubmissionMessage] = useState('');
=======
>>>>>>> 76944ea3a84120259abe8fefb8fc3a0d667c262b
  const [loading, setLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionMessage("");
    setSubmissionError("");

    try {
      const res = await api.post("/contact", formData);
<<<<<<< HEAD

=======
>>>>>>> 76944ea3a84120259abe8fefb8fc3a0d667c262b
      if (res.status === 201) {
        setSubmissionMessage(
          "Thanks for reaching out! Our team will contact you within 24 hours.",
        );
        setFormData({
          fullName: "",
          emailAddress: "",
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
<<<<<<< HEAD
    <main className="min-h-screen bg-black text-[#F5F5F5] font-sans px-6 py-20 md:py-32 flex flex-col items-center">

      {/* Hero Section */}
=======
    <main className="min-h-screen bg-[#2F6690] px-4 sm:px-6 pb-16 py-24 flex flex-col items-center">
      {/* HERO */}
>>>>>>> 76944ea3a84120259abe8fefb8fc3a0d667c262b
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
          Whether you have a question or a business inquiry, we’re here to
          listen.
        </p>
      </motion.section>

<<<<<<< HEAD
      <div className="max-w-6xl w-full bg-gray-900/50 border border-gray-700 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Left Column */}
=======
      {/* CONTENT */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#F4F8FB] border border-[#E3EAF2] rounded-3xl p-8 md:p-14 shadow-lg text-[#1F2937]">
        {/* LEFT */}
>>>>>>> 76944ea3a84120259abe8fefb8fc3a0d667c262b
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
<<<<<<< HEAD
          <h2 className="text-3xl font-bold mb-8 text-[#008080]">Get in Touch</h2>

          {/* Contact Info */}
=======
          <h2 className="text-3xl font-bold mb-8 text-[#2F6690]">
            Get in Touch
          </h2>

>>>>>>> 76944ea3a84120259abe8fefb8fc3a0d667c262b
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

<<<<<<< HEAD
          {/* Follow Us */}
=======
          {/* SOCIAL */}
>>>>>>> 76944ea3a84120259abe8fefb8fc3a0d667c262b
          <div className="mt-12">
            <h3 className="font-bold mb-4 text-[#2F6690]">Follow Us</h3>
            <div className="flex space-x-6">
              {[Linkedin, Instagram, Twitter].map((Icon, i) => (
                <Icon
                  key={i}
                  size={28}
                  className="text-[#2F6690] hover:text-[#1E4F75] transition cursor-pointer"
                />
              ))}
            </div>
          </div>

<<<<<<< HEAD
          {/* Quick Help */}
          <div className="mt-12 p-6 bg-[#008080]/20 rounded-xl">
            <div className="flex items-center space-x-3 mb-2">
              <Sparkles className="text-[#40E0D0]" size={24} />
              <h3 className="font-bold text-xl text-[#F5F5F5]">Quick Help</h3>
=======
          {/* QUICK HELP */}
          <div className="mt-12 p-6 border border-[#E3EAF2] rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="text-[#2F6690]" />
              <h3 className="font-bold text-lg text-[#2F6690]">Quick Help</h3>
>>>>>>> 76944ea3a84120259abe8fefb8fc3a0d667c262b
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
                className="px-6 py-3 bg-[#2F6690] text-white rounded-lg hover:bg-[#1E4F75] transition"
              >
                <Briefcase className="inline mr-2" size={18} />
                Careers
              </Link>

              <Link
                to="/services"
                className="px-6 py-3 border border-[#2F6690] text-[#2F6690] rounded-lg hover:text-[#1E4F75] hover:border-[#1E4F75] transition"
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
          <h2 className="text-3xl font-bold mb-6 text-[#2F6690]">
            Send Us a Message
          </h2>

          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <Input
              label="Email Address"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleInputChange}
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
                className="w-full p-3 rounded-lg border border-[#E3EAF2]
                focus:ring-2 focus:ring-[#2F6690] outline-none"
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
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-[#E3EAF2]
                focus:ring-2 focus:ring-[#2F6690] outline-none"
              />
            </div>

            {submissionMessage && (
              <p className="text-green-600 text-sm">{submissionMessage}</p>
            )}
            {submissionError && (
              <p className="text-red-600 text-sm">{submissionError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#2F6690] text-white font-bold rounded-lg hover:bg-[#1E4F75] transition"
            >
              {loading ? "Sending..." : "Let’s Connect"}
            </button>
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

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full p-3 rounded-lg border border-[#E3EAF2]
        text-[#1F2937] focus:ring-2 focus:ring-[#2F6690] outline-none"
      />
    </div>
  );
}
