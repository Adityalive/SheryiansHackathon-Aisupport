// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupportStore } from "../features/support-widget/store/useSupportStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  Zap,
  ArrowRight,
  Play,
  Bot,
  Mic,
  BarChart2,
  ShieldCheck,
  Globe,
  ChevronRight,
  ExternalLink,
  Share2,
  Code2,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    title: "AI Chatbot",
    desc: "Human-like conversations that understand intent. Handles complex multi-turn dialogues effortlessly.",
  },
  {
    icon: Mic,
    color: "text-violet-600",
    bg: "bg-violet-50",
    title: "Voice Support",
    desc: "Natural voice AI for calls and real-time assistance. Customers speak — the AI listens and responds.",
  },
  {
    icon: BarChart2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "Live Analytics",
    desc: "Real-time dashboards showing ticket trends, satisfaction rates, and team performance at a glance.",
  },
  {
    icon: ShieldCheck,
    color: "text-amber-600",
    bg: "bg-amber-50",
    title: "Enterprise Security",
    desc: "SOC 2 Type II compliant. End-to-end encryption, role-based access, and full audit trails built in.",
  },
  {
    icon: Zap,
    color: "text-rose-600",
    bg: "bg-rose-50",
    title: "Fast Automation",
    desc: "Resolve repetitive issues in under 2 seconds. Smart routing ensures the right query reaches the right agent.",
  },
  {
    icon: Globe,
    color: "text-sky-600",
    bg: "bg-sky-50",
    title: "Global Support",
    desc: "Serve customers in 40+ languages with full semantic understanding. Your support, everywhere.",
  },
];

const stats = [
  { value: "94%", label: "AI Resolved", color: "text-indigo-600" },
  { value: "1.2s", label: "Avg Response", color: "text-violet-600" },
  { value: "12K+", label: "Active Tickets", color: "text-emerald-600" },
  { value: "4.9/5", label: "CSAT Score", color: "text-amber-600" },
];

const marqueeItems = [
  "AI Chatbot",
  "Voice Support",
  "Live Analytics",
  "Multilingual",
  "Auto-Routing",
  "Sentiment Analysis",
  "Smart Escalation",
  "99.9% Uptime",
];

const socialIcons = [ExternalLink, Share2, Code2];

const footerCols = [
  {
    title: "Product",
    links: ["Features", "Integrations", "Pricing", "Changelog"],
  },
  {
    title: "Resources",
    links: ["Documentation", "API Reference", "Blog", "Status"],
  },
  { title: "Company", links: ["About", "Careers", "Contact", "Privacy"] },
];

export default function Home() {
  const navigate = useNavigate();
  const toggleWidget = useSupportStore((s) => s.toggleWidget);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-reveal
  useEffect(() => {
    const els = document.querySelectorAll(".sr");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("sr-in");
        }),
      { threshold: 0.1 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleGetStarted = () =>
    navigate(isAuthenticated ? "/dashboard" : "/signup");

  return (
    <>
      {/* Global styles: Inter font + scroll-reveal + marquee */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .sr { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .sr-in { opacity: 1; transform: translateY(0); }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 24s linear infinite; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .anim-1 { animation: fade-up 0.7s ease both; }
        .anim-2 { animation: fade-up 0.7s 0.12s ease both; }
        .anim-3 { animation: fade-up 0.7s 0.24s ease both; }
        .anim-4 { animation: fade-up 0.7s 0.36s ease both; }
      `}</style>

      <div className="min-h-screen bg-[#f8f9fa] font-['Inter',sans-serif] text-[#191c1d] overflow-x-hidden">
        {/* ── NAV ─────────────────────────────────────────────── */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 transition-all duration-300 ${
            scrolled
              ? "h-14 bg-white/90 backdrop-blur-md border-b border-[#e1e3e4] shadow-sm"
              : "h-16 bg-transparent"
          }`}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-2 group"
          >
            <div className="w-7 h-7 bg-[#4338ca] rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-700 transition-colors">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm text-[#191c1d]">
              SupportAI
            </span>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!isAuthenticated && (
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-[#464554] hover:text-[#191c1d] transition-colors px-3 py-1.5"
              >
                Log in
              </button>
            )}
            <button
              onClick={handleGetStarted}
              className="text-sm font-semibold bg-[#4338ca] hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors"
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
            </button>
          </div>
        </nav>

        {/* ── HERO ────────────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center text-center min-h-screen pt-24 pb-16 px-6 relative">
          {/* Subtle background orb */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="anim-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Next-Gen AI Customer Support
          </div>

          {/* Headline */}
          <h1 className="anim-2 text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight max-w-4xl mb-6 text-[#191c1d]">
            Support at the speed of{" "}
            <span className="text-[#4338ca]">intelligence</span>
          </h1>

          {/* Subhead */}
          <p className="anim-3 text-lg text-[#777586] max-w-xl leading-relaxed mb-10">
            Resolve 80% of customer queries instantly. Human-like conversational
            AI built for teams who refuse to compromise.
          </p>

          {/* CTAs */}
          <div className="anim-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleGetStarted}
              className="flex items-center gap-2 bg-[#4338ca] hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-200"
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
              <ArrowRight size={16} />
            </button>
            <button
              onClick={toggleWidget}
              className="flex items-center gap-2 bg-white hover:bg-[#f3f4f5] text-[#191c1d] text-sm font-semibold px-6 py-3 rounded-lg border border-[#e1e3e4] transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <Play size={14} className="text-[#4338ca]" />
              Watch Demo
            </button>
          </div>
        </section>

        {/* ── STATS ───────────────────────────────────────────── */}
        <div className="sr px-6 pb-16 max-w-5xl mx-auto">
          <div className="bg-white border border-[#e1e3e4] rounded-xl overflow-hidden shadow-[0_10px_40px_-8px_rgba(0,0,0,0.08)]">
            {/* Mac dots bar */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f8f9fa] border-b border-[#e1e3e4]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center py-8 text-center relative ${
                    i < stats.length - 1 ? "border-r border-[#e1e3e4]" : ""
                  }`}
                >
                  <div
                    className={`text-4xl font-bold tracking-tight mb-1 ${s.color}`}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#777586]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MARQUEE ─────────────────────────────────────────── */}
        <div className="border-t border-b border-[#e1e3e4] py-5 overflow-hidden bg-white">
          <div className="marquee-track flex gap-16 w-max">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[#777586] whitespace-nowrap"
              >
                <span className="w-1 h-1 rounded-full bg-[#4338ca]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ────────────────────────────────────────── */}
        <section
          id="features"
          className="px-6 lg:px-16 py-24 max-w-7xl mx-auto"
        >
          <div className="sr mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4338ca]">
              Capabilities
            </span>
          </div>
          <h2 className="sr text-4xl md:text-5xl font-bold tracking-tight max-w-lg mb-16 text-[#191c1d]">
            Built for teams
            <br />
            who move fast.
          </h2>

          <div className="sr grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e1e3e4] border border-[#e1e3e4] rounded-xl overflow-hidden">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white hover:bg-[#f8f9fa] transition-colors p-8 group cursor-default"
                >
                  <div
                    className={`w-11 h-11 rounded-lg ${f.bg} flex items-center justify-center mb-5`}
                  >
                    <Icon size={20} className={f.color} />
                  </div>
                  <h3 className="font-semibold text-[#191c1d] text-base mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[#777586] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────── */}
        <section className="bg-white border-t border-b border-[#e1e3e4] py-24 px-6 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="sr text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#4338ca]">
                How it works
              </span>
              <h2 className="text-4xl font-bold tracking-tight mt-3 text-[#191c1d]">
                Up and running in minutes
              </h2>
              <p className="text-[#777586] mt-3 text-base max-w-md mx-auto leading-relaxed">
                No complex setup. Embed your widget, train the AI, and let it
                handle the rest.
              </p>
            </div>
            <div className="sr grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Connect your data",
                  desc: "Import your knowledge base, FAQs, and product docs. Our AI learns your business instantly.",
                },
                {
                  step: "02",
                  title: "Embed the widget",
                  desc: "Copy a single line of JavaScript to add the support widget to any website or app.",
                },
                {
                  step: "03",
                  title: "Watch it work",
                  desc: "Your AI handles queries 24/7, escalates when needed, and learns from every interaction.",
                },
              ].map((s, i) => (
                <div key={i} className="relative">
                  <div className="text-5xl font-bold text-[#e1e3e4] mb-4 select-none">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-[#191c1d] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#777586] leading-relaxed">
                    {s.desc}
                  </p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-6 right-0 translate-x-1/2">
                      <ChevronRight size={20} className="text-[#c7c4d7]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="sr py-24 px-6 max-w-4xl mx-auto text-center">
          <div className="bg-[#4338ca] rounded-2xl px-8 py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzYgMzRjMC0xLjEuOS0yIDItMnMyIDkgMiAyLS45IDItMiAyLTItLjktMi0yeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-40" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to transform your support?
              </h2>
              <p className="text-indigo-200 text-base max-w-md mx-auto mb-8 leading-relaxed">
                Join teams using SupportAI to deliver exceptional experiences —
                24 hours a day, 7 days a week.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleGetStarted}
                  className="flex items-center gap-2 bg-white text-[#4338ca] text-sm font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors shadow-md"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={toggleWidget}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <Play size={14} />
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <footer
          id="contact"
          className="border-t border-[#e1e3e4] bg-white px-6 lg:px-16 pt-16 pb-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-[#4338ca] rounded-md flex items-center justify-center">
                    <Zap size={14} className="text-white" />
                  </div>
                  <span className="font-semibold text-sm text-[#191c1d]">
                    SupportAI
                  </span>
                </div>
                <p className="text-sm text-[#777586] leading-relaxed max-w-[200px]">
                  Automating the future of customer interactions, one
                  conversation at a time.
                </p>
              </div>
              {/* Link Cols */}
              {footerCols.map((col, i) => (
                <div key={i}>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-[#777586] mb-4">
                    {col.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links.map((l, j) => (
                      <li key={j}>
                        <a
                          href="#"
                          className="text-sm text-[#464554] hover:text-[#191c1d] transition-colors"
                        >
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[#e1e3e4] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#777586]">
                © 2026 SupportAI. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                {socialIcons.map((Icon, i) => (
                  <button
                    key={i}
                    className="w-8 h-8 rounded-md bg-[#f3f4f5] border border-[#e1e3e4] flex items-center justify-center text-[#777586] hover:text-[#191c1d] hover:bg-[#e1e3e4] transition-colors"
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
