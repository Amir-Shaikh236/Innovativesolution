import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import sideImg from "../../assets/side.png";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ onVerified }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",

  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePassword = () => {
    setFormData((prev) => ({
      ...prev,

    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);
      onVerified(data.user);
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex pt-15">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src={sideImg}
          alt="login visual"
          className="w-full aspect-square  object-fit"
        />

      </div>

      {/* RIGHT SIDE FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#F4F8FB] px-4">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#E3EAF2]">

          <h2 className="text-3xl font-bold text-center text-[#1F2937]">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Please sign in to your account.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-[#1F2937]">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-[#0F766E] 
                focus:outline-none focus:ring-2 focus:ring-[#2F6690]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-[#1F2937]">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 pr-10 rounded-lg border border-[#0F766E] 
      focus:outline-none focus:ring-2 focus:ring-[#2F6690]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember Me
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[#2F6690] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#0F766E] text-white font-semibold 
              hover:bg-[#0F766E]/90 transition"
            >
              {loading ? "Signing in..." : "SIGN IN"}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#2F6690] font-medium hover:underline"
            >
              Sign Up
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}