import { useState } from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { Save, Upload, Trash2, CheckCircle } from 'lucide-react';
import kbService from '../../services/kb.service';

const STAGES = [
  {
    id: 'general',
    label: 'Business Profile',
    fields: [
      { label: 'Business Name', placeholder: 'e.g., TrendCart' },
      { label: 'Business Type', placeholder: 'e.g., E-commerce / SaaS / Service' },
      { label: 'Support Email', placeholder: 'e.g., support@trendcart.com' },
      { label: 'Support Phone', placeholder: 'e.g., +91-XXXXXXXXXX' },
      { label: 'Working Hours', placeholder: 'e.g., Mon–Fri, 10AM–6PM IST' },
      { label: 'Website / Store URL', placeholder: 'e.g., www.trendcart.com' },
      { label: 'Business Description', placeholder: 'e.g., We sell trendy fashion...', type: 'textarea' },
      { label: 'Social Media Handles', placeholder: 'e.g., @trendcart on Instagram' }
    ]
  },
  {
    id: 'policies',
    label: 'Return & Refund Policy',
    fields: [
      { label: 'Return Policy', placeholder: 'e.g., 7 days from delivery date, unused with original tags. Non-returnable: Innerwear.', type: 'textarea' },
      { label: 'Refund Policy', placeholder: 'e.g., 5-7 business days to original payment method. Free return shipping.', type: 'textarea' }
    ]
  },
  {
    id: 'shipping',
    label: 'Shipping & Delivery',
    allowCsv: true,
    fields: [
      { label: 'Shipping Partners', placeholder: 'e.g., Delhivery, Blue Dart, FedEx' },
      { label: 'Standard Delivery Time', placeholder: 'e.g., 5–7 business days' },
      { label: 'Express Delivery Time', placeholder: 'e.g., 2–3 business days (extra charge)' },
      { label: 'Same-Day / Next-Day Delivery', placeholder: 'e.g., Available in select cities' },
      { label: 'Free Shipping Threshold', placeholder: 'e.g., Orders above ₹999 get free shipping' },
      { label: 'Shipping Charges', placeholder: 'e.g., ₹49 flat fee for orders below ₹999' },
      { label: 'International Shipping', placeholder: 'e.g., Yes/No + countries + timeline' },
      { label: 'Non-Serviceable Areas', placeholder: 'e.g., List of pin codes or regions not covered' },
      { label: 'Tracking Info', placeholder: 'e.g., Tracking link is sent via SMS/email after dispatch' },
      { label: 'Dispatch Cutoff Time', placeholder: 'e.g., Orders placed before 2PM ship same day' }
    ]
  },
  {
    id: 'orders',
    label: 'Order Management Info',
    allowCsv: true,
    fields: [
      { label: 'Order Cancellation Window', placeholder: 'e.g., Orders can be cancelled within 1 hour of placing', type: 'textarea' },
      { label: 'How to Cancel', placeholder: 'e.g., Via dashboard or email to support', type: 'textarea' },
      { label: 'Order Modification Policy', placeholder: 'e.g., Address can be changed before dispatch only', type: 'textarea' },
      { label: 'Out-of-Stock Handling', placeholder: 'e.g., Full refund issued within 3 business days', type: 'textarea' },
      { label: 'Order Confirmation Method', placeholder: 'e.g., Email + SMS confirmation sent immediately', type: 'textarea' },
      { label: 'Invoice / Bill Availability', placeholder: 'e.g., Digital invoice sent via email', type: 'textarea' },
      { label: 'COD (Cash on Delivery) Availability', placeholder: 'e.g., Yes/No + extra charges if any', type: 'textarea' },
      { label: 'Pre-Order Policy', placeholder: 'e.g., Timeline and payment terms for pre-orders', type: 'textarea' }
    ]
  },
  {
    id: 'products',
    label: 'Products & Catalog Info',
    allowCsv: true,
    fields: [
      { label: 'Product Categories', placeholder: 'e.g., Clothing, Footwear, Accessories' },
      { label: 'Available Sizes', placeholder: 'e.g., XS, S, M, L, XL, XXL' },
      { label: 'Size Chart', placeholder: 'e.g., Link or description of size guide' },
      { label: 'Materials / Fabric Info', placeholder: 'e.g., 100% cotton, machine washable' },
      { label: 'Care Instructions', placeholder: 'e.g., Hand wash cold, do not tumble dry' },
      { label: 'Customisation Options', placeholder: 'e.g., Name printing, engraving, etc.' },
      { label: 'Product Warranty', placeholder: 'e.g., 6 months warranty on electronics' },
      { label: 'Authenticity Guarantee', placeholder: 'e.g., All products are 100% original' },
      { label: 'Gift Wrapping', placeholder: 'e.g., Available / Not available + cost' }
    ]
  },
  {
    id: 'payment',
    label: 'Payment Information',
    fields: [
      { label: 'Accepted Payment Methods', placeholder: 'e.g., UPI, Credit/Debit Card, Net Banking, Wallets, COD' },
      { label: 'Accepted Wallets', placeholder: 'e.g., Paytm, PhonePe, Amazon Pay' },
      { label: 'EMI Options', placeholder: 'e.g., EMI available on orders above ₹3000 via select banks' },
      { label: 'Payment Failure Handling', placeholder: 'e.g., Amount auto-refunded in 3–5 business days' },
      { label: 'Currency Accepted', placeholder: 'e.g., INR / USD / Multi-currency' },
      { label: 'Discount / Coupon Usage', placeholder: 'e.g., One coupon per order, cannot be combined' },
      { label: 'Loyalty / Points Program', placeholder: 'e.g., Earn/redeem points info' },
      { label: 'GST / Tax Info', placeholder: 'e.g., 18% GST included in product price' }
    ]
  },
  {
    id: 'customer',
    label: 'Customer Account & Privacy',
    fields: [
      { label: 'Account Creation Required?', placeholder: 'e.g., Yes (for order tracking) / Guest checkout available', type: 'textarea' },
      { label: 'Password Reset Process', placeholder: "e.g., Use 'Forgot Password' on login page", type: 'textarea' },
      { label: 'Data Privacy Policy', placeholder: 'e.g., Link to privacy policy page', type: 'textarea' },
      { label: 'Account Deletion Process', placeholder: 'e.g., Email support to request account deletion', type: 'textarea' },
      { label: 'Newsletter Unsubscribe', placeholder: 'e.g., Click unsubscribe link in any email', type: 'textarea' },
      { label: 'Data Sharing Policy', placeholder: 'e.g., We do not sell your data to third parties', type: 'textarea' }
    ]
  },
  {
    id: 'promotions',
    label: 'Promotions & Offers',
    fields: [
      { label: 'Current Active Offers', placeholder: 'e.g., 20% off sitewide till May 10th' },
      { label: 'Sale Events', placeholder: 'e.g., Annual sale every January & July' },
      { label: 'Referral Program', placeholder: 'e.g., Refer a friend, get ₹100 credit each' },
      { label: 'Student / Special Discounts', placeholder: 'e.g., Eligibility and process' },
      { label: 'Coupon Stacking Policy', placeholder: 'e.g., Only one coupon per order' },
      { label: 'Price Match Policy', placeholder: 'e.g., Yes/No' }
    ]
  },
  {
    id: 'escalation',
    label: 'Support Escalation Rules',
    fields: [
      {
        label: 'Escalation Rules',
        placeholder: 'e.g., 🎫 Create a ticket when:\n- Customer reports damaged/wrong item\n- Legal complaints or fraud reports\n- Refund not received after 10+ days\n- Order not found in system\n- AI confidence is low on any answer',
        type: 'textarea',
        rows: 10
      }
    ]
  },
  {
    id: 'saved_data',
    label: 'Saved Data',
    customComponent: true
  }
];

const KnowledgeBaseTab = ({ tenantId }) => {
  const [activeStage, setActiveStage] = useState(STAGES[0].id);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { kbItems, kbLoading, fetchKbItems, deleteKbItem } = useDashboardStore();

  const handleInputChange = (fieldLabel, value) => {
    setFormData(prev => ({ ...prev, [fieldLabel]: value }));
  };

  const handleSaveStage = async (stage) => {
    const fieldsToSave = stage.fields.filter(f => formData[f.label]?.trim());
    if (fieldsToSave.length === 0) return;

    setSaving(true);
    try {
      await Promise.all(
        fieldsToSave.map(field => 
          kbService.addKnowledgeBaseItem(tenantId, {
            type: 'faq',
            title: stage.label,
            question: field.label,
            answer: formData[field.label],
            content: formData[field.label],
            tags: [stage.id, 'profile']
          })
        )
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      fetchKbItems(tenantId);
      
      // Clear saved fields from local form state to show they're processed
      setFormData(prev => {
        const next = { ...prev };
        fieldsToSave.forEach(f => delete next[f.label]);
        return next;
      });
    } catch (e) {
      console.error('Failed to save', e);
      alert('Failed to save some items');
    } finally {
      setSaving(false);
    }
  };

  const activeStageData = STAGES.find(s => s.id === activeStage);

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar Stages */}
      <div className="w-64 bg-white border border-[#e1e3e4] rounded-lg flex flex-col flex-shrink-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e1e3e4] bg-[#f8f9fa]">
          <h2 className="text-sm font-semibold text-[#191c1d]">Business Profile Setup</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {STAGES.map(stage => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                activeStage === stage.id
                  ? 'bg-[#eef2ff] text-[#4338ca] font-medium'
                  : 'text-[#464554] hover:bg-[#f3f4f5]'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white border border-[#e1e3e4] rounded-lg flex flex-col overflow-hidden max-w-4xl">
        <div className="px-6 py-4 border-b border-[#e1e3e4] flex items-center justify-between bg-white flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-[#191c1d]">{activeStageData?.label}</h2>
            <p className="text-xs text-[#777586] mt-1">Fill in the details to train your AI support agent.</p>
          </div>
          <div className="flex items-center gap-3">
            {activeStageData?.allowCsv && (
               <label className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e1e3e4] hover:bg-[#f3f4f5] text-[#191c1d] text-sm font-medium rounded-md transition-colors cursor-pointer">
                 <Upload size={15} />
                 <span>Import CSV</span>
                 <input type="file" accept=".csv" className="hidden" onChange={(e) => {
                   if(e.target.files?.length) alert('CSV Upload functionality to be implemented for ' + activeStageData.label);
                 }} />
               </label>
            )}
            {!activeStageData?.customComponent && (
              <button 
                onClick={() => handleSaveStage(activeStageData)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <>Saving...</>
                ) : saveSuccess ? (
                  <><CheckCircle size={15} /> Saved</>
                ) : (
                  <><Save size={15} /> Save Changes</>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeStageData?.id === 'saved_data' ? (
             <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#191c1d]">Existing Knowledge Base</h3>
                {kbLoading ? (
                  <div className="text-sm text-[#777586]">Loading...</div>
                ) : kbItems.length === 0 ? (
                  <div className="text-sm text-[#777586] text-center py-8">No knowledge base items yet. Start filling out the stages!</div>
                ) : (
                  <div className="space-y-2">
                    {kbItems.map(item => (
                      <div key={item._id} className="flex items-start justify-between gap-3 p-3 border border-[#e1e3e4] rounded-md hover:bg-[#f8f9fa] transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[#191c1d] truncate">{item.title}</span>
                            <span className="text-[10px] font-medium bg-[#eef2ff] text-[#4338ca] px-1.5 py-0.5 rounded uppercase flex-shrink-0">{item.type}</span>
                          </div>
                          {item.question && <p className="text-xs text-[#464554] truncate"><span className="font-medium">Q:</span> {item.question}</p>}
                          <p className="text-xs text-[#777586] truncate">{item.answer || item.content?.substring(0, 100)}</p>
                        </div>
                        <button onClick={() => deleteKbItem(tenantId, item._id)}
                          className="p-1.5 text-[#777586] hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded transition-colors flex-shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {activeStageData?.fields?.map(field => (
                <div key={field.label} className={field.type === 'textarea' ? 'col-span-1 md:col-span-2' : ''}>
                  <label className="block text-xs font-medium text-[#464554] mb-1.5">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      value={formData[field.label] || ''}
                      onChange={e => handleInputChange(field.label, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows || 3}
                      className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] transition-colors resize-y"
                    />
                  ) : (
                    <input 
                      type="text"
                      value={formData[field.label] || ''}
                      onChange={e => handleInputChange(field.label, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseTab;
