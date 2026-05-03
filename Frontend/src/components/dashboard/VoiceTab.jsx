import { useState } from 'react';
import { PhoneCall, Mic, Sparkles, MessageSquare, Headphones, Zap, Globe, Clock, Check, Monitor, Ticket, X, Send } from 'lucide-react';

const VoiceTab = () => {
  const [requestSent, setRequestSent] = useState(false);

  const handleRequest = () => {
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef2ff] text-[#4338ca] text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} />
          Next-Gen Voice AI
        </div>
        <h1 className="text-4xl font-extrabold text-[#191c1d] tracking-tight">
          Your AI Support Agent, Now with a <span className="text-[#4338ca]">Human Voice</span>
        </h1>
        <p className="text-lg text-[#777586] max-w-2xl mx-auto leading-relaxed">
          Break the barrier of text. Our advanced Voice AI understands emotion, context, and intent in real-time, providing a seamless calling experience for your customers.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-[#e1e3e4] shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <Mic size={24} className="text-blue-600 group-hover:text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1d] mb-3">Natural Conversations</h3>
          <p className="text-sm text-[#777586] leading-relaxed">
            Forget robotic prompts. Our AI handles interruptions, pauses, and complex sentences just like a real person would.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#e1e3e4] shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
            <Zap size={24} className="text-purple-600 group-hover:text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1d] mb-3">Instant Knowledge</h3>
          <p className="text-sm text-[#777586] leading-relaxed">
            Connected directly to your Knowledge Base. It can answer questions about your business, pricing, and policies in milliseconds.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#e1e3e4] shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
            <MessageSquare size={24} className="text-green-600 group-hover:text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#191c1d] mb-3">24/7 Availability</h3>
          <p className="text-sm text-[#777586] leading-relaxed">
            Your support never sleeps. Handle hundreds of simultaneous calls without any wait time or busy signals.
          </p>
        </div>
      </div>

      {/* "How it talks" Section */}
      <div className="bg-[#191c1d] rounded-3xl p-10 text-white overflow-hidden relative shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold leading-tight">
              A voice agent that actually <span className="text-blue-400">listens</span>
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Headphones size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Human-Like Inflection</h4>
                  <p className="text-xs text-white/60 mt-1">Our AI uses neural text-to-speech to sound warm, empathetic, and professional.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Globe size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Multilingual Support</h4>
                  <p className="text-xs text-white/60 mt-1">Talk to customers in over 40 languages with perfect accents and local nuances.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Zero Latency</h4>
                  <p className="text-xs text-white/60 mt-1">Proprietary streaming technology ensures there are no awkward silences during the call.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Live Demo Preview</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-xs italic">"Hello! Thanks for calling SupportAI. How can I help you today?"</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-600 rounded-2xl rounded-tr-none p-3 max-w-[80%]">
                  <p className="text-xs italic">"Hi, I wanted to know if you offer refunds for the Pro plan?"</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-xs italic">"Yes, we have a 14-day no-questions-asked refund policy for all our paid plans. Would you like me to send you the link to the refund form?"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 blur-[100px] -ml-32 -mb-32" />
      </div>

      {/* Embedded Web Widget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center bg-white rounded-3xl p-6 md:p-10 border border-[#e1e3e4] shadow-sm">
        <div className="space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <Monitor size={14} />
            Web Integration
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#191c1d] leading-tight">
            Talk directly from your <span className="text-[#4338ca]">Website</span>
          </h2>
          <p className="text-sm md:text-base text-[#777586] leading-relaxed">
            Your customers don't need to dial a phone number. Our voice assistant is built directly into the web chat widget. They can simply hold the microphone icon to speak their questions and get instant spoken replies.
          </p>
          <ul className="space-y-3">
            {[
              'No phone calls or external apps required',
              'Real-time speech-to-text transcription',
              'Works flawlessly on desktop and mobile browsers',
              'Seamlessly transitions between text and voice'
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <Check size={16} className="text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium text-[#464554]">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Widget Visual Replica */}
        <div className="flex justify-center w-full overflow-hidden">
          <div className="w-full max-w-[350px] bg-[#f8f9fa] rounded-2xl overflow-hidden shadow-2xl border border-[#e1e3e4] flex flex-col h-[400px] md:h-[450px]">
            {/* Widget Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex flex-col justify-between h-[100px]">
              <div className="flex justify-end gap-2">
                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm cursor-pointer">
                   <Ticket size={16} className="text-white" />
                 </div>
                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm cursor-pointer">
                   <X size={16} className="text-white" />
                 </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-base md:text-lg">AI Support</h3>
                <p className="text-white/80 text-[10px] md:text-xs">We typically reply in minutes</p>
              </div>
            </div>

            {/* Widget Body */}
            <div className="flex-1 bg-white flex items-center justify-center p-6">
              <p className="text-center text-[#464554] text-base md:text-lg font-medium px-4">Hi there! How can we help you today?</p>
            </div>

            {/* Widget Input */}
            <div className="bg-white p-3 border-t border-[#e1e3e4]">
              <div className="bg-[#f3f4f5] rounded-full flex items-center px-4 py-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Type or speak..." 
                  className="bg-transparent outline-none flex-1 text-xs md:text-sm text-[#464554] placeholder-[#777586]"
                  disabled
                />
                <button className="p-1.5 text-[#777586] hover:text-[#4338ca] transition-colors relative group">
                  <Mic size={18} />
                  <span className="absolute inset-0 rounded-full border-2 border-[#4338ca] scale-150 opacity-0 group-hover:animate-ping" />
                </button>
                <button className="w-8 h-8 bg-[#cbd5e1] rounded-full flex items-center justify-center text-white ml-1">
                  <Send size={14} className="-ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#f8f9fa] rounded-2xl p-10 border border-[#e1e3e4] text-center shadow-inner relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-[#191c1d] mb-4">Ready to give your business a voice?</h3>
          {requestSent ? (
            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-500">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Check size={24} />
              </div>
              <p className="text-lg font-bold text-green-700">Request Sent Successfully!</p>
              <p className="text-sm text-[#777586]">Our team will contact you within 24 hours to enable Voice AI for your account.</p>
            </div>
          ) : (
            <>
              <button 
                onClick={handleRequest}
                className="bg-[#4338ca] text-white px-10 py-4 rounded-full font-bold text-base hover:bg-[#3730a3] transition-all flex items-center gap-2 mx-auto shadow-xl shadow-indigo-200 active:scale-95"
              >
                <PhoneCall size={20} />
                Request Access to Voice AI
              </button>
              <p className="text-xs text-[#777586] mt-4 font-medium uppercase tracking-widest">Enterprise-Grade Security Included • Zero Setup Fee</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceTab;
