// src/pages/Home.jsx

import React from "react";
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  Bot,
  Headphones,
  BarChart3,
  ShieldCheck,
  Zap,
  Globe,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Bot size={28} />,
      title: "AI Chatbot",
      desc: "Smart human-like chatbot that solves queries instantly.",
    },
    {
      icon: <Headphones size={28} />,
      title: "Voice Support",
      desc: "Natural voice AI for calls & customer assistance.",
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Analytics",
      desc: "Track tickets, growth, satisfaction & live insights.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Secure System",
      desc: "Enterprise-level security for customer data.",
    },
    {
      icon: <Zap size={28} />,
      title: "Fast Automation",
      desc: "Resolve repetitive issues in seconds automatically.",
    },
    {
      icon: <Globe size={28} />,
      title: "Global Support",
      desc: "Multi-language support for worldwide customers.",
    },
  ];

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-200 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-100 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-xl">
              <Sparkles size={22} />
            </div>

            <h1 className="text-2xl font-bold">
              SupportSphere{" "}
              <span className="text-blue-700">AI</span>
            </h1>
          </div>

          <div className="hidden md:flex gap-10 text-slate-600 font-medium">
            <a href="#features" className="hover:text-blue-700 transition">
              Features
            </a>
            <a href="#reviews" className="hover:text-blue-700 transition">
              Reviews
            </a>
            <a href="#contact" className="hover:text-blue-700 transition">
              Contact
            </a>
          </div>

          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-semibold shadow-xl">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium">
              <Sparkles size={16} />
              AI Powered Customer Support
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mt-6 leading-tight">
              Automate <br />
              Support With <br />
              <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                Smart AI
              </span>
            </h1>

            <p className="text-slate-500 text-xl mt-6 max-w-xl leading-relaxed">
              Handle chats, calls, tickets and customer queries using one
              futuristic AI platform built for fast-growing businesses.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-semibold shadow-2xl flex items-center gap-2">
                Start Free Trial <ArrowRight size={18} />
              </button>

              <button className="px-8 py-4 rounded-2xl border border-slate-300 bg-white font-semibold flex items-center gap-2">
                <PlayCircle size={20} />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Premium Card */}
          <div className="relative">
            <div className="bg-white border border-slate-200 rounded-[36px] p-7 shadow-2xl">
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-slate-50 rounded-3xl p-6">
                  <p className="text-slate-500">AI Resolved</p>
                  <h2 className="text-5xl font-bold text-blue-700 mt-2">
                    94%
                  </h2>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6">
                  <p className="text-slate-500">Response Time</p>
                  <h2 className="text-5xl font-bold text-indigo-600 mt-2">
                    2s
                  </h2>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 col-span-2">
                  <p className="text-slate-500 mb-4">Live Requests</p>

                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-800 to-cyan-500 w-[78%]" />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 col-span-2">
                  <p className="text-slate-500">Today Tickets</p>
                  <h2 className="text-4xl font-bold mt-2">1,284</h2>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-8 -right-8 bg-white px-5 py-4 rounded-2xl shadow-xl border">
              ⚡ 50% Faster
            </div>

            <div className="absolute -bottom-8 -left-8 bg-white px-5 py-4 rounded-2xl shadow-xl border">
              ⭐ Trusted by 100+ Brands
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 text-white flex items-center justify-center mb-6 shadow-lg">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto rounded-[40px] p-16 text-center bg-gradient-to-r from-blue-800 to-indigo-600 text-white shadow-2xl">
          <h2 className="text-5xl font-bold mb-6">
            Ready To Grow Faster?
          </h2>

          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Let AI handle customer support while you focus on scaling your
            business.
          </p>

          <button className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold">
            Start Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t border-slate-200 py-8 text-center text-slate-500"
      >
        © 2026 SupportSphere AI • All Rights Reserved
      </footer>
    </div>
  );
}
