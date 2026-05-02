import { useState } from 'react';
import { PhoneCall, Copy, Check } from 'lucide-react';

const VoiceTab = ({ tenantSlug }) => {
  const [copied, setCopied] = useState(false);
  const webhookUrl = `https://curvy-jobs-clean.loca.lt/api/voice/twilio/incoming?tenantId=${tenantSlug || 'default-tenant'}`;

  const copy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-4">
      {/* Header card */}
      <div className="bg-white border border-[#e1e3e4] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#eef2ff] rounded-lg flex items-center justify-center">
            <PhoneCall size={20} className="text-[#4338ca]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#191c1d]">Voice & Phone Configuration</h2>
            <p className="text-sm text-[#777586]">Manage your AI voice agent and Twilio integration</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Phone number */}
          <div>
            <label className="block text-xs font-medium text-[#464554] uppercase tracking-wide mb-2">Incoming Phone Number</label>
            <div className="flex items-center justify-between bg-[#f3f4f5] border border-[#e1e3e4] rounded-md px-4 py-3">
              <span className="text-sm text-[#191c1d]">+1 (XXX) XXX-XXXX</span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Connected</span>
            </div>
          </div>

          {/* Webhook URL */}
          <div>
            <label className="block text-xs font-medium text-[#464554] uppercase tracking-wide mb-1">Voice Webhook URL</label>
            <p className="text-xs text-[#777586] mb-2">Paste this URL into your Twilio Console under "A Call Comes In"</p>
            <div className="flex items-center gap-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md px-3 py-2.5">
              <input readOnly value={webhookUrl}
                className="flex-1 text-xs text-[#464554] bg-transparent outline-none truncate" />
              <button onClick={copy}
                className="flex items-center gap-1 text-xs text-[#464554] hover:text-[#191c1d] transition-colors flex-shrink-0">
                {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Voice persona */}
          <div>
            <label className="block text-xs font-medium text-[#464554] uppercase tracking-wide mb-2">AI Voice Persona</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-[#4338ca] rounded-md p-3 bg-[#eef2ff]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#191c1d]">Polly Joanna</span>
                  <Check size={14} className="text-[#4338ca]" />
                </div>
                <p className="text-xs text-[#777586]">Female • Natural US English</p>
              </div>
              <div className="border border-[#e1e3e4] rounded-md p-3 hover:bg-[#f3f4f5] cursor-pointer transition-colors"
                onClick={() => alert('ElevenLabs integration coming soon!')}>
                <span className="text-sm font-medium text-[#191c1d]">ElevenLabs Premium</span>
                <p className="text-xs text-[#777586] mt-1">Human-like • Custom Voices</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Voice Calls Today', value: '0' },
          { label: 'AI Resolution Rate', value: '0%' },
          { label: 'Avg. Call Duration', value: '0m 0s' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-[#e1e3e4] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#191c1d]">{value}</div>
            <div className="text-xs text-[#777586] mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceTab;
