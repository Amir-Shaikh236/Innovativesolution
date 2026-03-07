import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users, BookOpen, Layers, CreditCard, TrendingUp, TrendingDown,
  RefreshCw, Clock, Star, Eye, ArrowRight, ArrowUpRight,
  Activity, CheckCircle2, AlertCircle, Circle, UserPlus, FileText, Zap,
} from 'lucide-react';
import api from '../api';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// API LAYER
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// GLASS STAT CARD — white interior, animated gradient border on hover
// ─────────────────────────────────────────────────────────────────────────────

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
      style={{
        padding: 1.5,
        borderRadius: 20,
        background: hov
          ? gradient
          : 'linear-gradient(135deg,#e5e7eb 0%,#f3f4f6 50%,#e5e7eb 100%)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hov ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hov
          ? '0 24px 48px rgba(0,0,0,0.10),0 8px 16px rgba(0,0,0,0.06)'
          : '0 2px 8px rgba(0,0,0,0.04)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        background: '#ffffff',
        borderRadius: 18.5,
        padding: '20px 22px 18px',
        minHeight: 155,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Subtle tinted wash */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 18.5,
          background: gradient,
          opacity: hov ? 0.05 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
        }} />

        {/* Label + Icon */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <p style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#9ca3af', margin: 0,
          }}>
            {label}
          </p>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: hov ? gradient : '#f9fafb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.35s ease',
            boxShadow: hov ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
          }}>
            <Icon style={{ width: 16, height: 16, color: hov ? '#fff' : iconColor }} />
          </div>
        </div>

        {/* Value + trend */}
        <div>
          {loading ? (
            <div style={{
              height: 38, width: 110, borderRadius: 8, marginTop: 14,
              background: 'linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite linear',
            }} />
          ) : (
            <p style={{
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: '-0.035em',
              color: hov ? numberColor : '#111827',
              margin: '10px 0 0',
              transition: 'color 0.35s ease',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {prefix}{count.toLocaleString()}{suffix}
            </p>
          )}

          {trendPct !== undefined && !loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                fontSize: 11, fontWeight: 700,
                padding: '3px 8px', borderRadius: 99,
                background: up ? '#f0fdf4' : '#fef2f2',
                color: up ? '#16a34a' : '#dc2626',
              }}>
                {up
                  ? <TrendingUp style={{ width: 11, height: 11 }} />
                  : <TrendingDown style={{ width: 11, height: 11 }} />}
                {Math.abs(trendPct)}%
              </span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{trendLabel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE TICKER
// ─────────────────────────────────────────────────────────────────────────────

function LiveTicker({ lastUpdated, nextIn }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      if (lastUpdated) setElapsed(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>
      <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
        <span style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: '#10b981', opacity: 0.5,
          animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite',
        }} />
        <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
      </span>
      {lastUpdated
        ? `Updated ${elapsed < 5 ? 'just now' : `${elapsed}s ago`} · next in ${nextIn}s`
        : 'Loading…'}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LINE CHART (pure SVG)
// ─────────────────────────────────────────────────────────────────────────────

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
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height }}>
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
            <line x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#d1d5db" fontFamily="monospace">
              {val >= 1000 ? `${(val / 1000).toFixed(val >= 10000 ? 0 : 1)}k` : val}
            </text>
          </g>
        );
      })}

      {datasets.map((d) => d.values.length > 0 && (
        <path key={`a-${d.key}`} d={areaD(d.values)} fill={`url(#lg-${d.key})`} />
      ))}
      {datasets.map((d) => d.values.length > 0 && (
        <path key={`l-${d.key}`} d={pathD(d.values)} fill="none"
          stroke={d.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={animate ? { strokeDasharray: 2000, strokeDashoffset: 0, animation: 'drawLine 1.4s ease forwards' } : {}}
        />
      ))}
      {datasets.map((d) => d.values.map((v, i) => (
        <circle key={`d-${d.key}-${i}`}
          cx={PAD.left + i * xStep} cy={PAD.top + yScale(v)}
          r="3.5" fill="white" stroke={d.color} strokeWidth="2"
        />
      )))}
      {labels.map((l, i) => (
        <text key={l} x={PAD.left + i * xStep} y={H - 4}
          textAnchor="middle" fontSize="10" fill="#d1d5db" fontFamily="monospace">
          {l}
        </text>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART SECTION
// ─────────────────────────────────────────────────────────────────────────────

const CHART_TABS = [
  { key: 'users', label: 'Users', color: '#10b981' },
  { key: 'blogs', label: 'Content', color: '#3b82f6' },
  { key: 'revenue', label: 'Revenue', color: '#8b5cf6' },
];

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111827', margin: 0 }}>Growth Analytics</h3>
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, fontWeight: 500 }}>12-month trend · live data</p>
        </div>
        <div style={{ display: 'flex', gap: 3, padding: 3, background: '#f9fafb', borderRadius: 10 }}>
          {CHART_TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: tab === t.key ? '#fff' : 'transparent',
              color: tab === t.key ? '#111827' : '#9ca3af',
              boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {!loading && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
          {datasets[tab].map((d) => (
            <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 18, height: 3, borderRadius: 2, background: d.color }} />
              <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>{d.label}</span>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
          <Activity style={{ width: 22, height: 22, color: '#e5e7eb' }} />
          <p style={{ fontSize: 11, color: '#d1d5db', margin: 0 }}>Loading chart…</p>
        </div>
      ) : (
        <LineChart datasets={datasets[tab]} labels={labels} height={200} animate={animate} />
      )}
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const CAT_COLORS = {
  Tech: { bg: '#eff6ff', color: '#3b82f6' },
  Lifestyle: { bg: '#fff7ed', color: '#f97316' },
  Health: { bg: '#ecfdf5', color: '#10b981' },
};

function TopContent({ data, loading }) {
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0' }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f1f5f9', flexShrink: 0 }} className="animate-pulse" />
          <div style={{ flex: 1 }}>
            <div style={{ height: 10, borderRadius: 99, background: '#f1f5f9', width: '70%', marginBottom: 6 }} className="animate-pulse" />
            <div style={{ height: 8, borderRadius: 99, background: '#f9fafb', width: '35%' }} className="animate-pulse" />
          </div>
          <div style={{ width: 36, height: 10, borderRadius: 99, background: '#f1f5f9' }} className="animate-pulse" />
        </div>
      ))}
    </div>
  );

  const maxViews = Math.max(...(data?.map((d) => d.views) || [1]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {(data || []).map((item, i) => {
        const cat = CAT_COLORS[item.category] || { bg: '#f8fafc', color: '#64748b' };
        const pct = (item.views / maxViews) * 100;
        return (
          <div key={i} className="group" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 12, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: 10, fontWeight: 800, color: '#d1d5db', width: 16, textAlign: 'right', flexShrink: 0 }}>
              {i + 1}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 3, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden', maxWidth: 100 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: cat.color, borderRadius: 2, transition: 'width 0.8s ease' }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99, background: cat.bg, color: cat.color }}>
                  {item.category}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#9ca3af' }}>
                <Eye style={{ width: 11, height: 11 }} />{item.views.toLocaleString()}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#9ca3af' }}>
                <Star style={{ width: 11, height: 11 }} />{item.likes.toLocaleString()}
              </span>
              <ArrowUpRight style={{ width: 13, height: 13, color: '#e5e7eb', transition: 'color 0.15s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#e5e7eb'}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY FEED
// ─────────────────────────────────────────────────────────────────────────────

function ActivityFeed({ data, loading }) {
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="animate-pulse">
          <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f1f5f9', flexShrink: 0 }} />
          <div style={{ flex: 1, height: 11, borderRadius: 99, background: '#f1f5f9' }} />
          <div style={{ width: 32, height: 9, borderRadius: 99, background: '#f9fafb' }} />
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {(data || []).map((item, i) => {
        const Icon = ICON_MAP[item.icon] || Circle;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '7px 8px', borderRadius: 12, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon style={{ width: 13, height: 13, color: item.color }} />
            </div>
            <p style={{ flex: 1, fontSize: 12.5, color: '#4b5563', fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.text}
            </p>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: '#d1d5db', flexShrink: 0 }}>
              <Clock style={{ width: 10, height: 10 }} />{item.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION BREAKDOWN
// ─────────────────────────────────────────────────────────────────────────────

const SUB_PLANS = [
  { label: 'Free', pct: 58, color: '#e2e8f0', text: '#94a3b8' },
  { label: 'Basic', pct: 22, color: '#bfdbfe', text: '#3b82f6' },
  { label: 'Pro', pct: 14, color: '#a7f3d0', text: '#10b981' },
  { label: 'Annual', pct: 6, color: '#ddd6fe', text: '#8b5cf6' },
];

function SubBreakdown({ total, loading }) {
  return (
    <Panel>
      <h4 style={{ fontSize: 13, fontWeight: 800, color: '#111827', margin: '0 0 2px' }}>Subscription Plans</h4>
      <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 14px', fontWeight: 500 }}>Distribution across tiers</p>
      <div style={{ display: 'flex', height: 6, borderRadius: 99, overflow: 'hidden', gap: 2, marginBottom: 14 }}>
        {SUB_PLANS.map((p) => (
          <div key={p.label} style={{ width: `${p.pct}%`, background: p.color, transition: 'width 0.6s ease', borderRadius: 99 }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {SUB_PLANS.map((p) => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{p.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!loading && (
                <span style={{ fontSize: 11, color: '#9ca3af' }}>
                  {Math.round((total || 0) * p.pct / 100).toLocaleString()}
                </span>
              )}
              <span style={{ fontSize: 11, fontWeight: 700, color: p.text }}>{p.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL — shared white card shell
// ─────────────────────────────────────────────────────────────────────────────

function Panel({ children, title, subtitle, action, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '22px 24px 20px',
      border: '1px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.045)',
      ...style,
    }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#111827', margin: 0 }}>{title}</h3>
            {subtitle && <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, fontWeight: 500 }}>{subtitle}</p>}
          </div>
          {action && (
            <button style={{
              display: 'flex', alignItems: 'center', gap: 3,
              fontSize: 11, fontWeight: 700, color: '#10b981',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              transition: 'color 0.15s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#10b981'}
            >
              {action} <ArrowRight style={{ width: 12, height: 12 }} />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD GRADIENT CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

const CARD_CFG = [
  { gradient: 'linear-gradient(135deg,#10b981 0%,#34d399 60%,#6ee7b7 100%)', iconColor: '#10b981', numberColor: '#059669' },
  { gradient: 'linear-gradient(135deg,#3b82f6 0%,#60a5fa 60%,#93c5fd 100%)', iconColor: '#3b82f6', numberColor: '#2563eb' },
  { gradient: 'linear-gradient(135deg,#8b5cf6 0%,#a78bfa 60%,#c4b5fd 100%)', iconColor: '#8b5cf6', numberColor: '#7c3aed' },
  { gradient: 'linear-gradient(135deg,#f97316 0%,#fb923c 60%,#fdba74 100%)', iconColor: '#f97316', numberColor: '#ea580c' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

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
  const now = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const STAT_CARDS = [
    { label: 'Total Users', value: s.users, icon: Users, trendPct: tr.users, ...CARD_CFG[0], delay: 0 },
    { label: 'Active Blogs', value: s.blogs, icon: BookOpen, trendPct: tr.blogs, ...CARD_CFG[1], delay: 60 },
    { label: 'Subscriptions', value: s.subscriptions, icon: CreditCard, trendPct: tr.subscriptions, ...CARD_CFG[2], delay: 120 },
    { label: 'Categories', value: s.categories, icon: Layers, ...CARD_CFG[3], delay: 180 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, fontWeight: 500, margin: '3px 0 0' }}>{now}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LiveTicker lastUpdated={stats.lastUpdated} nextIn={countdown} />
          <button
            onClick={handleRefresh}
            disabled={manualRefreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 99, fontSize: 12, fontWeight: 600,
              background: '#fff', border: '1px solid #e5e7eb', color: '#6b7280',
              cursor: manualRefreshing ? 'not-allowed' : 'pointer',
              opacity: manualRefreshing ? 0.5 : 1,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { if (!manualRefreshing) { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.borderColor = '#a7f3d0'; } }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
          >
            <RefreshCw style={{ width: 13, height: 13 }} className={manualRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((c) => (
          <StatCard key={c.label} {...c} loading={stats.loading} animate={animate} />
        ))}
      </div>

      {/* ── Growth Chart ── */}
      <ChartSection
        userData={userGrowth.data}
        blogData={blogStats.data}
        revenueData={revenue.data}
        loading={userGrowth.loading || blogStats.loading || revenue.loading}
        animate={animate}
      />

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Top content */}
        <div className="lg:col-span-3">
          <Link to="/blogs">
            <Panel
              title="Top Performing Content"
              subtitle="By views this month"
              action="All posts"
            >
              <TopContent data={topContent.data} loading={topContent.loading} />
            </Panel>
          </Link>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Panel title="Live Activity" action="">
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
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}