import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users, BookOpen, Layers, CreditCard, TrendingUp, TrendingDown,
  RefreshCw, Clock, Star, Eye, ArrowRight, ArrowUpRight,
  Activity, CheckCircle2, AlertCircle, Circle, UserPlus, FileText, Zap,
} from 'lucide-react';
import api from '../api';
import { Link } from 'react-router-dom';

// ─── API LAYER ───────────────────────────────────────────────────────────────
const BASE = "/admin/dashboard-stats";
const API = {
  fetchStats: () => api.get(`${BASE}`),
  fetchUserGrowth: () => api.get(`${BASE}/user-growth`),
  fetchBlogStats: () => api.get(`${BASE}/blog-stats`),
  fetchRevenue: () => api.get(`${BASE}/revenue`),
  fetchTopContent: () => api.get(`${BASE}/top-content`),
  fetchActivity: () => api.get(`${BASE}/activity`),
};

const ICON_MAP = { UserPlus, FileText, CreditCard, AlertCircle, CheckCircle2, Zap, Star, Eye };

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1200, active = false) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (!active || !target) return;
    const from = prev.current;
    const diff = target - from;
    if (diff === 0) return;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(from + diff * ease));
      if (p < 1) requestAnimationFrame(tick);
      else prev.current = target;
    };
    requestAnimationFrame(tick);
  }, [target, active, duration]);
  return val;
}

function useLiveData(fetcher, interval = 30000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      setData(res.data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    load();
    const id = setInterval(() => load(true), interval);
    return () => clearInterval(id);
  }, [load, interval]);

  return { data, loading, error, lastUpdated, refetch: () => load() };
}

// ─── CARD GRADIENT CONFIGS ───────────────────────────────────────────────────
const CARD_CFG = [
  { gradient: 'linear-gradient(135deg,#10b981 0%,#34d399 60%,#6ee7b7 100%)', iconColor: '#10b981', numberColor: '#059669' },
  { gradient: 'linear-gradient(135deg,#3b82f6 0%,#60a5fa 60%,#93c5fd 100%)', iconColor: '#3b82f6', numberColor: '#2563eb' },
  { gradient: 'linear-gradient(135deg,#8b5cf6 0%,#a78bfa 60%,#c4b5fd 100%)', iconColor: '#8b5cf6', numberColor: '#7c3aed' },
  { gradient: 'linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fdba74 100%)', iconColor: '#f97316', numberColor: '#ea580c' },
];

const CHART_TABS = [
  { key: 'users', label: 'Users', color: '#10b981' },
  { key: 'blogs', label: 'Content', color: '#3b82f6' },
  { key: 'revenue', label: 'Revenue', color: '#8b5cf6' },
];

// ─── SHARED PANEL COMPONENT ──────────────────────────────────────────────────
function Panel({ children, title, subtitle, action, className = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-[20px] p-[22px] px-6 pb-5 border border-gray-100 dark:border-slate-800/60 shadow-sm transition-colors ${className}`}>
      {title && (
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-slate-50 m-0">{title}</h3>
            {subtitle && <p className="text-[11px] text-gray-400 dark:text-slate-400 mt-0.5 font-medium">{subtitle}</p>}
          </div>
          {action && (
            <button className="group flex items-center gap-1 text-[11px] font-bold text-emerald-500 dark:text-emerald-400 bg-transparent border-none cursor-pointer p-0 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
              {action} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── GLASS STAT CARD ─────────────────────────────────────────────────────────
function StatCard({
  label, value, prefix = '', suffix = '', icon: Icon,
  gradient, iconColor, numberColor,
  trendPct, trendLabel = 'vs last month',
  loading, animate, delay = 0,
}) {
  const count = useCountUp(value || 0, 1200, animate && !loading);
  const up = trendPct >= 0;
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`relative p-[1.5px] rounded-[20px] transition-all duration-300 ease-out cursor-pointer w-full ${hov ? 'shadow-2xl -translate-y-1 scale-[1]' : 'shadow-sm translate-y-0 scale-100'
        } ${!hov ? 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800' : ''}`}
      style={hov ? { background: gradient } : {}}
    >
      <div className="bg-white dark:bg-slate-900 rounded-[18.5px] p-5 pb-4 min-h-[140px] sm:min-h-[155px] flex flex-col justify-between relative overflow-hidden transition-colors w-full">

        <div
          className="absolute inset-0 rounded-[18.5px] pointer-events-none transition-opacity duration-300 ease-out"
          style={{ background: gradient, opacity: hov ? 0.05 : 0 }}
        />

        <div className="flex items-start justify-between relative z-10">
          <p className="text-[10px] sm:text-[10.5px] font-bold tracking-widest uppercase text-gray-400 dark:text-slate-500 m-0">
            {label}
          </p>
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 ease-out"
            style={{ background: hov ? gradient : '', boxShadow: hov ? '0 4px 12px rgba(0,0,0,0.12)' : 'none' }}
            {...(!hov && { className: 'bg-gray-50 dark:bg-slate-800 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 ease-out' })}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors" style={{ color: hov ? '#fff' : iconColor }} />
          </div>
        </div>

        <div className="relative z-10 mt-2 sm:mt-0">
          {loading ? (
            <div className="h-[32px] sm:h-[38px] w-[90px] sm:w-[110px] rounded-lg mt-3.5 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 bg-[length:200%_100%] animate-[shimmer_1.4s_infinite_linear]" />
          ) : (
            <p
              className="text-[32px] sm:text-[38px] font-black tracking-tight m-0 mt-2.5 leading-none tabular-nums transition-colors"
              style={{ color: hov ? numberColor : '' }}
              {...(!hov && { className: 'text-[32px] sm:text-[38px] font-black tracking-tight text-gray-900 dark:text-white m-0 mt-2.5 leading-none tabular-nums transition-colors' })}
            >
              {prefix}{count.toLocaleString()}{suffix}
            </p>
          )}

          {trendPct !== undefined && !loading && (
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className={`inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                {up ? <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                {Math.abs(trendPct)}%
              </span>
              <span className="text-[10px] sm:text-[11px] text-gray-400 dark:text-slate-500 truncate">{trendLabel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LIVE TICKER ─────────────────────────────────────────────────────────────
function LiveTicker({ lastUpdated, nextIn }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      if (lastUpdated) setElapsed(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  return (
    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-400 dark:text-slate-400 font-medium">
      <span className="relative flex w-2 h-2 shrink-0">
        <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-50 animate-[ping_1.2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
      </span>
      <span className="truncate">
        {lastUpdated ? `Updated ${elapsed < 5 ? 'just now' : `${elapsed}s ago`} · next in ${nextIn}s` : 'Loading…'}
      </span>
    </div>
  );
}

// ─── LINE CHART (Pure SVG) ───────────────────────────────────────────────────
function LineChart({ datasets, labels, height = 200, animate }) {
  const W = 600, H = height;
  const PAD = { top: 16, right: 16, bottom: 28, left: 48 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const allVals = datasets.flatMap((d) => d.values).filter(Boolean);
  if (!allVals.length) return null;
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const range = maxV - minV || 1;

  const xStep = chartW / Math.max(labels.length - 1, 1);
  const yScale = (v) => chartH - ((v - minV) / range) * chartH;
  const pathD = (vals) => vals.map((v, i) =>
    `${i === 0 ? 'M' : 'L'}${(PAD.left + i * xStep).toFixed(1)},${(PAD.top + yScale(v)).toFixed(1)}`
  ).join(' ');
  const areaD = (vals) =>
    `${pathD(vals)} L${(PAD.left + (vals.length - 1) * xStep).toFixed(1)},${PAD.top + chartH} L${PAD.left},${PAD.top + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-h-[150px] sm:min-h-[200px]" style={{ maxHeight: height }}>
      <defs>
        {datasets.map((d) => (
          <linearGradient key={d.key} id={`lg-${d.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={d.color} stopOpacity="0.14" />
            <stop offset="100%" stopColor={d.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {[0, 1, 2, 3, 4].map((i) => {
        const y = PAD.top + (i / 4) * chartH;
        const val = Math.round(maxV - (i / 4) * range);
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y} className="stroke-gray-100 dark:stroke-slate-800" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400 dark:fill-slate-500 font-mono">
              {val >= 1000 ? `${(val / 1000).toFixed(val >= 10000 ? 0 : 1)}k` : val}
            </text>
          </g>
        );
      })}
      {datasets.map((d) => d.values.length > 0 && (
        <path key={`a-${d.key}`} d={areaD(d.values)} fill={`url(#lg-${d.key})`} />
      ))}
      {datasets.map((d) => d.values.length > 0 && (
        <path key={`l-${d.key}`} d={pathD(d.values)} fill="none" stroke={d.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={animate ? { strokeDasharray: 2000, strokeDashoffset: 0, animation: 'drawLine 1.4s ease forwards' } : {}} />
      ))}
      {datasets.map((d) => d.values.map((v, i) => (
        <circle key={`d-${d.key}-${i}`} cx={PAD.left + i * xStep} cy={PAD.top + yScale(v)} r="3.5" className="fill-white dark:fill-slate-900" stroke={d.color} strokeWidth="2" />
      )))}
      {labels.map((l, i) => (
        <text key={l} x={PAD.left + i * xStep} y={H - 4} textAnchor="middle" className={`text-[10px] fill-gray-400 dark:fill-slate-500 font-mono ${i % 2 !== 0 ? 'hidden sm:block' : ''}`}>
          {l}
        </text>
      ))}
    </svg>
  );
}

// ─── CHART SECTION ───────────────────────────────────────────────────────────
function ChartSection({ userData, blogData, revenueData, loading, animate }) {
  const [tab, setTab] = useState('users');

  const datasets = {
    users: [
      { key: 'total', label: 'Total Users', color: '#10b981', values: (userData || []).map((d) => d.users || 0) },
      { key: 'new', label: 'New Users', color: '#34d399', values: (userData || []).map((d) => d.newUsers || 0) },
    ],
    blogs: [
      { key: 'pub', label: 'Published', color: '#3b82f6', values: (blogData || []).map((d) => d.published || 0) },
      { key: 'views', label: 'Views ÷10', color: '#93c5fd', values: (blogData || []).map((d) => Math.round((d.views || 0) / 10)) },
    ],
    revenue: [
      { key: 'rev', label: 'Revenue $', color: '#8b5cf6', values: (revenueData || []).map((d) => d.revenue || 0) },
      { key: 'subs', label: 'New Subs ×20', color: '#c4b5fd', values: (revenueData || []).map((d) => (d.subs || 0) * 20) },
    ],
  };

  const labels = (userData || []).map((d) => d.month);

  return (
    <Panel>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-[15px] font-extrabold text-gray-900 dark:text-slate-50 m-0">Growth Analytics</h3>
          <p className="text-[11px] text-gray-400 dark:text-slate-400 mt-0.5 font-medium">12-month trend · live data</p>
        </div>
        <div className="flex gap-1 p-1 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
          {CHART_TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition-all duration-200 ${tab === t.key
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm'
                : 'bg-transparent text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {!loading && (
        <div className="flex gap-4 mb-2">
          {datasets[tab].map((d) => (
            <div key={d.key} className="flex items-center gap-1.5">
              <span className="inline-block w-4.5 h-[3px] rounded-sm" style={{ background: d.color }} />
              <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">{d.label}</span>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="h-[200px] flex items-center justify-center flex-col gap-2">
          <Activity className="w-5 h-5 text-gray-200 dark:text-slate-700 animate-pulse" />
          <p className="text-[11px] text-gray-300 dark:text-slate-600 m-0">Loading chart…</p>
        </div>
      ) : (
        <LineChart datasets={datasets[tab]} labels={labels} height={200} animate={animate} />
      )}
    </Panel>
  );
}

// ─── TOP CONTENT ─────────────────────────────────────────────────────────────
const CAT_COLORS = {
  Tech: { bg: 'bg-blue-50 dark:bg-blue-500/10', color: 'text-blue-500 dark:text-blue-400', hex: '#3b82f6' },
  Lifestyle: { bg: 'bg-orange-50 dark:bg-orange-500/10', color: 'text-orange-500 dark:text-orange-400', hex: '#f97316' },
  Health: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-500 dark:text-emerald-400', hex: '#10b981' },
};

function TopContent({ data, loading }) {
  if (loading) return (
    <div className="flex flex-col gap-2.5 py-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 animate-pulse">
          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-800 shrink-0" />
          <div className="flex-1">
            <div className="h-2.5 rounded-full bg-gray-100 dark:bg-slate-800 w-[70%] mb-1.5" />
            <div className="h-2 rounded-full bg-gray-50 dark:bg-slate-800/50 w-[35%]" />
          </div>
          <div className="w-9 h-2.5 rounded-full bg-gray-100 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );

  const maxViews = Math.max(...(data?.map((d) => d.views) || [1]));

  return (
    <div className="flex flex-col gap-0.5">
      {(data || []).map((item, i) => {
        const cat = CAT_COLORS[item.category] || { bg: 'bg-gray-50 dark:bg-slate-800', color: 'text-gray-500 dark:text-slate-400', hex: '#64748b' };
        const pct = (item.views / maxViews) * 100;
        return (
          <div key={i} className="group flex items-center gap-2.5 p-2 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
            <span className="text-[10px] font-extrabold text-gray-300 dark:text-slate-600 w-4 text-right shrink-0">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-700 dark:text-slate-200 m-0 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {item.title}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[3px] bg-gray-100 dark:bg-slate-800 rounded-sm overflow-hidden max-w-[100px]">
                  <div className="h-full rounded-sm transition-all duration-700 ease-out" style={{ width: `${pct}%`, background: cat.hex }} />
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-[1px] rounded-full ${cat.bg} ${cat.color}`}>
                  {item.category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-slate-500">
                <Eye className="w-3 h-3" />{item.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-slate-500">
                <Star className="w-3 h-3" />{item.likes.toLocaleString()}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-200 dark:text-slate-700 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── ACTIVITY FEED ───────────────────────────────────────────────────────────
function ActivityFeed({ data, loading }) {
  if (loading) return (
    <div className="flex flex-col gap-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 animate-pulse">
          <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 shrink-0" />
          <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-slate-800" />
          <div className="w-8 h-2 rounded-full bg-gray-50 dark:bg-slate-800/50" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-0.5">
      {(data || []).map((item, i) => {
        const Icon = ICON_MAP[item.icon] || Circle;
        return (
          <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
            <div
              className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center opacity-90 dark:opacity-70"
              style={{ background: item.bg }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
            </div>
            <p className="flex-1 text-[12.5px] text-gray-600 dark:text-slate-300 font-medium m-0 overflow-hidden text-ellipsis whitespace-nowrap">
              {item.text}
            </p>
            <span className="flex items-center gap-1 text-[10.5px] text-gray-300 dark:text-slate-500 shrink-0">
              <Clock className="w-2.5 h-2.5" />{item.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── SUBSCRIPTION BREAKDOWN ──────────────────────────────────────────────────
const SUB_PLANS = [
  { label: 'Free', pct: 58, color: '#e2e8f0', darkColor: '#334155', text: 'text-slate-400 dark:text-slate-500' },
  { label: 'Basic', pct: 22, color: '#bfdbfe', darkColor: '#1e3a8a', text: 'text-blue-500 dark:text-blue-400' },
  { label: 'Pro', pct: 14, color: '#a7f3d0', darkColor: '#064e3b', text: 'text-emerald-500 dark:text-emerald-400' },
  { label: 'Annual', pct: 6, color: '#ddd6fe', darkColor: '#4c1d95', text: 'text-purple-500 dark:text-purple-400' },
];

function SubBreakdown({ total, loading }) {
  return (
    <Panel>
      <h4 className="text-[13px] font-extrabold text-gray-900 dark:text-slate-50 m-0 mb-0.5">Subscription Plans</h4>
      <p className="text-[11px] text-gray-400 dark:text-slate-400 m-0 mb-3.5 font-medium">Distribution across tiers</p>

      <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5 mb-3.5">
        {SUB_PLANS.map((p) => (
          <div key={p.label} className="h-full transition-all duration-700 ease-out rounded-full" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {SUB_PLANS.map((p) => (
          <div key={p.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{p.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {!loading && (
                <span className="text-[11px] text-gray-400 dark:text-slate-500">
                  {Math.round((total || 0) * p.pct / 100).toLocaleString()}
                </span>
              )}
              <span className={`text-[11px] font-bold ${p.text}`}>{p.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─── MAIN DASHBOARD COMPONENT ────────────────────────────────────────────────
const REFRESH_INTERVAL = 30000;

export default function Dashboard() {
  const [animate, setAnimate] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [manualRefreshing, setManualRefresh] = useState(false);

  const stats = useLiveData(API.fetchStats, REFRESH_INTERVAL);
  const userGrowth = useLiveData(API.fetchUserGrowth, REFRESH_INTERVAL);
  const blogStats = useLiveData(API.fetchBlogStats, REFRESH_INTERVAL);
  const revenue = useLiveData(API.fetchRevenue, REFRESH_INTERVAL);
  const topContent = useLiveData(API.fetchTopContent, REFRESH_INTERVAL);
  const activity = useLiveData(API.fetchActivity, REFRESH_INTERVAL);

  const anyLoading = stats.loading || userGrowth.loading;

  useEffect(() => {
    if (!anyLoading) setTimeout(() => setAnimate(true), 100);
  }, [anyLoading]);

  useEffect(() => {
    setCountdown(30);
    const id = setInterval(() => setCountdown((c) => (c <= 1 ? 30 : c - 1)), 1000);
    return () => clearInterval(id);
  }, [stats.lastUpdated]);

  const handleRefresh = async () => {
    setManualRefresh(true);
    setAnimate(false);
    await Promise.all([
      stats.refetch(), userGrowth.refetch(), blogStats.refetch(),
      revenue.refetch(), topContent.refetch(), activity.refetch(),
    ]);
    setTimeout(() => { setAnimate(true); setManualRefresh(false); }, 200);
  };

  const s = stats.data || {};
  const tr = s.trends || {};
  const now = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const STAT_CARDS = [
    { label: 'Total Users', value: s.users, icon: Users, trendPct: tr.users, ...CARD_CFG[0], delay: 0 },
    { label: 'Active Blogs', value: s.blogs, icon: BookOpen, trendPct: tr.blogs, ...CARD_CFG[1], delay: 60 },
    { label: 'Subscriptions', value: s.subscriptions, icon: CreditCard, trendPct: tr.subscriptions, ...CARD_CFG[2], delay: 120 },
    { label: 'Categories', value: s.categories, icon: Layers, ...CARD_CFG[3], delay: 180 },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-full overflow-hidden">

      {/* ── Header (Fully Responsive Flex/Stack) ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 dark:text-slate-50 m-0 tracking-tight transition-colors">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1 font-medium m-0 transition-colors">
            {now}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
          <LiveTicker lastUpdated={stats.lastUpdated} nextIn={countdown} />
          <button
            onClick={handleRefresh}
            disabled={manualRefreshing}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 shadow-sm transition-all hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/30 ${manualRefreshing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${manualRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Stat Cards (1 Col Mobile -> 2 Col Tablet -> 4 Col Desktop) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {STAT_CARDS.map((c) => (
          <StatCard key={c.label} {...c} loading={stats.loading} animate={animate} />
        ))}
      </div>

      {/* ── Growth Chart ── */}
      <div className="w-full overflow-hidden">
        <ChartSection
          userData={userGrowth.data}
          blogData={blogStats.data}
          revenueData={revenue.data}
          loading={userGrowth.loading || blogStats.loading || revenue.loading}
          animate={animate}
        />
      </div>

      {/* ── Bottom row (Stacks on Mobile/Tablet, Splits 3/2 on Desktop) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
        <div className="lg:col-span-3">
          <Link to="/blogs" className="block outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-[20px]">
            <Panel
              title="Top Performing Content"
              subtitle="By views this month"
              action="All posts"
              className="hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors h-full"
            >
              <TopContent data={topContent.data} loading={topContent.loading} />
            </Panel>
          </Link>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5 sm:gap-6">
          <Panel title="Live Activity">
            <ActivityFeed data={activity.data} loading={activity.loading} />
          </Panel>
          <SubBreakdown total={s.subscriptions} loading={stats.loading} />
        </div>
      </div>

      <style>{`
        @keyframes drawLine {
          from { stroke-dashoffset: 2000; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </div>
  );
}