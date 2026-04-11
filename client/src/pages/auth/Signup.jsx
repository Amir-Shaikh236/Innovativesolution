import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import sideImg from "../../assets/side.png";
import { Eye, EyeOff } from "lucide-react";
export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePassword = (field) => {
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (parseInt(formData.age) < 18) {
      setError("You must be at least 18 years old.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      setMessage("Verification email sent!");
      
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex pt-15">
      
      {/* LEFT SIDE IMAGE */}
      <div className="hidden md:flex w-1/2">
        <img
                  src={sideImg}
                  alt="login visual"
                  className="w-full aspect-square  object-fit   "
                />

       
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#F4F8FB] px-4">
        
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#E3EAF2]">
          
          <h2 className="text-3xl font-bold text-center text-[#1F2937]">
            Create Account
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Please fill in your details.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#0F766E] 
              focus:ring-2 focus:ring-[#2F6690] outline-none"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#0F766E] 
              focus:ring-2 focus:ring-[#2F6690] outline-none"
            />

            {/* Age */}
            <input
              type="number"
              name="age"
              placeholder="Age (18+)"
              required
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-[#0F766E] 
              focus:ring-2 focus:ring-[#2F6690] outline-none"
            />

            {/* Password */}
            <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    required
    value={formData.password}
    onChange={handleChange}
    className="w-full px-4 py-2 pr-10 rounded-lg border border-[#0F766E] 
    focus:ring-2 focus:ring-[#2F6690] outline-none"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>

            {/* Confirm Password */}
           <div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    name="confirmPassword"
    placeholder="Confirm Password"
    required
    value={formData.confirmPassword}
    onChange={handleChange}
    className="w-full px-4 py-2 pr-10 rounded-lg border border-[#0F766E] 
    focus:ring-2 focus:ring-[#2F6690] outline-none"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>

            {/* Error / Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#0F766E] text-white font-semibold 
              hover:bg-[#0F766E]/90 transition"
            >
              {loading ? "Creating..." : "SIGN UP"}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#2F6690] font-medium hover:underline"
            >
              Sign In
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}