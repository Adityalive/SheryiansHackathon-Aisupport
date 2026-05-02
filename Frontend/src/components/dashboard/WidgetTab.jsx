import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const WidgetTab = ({ tenantId, tenantSlug }) => {
  const [copied, setCopied] = useState(false);

  const webhookSnippet = `<SupportProvider tenantId="${tenantId}">
  {/* Your app */}
</SupportProvider>`;

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="bg-white border border-[#e1e3e4] rounded-lg p-6">
        <h2 className="text-base font-semibold text-[#191c1d] mb-1">Widget Configuration</h2>
        <p className="text-sm text-[#777586] mb-5">Embed the AI chat widget on your website using your Tenant ID below.</p>

        <div className="mb-5">
          <label className="block text-xs font-medium text-[#464554] uppercase tracking-wide mb-2">Your Tenant ID</label>
          <div className="flex items-center gap-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md px-3 py-2.5">
            <code className="flex-1 text-sm text-[#4338ca] font-medium truncate">{tenantId}</code>
            <button
              onClick={() => copy(tenantId)}
              className="flex items-center gap-1.5 text-xs text-[#464554] hover:text-[#191c1d] transition-colors flex-shrink-0"
            >
              {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#464554] uppercase tracking-wide mb-2">Embed Snippet</label>
          <div className="bg-[#191c1d] text-[#c3c0ff] rounded-md p-4 font-mono text-xs leading-relaxed whitespace-pre">
            {webhookSnippet}
          </div>
          <p className="text-xs text-[#777586] mt-2">
            Pass this Tenant ID to your <code className="bg-[#f3f4f5] px-1 rounded">SupportProvider</code> component.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WidgetTab;
