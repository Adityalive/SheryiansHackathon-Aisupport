import { useEffect, useMemo, useState } from "react";
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
  Save,
} from "lucide-react";

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

const FIELD_PLACEHOLDERS = {
  "Business Name": "Enter your business name",
  "Business Type": "e.g., E-commerce, SaaS, Service",
  "Support Email": "support@example.com",
  "Support Phone": "+91-XXXXXXXXXX",
  "Working Hours": "e.g., Mon-Fri, 10 AM - 6 PM IST",
  "Website / Store URL": "https://example.com",
  "Business Description": "Tell customers what your business does",
  "Social Media Handles": "@yourbrand on Instagram",
};

const ProfileTab = ({ user, tenant, tenantId }) => {
  const { kbItems, kbLoading, fetchKbItems, saveBusinessProfile, formStatus } =
    useDashboardStore();
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => {
    if (tenantId) {
      fetchKbItems(tenantId);
    }
  }, [tenantId, fetchKbItems]);

  const profileData = useMemo(() => {
    return kbItems
      .filter(
        (item) =>
          PROFILE_FIELDS.includes(item.title) ||
          PROFILE_FIELDS.includes(item.question),
      )
      .reduce((acc, item) => {
        const key = PROFILE_FIELDS.includes(item.title)
          ? item.title
          : item.question;

        if (!acc[key]) {
          acc[key] = item.content || item.answer || "";
        }
        return acc;
      }, {});
  }, [kbItems]);

  useEffect(() => {
    setProfileForm((prev) => ({
      ...PROFILE_FIELDS.reduce((acc, field) => {
        acc[field] = prev[field] ?? profileData[field] ?? "";
        return acc;
      }, {}),
    }));
  }, [profileData]);

  const updateField = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!tenantId) return;
    await saveBusinessProfile(tenantId, profileForm);
  };

  return (
    <div className="max-w-4xl space-y-5">
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

        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[#191c1d]">
                Business Profile
              </h2>
              <p className="text-sm text-[#777586] mt-1">
                Type your business details here and save them into the knowledge
                base.
              </p>
            </div>

            <button
              type="submit"
              disabled={formStatus.loading || !tenantId}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60"
            >
              <Save size={15} />
              {formStatus.loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {formStatus.error && (
            <div className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-md">
              {formStatus.error}
            </div>
          )}

          {formStatus.success && (
            <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
              {formStatus.success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {PROFILE_FIELDS.filter((f) => f !== "Business Description").map(
              (field) => {
                const Icon = FIELD_ICONS[field];
                const value = profileForm[field] ?? "";
                return (
                  <div
                    key={field}
                    className="flex items-start gap-3 py-3 border-b border-[#f3f4f5] last:border-0"
                  >
                    <div className="w-7 h-7 bg-[#f3f4f5] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={13} className="text-[#464554]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="block text-[10px] font-medium text-[#777586] uppercase tracking-wide mb-1">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateField(field, e.target.value)}
                        placeholder={FIELD_PLACEHOLDERS[field]}
                        className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#b0afc0] focus:outline-none focus:border-[#4338ca]"
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>

          <div className="flex items-start gap-3 pt-1">
            <div className="w-7 h-7 bg-[#f3f4f5] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText size={13} className="text-[#464554]" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-[#777586] uppercase tracking-wide mb-1">
                Business Description
              </label>
              <textarea
                value={profileForm["Business Description"] || ""}
                onChange={(e) =>
                  updateField("Business Description", e.target.value)
                }
                placeholder={FIELD_PLACEHOLDERS["Business Description"]}
                rows={4}
                className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#b0afc0] focus:outline-none focus:border-[#4338ca] resize-y"
              />
            </div>
          </div>
        </form>
      </div>

      {!kbLoading && Object.keys(profileData).length === 0 && (
        <p className="text-xs text-[#777586] text-center">
          No business profile data yet. Fill in the fields above and save them
          to the knowledge base.
        </p>
      )}
    </div>
  );
};

export default ProfileTab;
