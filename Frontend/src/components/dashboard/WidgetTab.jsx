import { useState } from "react";
import { Copy, Check } from "lucide-react";

const WidgetTab = ({ tenantId, tenantSlug }) => {
  const [copied, setCopied] = useState(false);
  const [snippetCopied, setSnippetCopied] = useState(false);

  const scriptSnippet = `<script
  src="http://localhost:3000/public/widget.js"
  data-business-id="${tenantId || 'default-tenant'}">
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
    <div className="max-w-2xl space-y-4">
      <div className="bg-white border border-[#e1e3e4] rounded-lg p-6">
        <h2 className="text-base font-semibold text-[#191c1d] mb-1">
          Widget Configuration
        </h2>
        <p className="text-sm text-[#777586] mb-5">
          Embed the AI chat widget on your website using your Tenant ID below.
        </p>

        <div className="mb-5">
          <label className="block text-xs font-medium text-[#464554] uppercase tracking-wide mb-2">
            Your Tenant ID
          </label>
          <div className="flex items-center gap-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md px-3 py-2.5">
            <code className="flex-1 text-sm text-[#4338ca] font-medium truncate">
              {tenantId}
            </code>
            <button
              onClick={() => copy(tenantId)}
              className="flex items-center gap-1.5 text-xs text-[#464554] hover:text-[#191c1d] transition-colors flex-shrink-0"
            >
              {copied ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#464554] uppercase tracking-wide mb-2">
            Embed Snippet
          </label>
          <div className="relative group">
            <div className="bg-[#191c1d] text-[#c3c0ff] rounded-md p-4 font-mono text-xs leading-relaxed whitespace-pre overflow-x-auto">
              {scriptSnippet}
            </div>
            <button
              onClick={copySnippet}
              className="absolute top-3 right-3 p-1.5 bg-[#30363d] hover:bg-[#4338ca] text-[#e1e3e4] hover:text-white rounded transition-colors"
              title="Copy snippet"
            >
              {snippetCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-xs text-[#777586] mt-2">
            Paste this anywhere in the <code className="bg-[#f3f4f5] px-1 rounded">&lt;body&gt;</code> tag of your website.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WidgetTab;
