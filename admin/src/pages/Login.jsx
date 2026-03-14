import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ArrowRight, Users, TrendingUp, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '../api';

const STATS = [
  { icon: Users, value: '12,400+', label: 'Placements Made' },
  { icon: TrendingUp, value: '98%', label: 'Client Satisfaction' },
  { icon: Shield, value: '15 Yrs', label: 'Industry Experience' },
];

// 🚨 Here is our custom, interactive, animated logo component!
const AnimatedLogo = ({ sizeClass, textSizeClass }) => (
  <div
    className={`relative flex items-center justify-center ${sizeClass} p-0 overflow-hidden border-none rounded-full shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer shrink-0`}
  >
    {/* The Animated Multi-Color Spinning Gradient */}
    <span className="absolute w-[250%] h-[250%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(#10b981,#9ca3af,#ffffff,#22c55e,#86efac,#10b981)]" />

    {/* The Inner Surface (Perfect Circle Mask) */}
    <span className={`relative z-10 flex items-center justify-center w-[calc(100%-4px)] h-[calc(100%-4px)] bg-black rounded-full ${textSizeClass} font-extrabold text-emerald-600`}>
      S
    </span>
  </div>
);

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/admin/login', { username, password });
      toast.success('Welcome back!');
      onLogin({ token: data.token, user: data.admin });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">

      {/* ══ LEFT — Emerald brand panel ══ */}
      <div className="relative lg:w-[52%] xl:w-[55%] bg-emerald-700 flex flex-col justify-between overflow-hidden px-10 py-12 lg:px-16 lg:py-16 min-h-[320px] lg:min-h-screen">

        {/* Background decorations */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-600/50" />
        <div className="absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full bg-teal-600/40" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        <div className="absolute top-0 right-0 w-1 h-full bg-white/10" />

        {/* Desktop Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-4">

            {/* 🚨 Injected Animated Logo (Desktop Size) */}
            <AnimatedLogo sizeClass="w-14 h-14" textSizeClass="text-3xl" />

            <div className="leading-none">
              <p className="text-white font-black text-xl tracking-tight">Innovative</p>
              <p className="text-emerald-200 text-[11px] font-bold uppercase tracking-[0.2em] mt-0.5">Staffing Solutions</p>
            </div>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 my-auto pt-16 pb-10 lg:py-0 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-6 backdrop-blur-sm border border-white/10 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span className="text-emerald-100 text-[11px] font-semibold uppercase tracking-wider">Admin Control Center</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-5">
            Manage your<br />
            <span className="text-emerald-300">staffing</span><br />
            operations.
          </h2>

          <p className="text-emerald-100/70 text-[15px] leading-relaxed max-w-sm">
            One dashboard to oversee placements, track performance, and grow your business with confidence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="group">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/10 mb-3 group-hover:bg-white/20 transition-colors">
                  <Icon className="w-4 h-4 text-emerald-200" />
                </div>
                <p className="text-white font-black text-lg leading-none">{value}</p>
                <p className="text-emerald-200/70 text-[11px] font-medium mt-1 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-emerald-200/50 text-xs">© 2025 Innovative Staffing Solutions. All rights reserved.</p>
        </div>
      </div>

      {/* ══ RIGHT — Sign in form ══ */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-14 lg:px-16 xl:px-24">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">

          {/* 🚨 Injected Animated Logo (Mobile Size) */}
          <AnimatedLogo sizeClass="w-12 h-12" textSizeClass="text-2xl" />

          <div className="leading-none">
            <p className="text-gray-900 font-black text-base tracking-tight">Innovative</p>
            <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5">Staffing Solutions</p>
          </div>
        </div>

        <div className="w-full max-w-[400px]">

          {/* Heading */}
          <div className="mb-9">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sign in</h1>
            <p className="text-sm text-gray-500 mt-2">
              Access your admin dashboard to manage operations.
            </p>
          </div>

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[13px] font-semibold text-gray-600">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                required
                disabled={loading}
                autoComplete="username"
                className="h-12 rounded-xl border-gray-200 bg-white text-sm text-gray-800
                  placeholder:text-gray-300 shadow-sm
                  focus-visible:ring-2 focus-visible:ring-emerald-500/20
                  focus-visible:border-emerald-500
                  disabled:opacity-50 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px] font-semibold text-gray-600">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="h-12 pr-12 rounded-xl border-gray-200 bg-white text-sm text-gray-800
                    placeholder:text-gray-400 shadow-sm
                    focus-visible:ring-2 focus-visible:ring-emerald-500/20
                    focus-visible:border-emerald-500
                    disabled:opacity-50 transition-colors"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPwd(v => !v)}
                  tabIndex={-1}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  {showPwd ? <EyeOff className="w-[15px] h-[15px]" /> : <Eye className="w-[15px] h-[15px]" />}
                </Button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="group w-full h-12 gap-2.5
                  bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]
                  text-white text-[14px] font-bold tracking-wide
                  rounded-xl shadow-lg shadow-emerald-500/25
                  focus-visible:ring-2 focus-visible:ring-emerald-500/30
                  transition-all duration-200
                  disabled:bg-emerald-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </div>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-9 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">SECURE ACCESS</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6">
            {[
              { icon: Shield, text: 'SSL Encrypted' },
              { icon: Users, text: 'Role Protected' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11.5px] text-gray-400 font-medium">{text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}