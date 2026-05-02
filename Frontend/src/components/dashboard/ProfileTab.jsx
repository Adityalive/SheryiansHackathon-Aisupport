import { useEffect } from "react";
import { useDashboardStore } from "../../store/useDashboardStore";
import {
  Building2,
  Mail,
  Phone,
  Clock,
  Globe,
  FileText,
  Share2,
  Tag,
} from "lucide-react";

// Fields that belong to the Business Profile (general) stage
const PROFILE_FIELDS = [
  "Business Name",
  "Business Type",
  "Support Email",
  "Support Phone",
  "Working Hours",
  "Website / Store URL",
  "Business Description",
  "Social Media Handles",
];

const FIELD_ICONS = {
  "Business Name": Building2,
  "Business Type": Tag,
  "Support Email": Mail,
  "Support Phone": Phone,
  "Working Hours": Clock,
  "Website / Store URL": Globe,
  "Business Description": FileText,
  "Social Media Handles": Share2,
};

const ProfileTab = ({ user, tenant, tenantId }) => {
  const { kbItems, kbLoading, fetchKbItems } = useDashboardStore();

  useEffect(() => {
    if (tenantId) fetchKbItems(tenantId);
  }, [tenantId, fetchKbItems]);

  // Pull only the Business Profile KB items and build a lookup map
  const profileData = kbItems
    .filter((item) => PROFILE_FIELDS.includes(item.title))
    .reduce(
      (acc, item) => ({ ...acc, [item.title]: item.content || item.answer }),
      {},
    );

  return (
    <div className="max-w-3xl space-y-5">
      {/* Account Card */}
      <div className="bg-white border border-[#e1e3e4] rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#f3f4f5]">
          <div className="w-14 h-14 bg-[#4338ca] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-[#191c1d]">
              {user?.name}
            </div>
            <div className="text-xs text-[#777586] mt-0.5">{user?.email}</div>
            <span className="inline-block mt-1.5 text-xs font-medium bg-[#eef2ff] text-[#4338ca] px-2 py-0.5 rounded">
              {user?.accountType}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
          {PROFILE_FIELDS.filter((f) => f !== "Business Description").map(
            (field) => {
              const Icon = FIELD_ICONS[field];
              const value = profileData[field];
              return (
                <div
                  key={field}
                  className="flex items-start gap-3 py-3 border-b border-[#f3f4f5] last:border-0"
                >
                  <div className="w-7 h-7 bg-[#f3f4f5] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={13} className="text-[#464554]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium text-[#777586] uppercase tracking-wide mb-0.5">
                      {field}
                    </div>
                    {kbLoading ? (
                      <div className="h-3.5 bg-[#f3f4f5] rounded w-28 animate-pulse" />
                    ) : value ? (
                      <div className="text-sm text-[#191c1d] break-words">
                        {value}
                      </div>
                    ) : (
                      <div className="text-sm text-[#b0afc0] italic">
                        Not set
                      </div>
                    )}
                  </div>
                </div>
              );
            },
          )}
        </div>

        {/* Business Description — full width */}
        {(() => {
          const Icon = FIELD_ICONS["Business Description"];
          const value = profileData["Business Description"];
          return (
            <div className="flex items-start gap-3 pt-3">
              <div className="w-7 h-7 bg-[#f3f4f5] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={13} className="text-[#464554]" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-medium text-[#777586] uppercase tracking-wide mb-1">
                  Business Description
                </div>
                {kbLoading ? (
                  <div className="space-y-1.5">
                    <div className="h-3.5 bg-[#f3f4f5] rounded w-full animate-pulse" />
                    <div className="h-3.5 bg-[#f3f4f5] rounded w-3/4 animate-pulse" />
                  </div>
                ) : value ? (
                  <p className="text-sm text-[#191c1d] leading-relaxed whitespace-pre-wrap">
                    {value}
                  </p>
                ) : (
                  <p className="text-sm text-[#b0afc0] italic">
                    Not set — add it in the Knowledge Base → Business Profile
                    tab.
                  </p>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Quick hint if nothing is set */}
      {!kbLoading && Object.keys(profileData).length === 0 && (
        <p className="text-xs text-[#777586] text-center">
          No business profile data yet.{" "}
          <span className="text-[#4338ca] font-medium">
            Go to Knowledge Base → Business Profile
          </span>{" "}
          to fill in your details.
        </p>
      )}
    </div>
  );
};

export default ProfileTab;
