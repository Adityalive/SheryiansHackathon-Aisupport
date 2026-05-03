import { useState } from "react";
import { Copy, Check, ExternalLink, Code2, Monitor, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

const WidgetTab = ({ tenantId }) => {
  const [copied, setCopied] = useState(false);
  const [snippetCopied, setSnippetCopied] = useState(false);

  const scriptSnippet = `<script
  src="https://your-backend-domain.com/public/widget.js"
  data-business-id="${tenantId || 'default-tenant'}"
  data-api-base="https://your-backend-domain.com/api">
</script>`;

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(scriptSnippet);
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Configuration Column */}
        <div className="flex-1 space-y-6">
          <div className="bg-white border border-[#e1e3e4] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e1e3e4] bg-[#f8f9fa] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 size={16} className="text-[#4338ca]" />
                <h3 className="text-sm font-bold text-[#191c1d]">Installation Guide</h3>
              </div>
              <span className="text-[10px] font-bold text-[#4338ca] bg-[#eef2ff] px-2 py-0.5 rounded uppercase">V1.0 Stable</span>
            </div>
            <div className="p-6 space-y-6">
              {/* Tenant ID */}
              <div>
                <label className="block text-[10px] font-bold text-[#777586] uppercase tracking-wider mb-2">Your Business ID</label>
                <div className="flex items-center gap-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-xl px-4 py-3 group">
                  <code className="flex-1 text-sm text-[#191c1d] font-mono truncate">{tenantId}</code>
                  <button onClick={() => copy(tenantId)} className="p-1.5 hover:bg-white rounded-md transition-all">
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-[#777586]" />}
                  </button>
                </div>
              </div>

              {/* Code Snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold text-[#777586] uppercase tracking-wider">Embed Snippet</label>
                  <button onClick={copySnippet} className="text-[10px] font-bold text-[#4338ca] hover:underline flex items-center gap-1">
                    {snippetCopied ? 'Copied to clipboard' : 'Copy entire snippet'}
                  </button>
                </div>
                <div className="relative group">
                  <div className="bg-[#191c1d] text-[#c3c0ff] rounded-xl p-5 font-mono text-xs leading-relaxed whitespace-pre overflow-x-auto border border-[#2d333b] shadow-lg">
                    {scriptSnippet}
                  </div>
                </div>
                <div className="mt-4 p-4 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl flex gap-3">
                  <div className="mt-0.5">
                    <ShieldCheck size={16} className="text-[#0369a1]" />
                  </div>
                  <p className="text-xs text-[#0369a1] leading-relaxed">
                    <strong>Placement:</strong> Paste this script right before the closing <code>&lt;/body&gt;</code> tag on your website. If you load it inside an iframe, make sure the iframe allows <code>microphone</code> and the site is served over HTTPS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 shadow-sm">
             <h3 className="text-sm font-bold text-[#191c1d] mb-4 flex items-center gap-2">
               <Monitor size={16} className="text-[#4338ca]" />
               Widget Preview
             </h3>
             <div className="aspect-video bg-[#f3f4f5] rounded-xl border-2 border-dashed border-[#e1e3e4] flex flex-col items-center justify-center text-center p-6 group cursor-pointer hover:bg-[#eef2ff] hover:border-[#4338ca] transition-all">
               <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
               </div>
               <p className="text-sm font-bold text-[#191c1d]">Open Live Preview</p>
               <p className="text-xs text-[#777586] mt-1">See how the widget looks and feels on a live page.</p>
               <button className="mt-4 text-[#4338ca] text-xs font-bold flex items-center gap-1">
                 View in new tab <ExternalLink size={12} />
               </button>
             </div>
          </div>
        </div>

        {/* Instructions Column */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-[#191c1d] rounded-2xl p-6 text-white shadow-xl">
             <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
               <Sparkles size={16} className="text-blue-400" />
               Going Live
             </h3>
             <div className="space-y-6">
                <div className="relative pl-6 border-l border-white/20">
                   <div className="absolute -left-1.5 top-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#191c1d]" />
                   <h4 className="text-xs font-bold mb-1">Add Knowledge</h4>
                   <p className="text-[11px] text-white/60">Ensure your Knowledge Base is populated so the AI can answer accurately.</p>
                </div>
                <div className="relative pl-6 border-l border-white/20">
                   <div className="absolute -left-1.5 top-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#191c1d]" />
                   <h4 className="text-xs font-bold mb-1">Copy Snippet</h4>
                   <p className="text-[11px] text-white/60">Copy the code on the left and paste it into your site's code.</p>
                </div>
                <div className="relative pl-6">
                   <div className="absolute -left-1.5 top-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#191c1d]" />
                   <h4 className="text-xs font-bold mb-1">Test & Chat</h4>
                   <p className="text-[11px] text-white/60">Visit your site and start a conversation. Your agent is now live!</p>
                </div>
             </div>
             <button className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                Launch Live Demo <ArrowRight size={14} />
             </button>
          </div>

          <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6">
             <h3 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-4">Customization</h3>
             <p className="text-xs text-[#777586] leading-relaxed mb-4">Want to change the colors or position of the widget? Customization options are coming soon.</p>
             <div className="flex items-center gap-2 text-[10px] font-bold text-[#4338ca] bg-[#eef2ff] px-2 py-1 rounded w-fit">
               BETA FEATURES
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetTab;
