const ProfileTab = ({ user, tenant }) => (
  <div className="max-w-2xl">
    <div className="bg-white border border-[#e1e3e4] rounded-lg p-6">
      <h2 className="text-base font-semibold text-[#191c1d] mb-5">Business Profile</h2>

      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#f3f4f5]">
        <div className="w-14 h-14 bg-[#4338ca] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-semibold text-[#191c1d]">{user?.name}</div>
          <span className="inline-block mt-1 text-xs font-medium bg-[#eef2ff] text-[#4338ca] px-2 py-0.5 rounded">
            {user?.accountType}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Business Name', value: tenant?.name },
          { label: 'Business ID (Slug)', value: tenant?.slug, mono: true },
          { label: 'Email Address', value: user?.email },
          { label: 'Subscription Plan', value: user?.subscriptionLevel },
        ].map(({ label, value, mono }) => (
          <div key={label} className="flex items-center justify-between py-3 border-b border-[#f3f4f5] last:border-0">
            <span className="text-xs font-medium text-[#777586] uppercase tracking-wide">{label}</span>
            {mono
              ? <code className="text-sm text-[#4338ca] bg-[#eef2ff] px-2 py-0.5 rounded">{value}</code>
              : <span className="text-sm text-[#191c1d] capitalize">{value}</span>
            }
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProfileTab;
