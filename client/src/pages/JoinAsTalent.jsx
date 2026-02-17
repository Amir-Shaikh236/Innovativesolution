import React, { useState } from "react";
import api from "../api";

export default function JoinAsTalent() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    about: "",
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((f) => ({ ...f, file: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const data = new FormData();
      data.append("firstName", form.firstName);
      data.append("lastName", form.lastName);
      data.append("email", form.email);
      data.append("phone", form.phone);
      data.append("location", form.location);
      data.append("anythingElse", form.about); // backend expects anythingElse
      data.append("file", form.file);

      const res = await api.post("/JoinTalent", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Axios does not have res.ok or res.json()
      // Instead just check status or data (optionally)
      if (res.status !== 201) {
        // You can also use res.data.error if backend sends it
        throw new Error(res.data?.error || "Failed to submit");
      }

      setSuccess(true);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        about: "",
        file: null,
      });
    } catch (err) {
      // Axios errors have response data sometimes
      const message = err.response?.data?.error || err.message || "Submission failed";
      setError(message);
    }

    setSubmitting(false);
  };


  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-gray-900/50 rounded-3xl shadow-xl p-10 border mt-20 border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-[#F5F5F5] mb-3">
          Ready to work on exciting short-term projects?
        </h2>
        <p className="text-center text-slate-300 mb-8">
          Join our <span className="font-semibold text-[#40E0D0]">team of gig professionals</span>.
        </p>

        {success ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-green-400 text-lg font-semibold mb-2">
              Thank you for your application!
            </p>
            <p className="text-slate-300">
              We'll review your info soon and contact you if there is a match.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-[#F5F5F5] placeholder-gray-500 focus:border-[#40E0D0] focus:outline-none focus:ring-2 focus:ring-[#40E0D0]/50 transition"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-[#F5F5F5] placeholder-gray-500 focus:border-[#40E0D0] focus:outline-none focus:ring-2 focus:ring-[#40E0D0]/50 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-[#F5F5F5] placeholder-gray-500 focus:border-[#40E0D0] focus:outline-none focus:ring-2 focus:ring-[#40E0D0]/50 transition"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-[#F5F5F5] placeholder-gray-500 focus:border-[#40E0D0] focus:outline-none focus:ring-2 focus:ring-[#40E0D0]/50 transition"
              />
            </div>

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 w-full text-[#F5F5F5] placeholder-gray-500 focus:border-[#40E0D0] focus:outline-none focus:ring-2 focus:ring-[#40E0D0]/50 transition"
            />

            <textarea
              name="about"
              placeholder="Anything else we should know?"
              rows={4}
              value={form.about}
              onChange={handleChange}
              required
              className="resize-none rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 w-full text-[#F5F5F5] placeholder-gray-500 focus:border-[#40E0D0] focus:outline-none focus:ring-2 focus:ring-[#40E0D0]/50 transition"
            />

            <div>
              <label htmlFor="file" className="block mb-2 font-semibold text-slate-200">
                Upload your resume and cover letter <span className="text-red-400">*</span>
              </label>
              <input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                required
                className="w-full rounded-lg border-2 border-dashed border-[#40E0D0] p-2 text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#40E0D0]/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#40E0D0]/20 file:text-[#40E0D0] hover:file:bg-[#40E0D0]/30"
              />
              <p className="text-xs text-slate-400 mt-1">PDF or DOC, max 5MB.</p>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-lg font-bold transition-colors duration-300 ${submitting
                  ? "bg-teal-800 text-slate-400 cursor-not-allowed"
                  : "bg-[#40E0D0] text-black hover:bg-[#2E8B57] hover:text-white"
                }`}
            >
              {submitting ? "Submitting..." : "Apply Now"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Made with Talentra · Need help?{" "}
          <span className="underline cursor-pointer text-[#40E0D0]">Contact us</span>
        </p>
      </div>
    </div>
  );
}
