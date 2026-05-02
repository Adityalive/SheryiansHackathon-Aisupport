import { useDashboardStore } from '../../store/useDashboardStore';
import { HelpCircle, FileText, Plus, Trash2 } from 'lucide-react';

const KnowledgeBaseTab = ({ tenantId }) => {
  const {
    kbItems, kbLoading, kbTab, setKbTab,
    faqForm, setFaqForm, pdfForm, setPdfForm,
    formStatus, addFaq, addDocument, deleteKbItem,
  } = useDashboardStore();

  const handleAddFaq = (e) => { e.preventDefault(); addFaq(tenantId); };
  const handleAddPdf = (e) => { e.preventDefault(); addDocument(tenantId); };

  return (
    <div className="max-w-3xl space-y-5">
      {/* Form card */}
      <div className="bg-white border border-[#e1e3e4] rounded-lg p-6">
        <h2 className="text-base font-semibold text-[#191c1d] mb-4">Add to Knowledge Base</h2>

        {/* Sub-tabs */}
        <div className="flex gap-1 bg-[#f3f4f5] rounded-md p-1 w-fit mb-5">
          {[
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'pdf', label: 'Document', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setKbTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                kbTab === id ? 'bg-white text-[#191c1d] shadow-sm' : 'text-[#777586] hover:text-[#464554]'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {formStatus.error && (
          <div className="mb-4 px-3 py-2 bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-md text-sm text-[#93000a]">
            {formStatus.error}
          </div>
        )}
        {formStatus.success && (
          <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
            {formStatus.success}
          </div>
        )}

        {kbTab === 'faq' ? (
          <form onSubmit={handleAddFaq} className="space-y-3">
            {[
              { label: 'Category / Title', key: 'title', placeholder: 'e.g. Shipping' },
              { label: 'Question', key: 'question', placeholder: 'e.g. How long does shipping take?' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-[#464554] mb-1">{label}</label>
                <input required value={faqForm[key]} onChange={e => setFaqForm({ ...faqForm, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] transition-colors" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-[#464554] mb-1">Answer</label>
              <textarea required rows={3} value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })}
                placeholder="e.g. 3-5 business days."
                className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#464554] mb-1">Tags (comma separated)</label>
              <input value={faqForm.tags} onChange={e => setFaqForm({ ...faqForm, tags: e.target.value })}
                placeholder="e.g. shipping, policy"
                className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] transition-colors" />
            </div>
            <button type="submit" disabled={formStatus.loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60">
              <Plus size={15} />
              {formStatus.loading ? 'Adding...' : 'Add FAQ'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddPdf} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#464554] mb-1">Document Title</label>
              <input required value={pdfForm.title} onChange={e => setPdfForm({ ...pdfForm, title: e.target.value })}
                placeholder="e.g. Refund Policy 2024"
                className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#464554] mb-1">Document Text</label>
              <textarea required rows={5} value={pdfForm.content} onChange={e => setPdfForm({ ...pdfForm, content: e.target.value })}
                placeholder="Paste document content here..."
                className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#464554] mb-1">Tags (comma separated)</label>
              <input value={pdfForm.tags} onChange={e => setPdfForm({ ...pdfForm, tags: e.target.value })}
                placeholder="e.g. policy, returns"
                className="w-full px-3 py-2 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] transition-colors" />
            </div>
            <button type="submit" disabled={formStatus.loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60">
              <Plus size={15} />
              {formStatus.loading ? 'Adding...' : 'Add Document'}
            </button>
          </form>
        )}
      </div>

      {/* Existing items */}
      <div className="bg-white border border-[#e1e3e4] rounded-lg p-6">
        <h2 className="text-base font-semibold text-[#191c1d] mb-4">Existing Knowledge Base</h2>
        {kbLoading ? (
          <div className="text-sm text-[#777586] py-4">Loading...</div>
        ) : kbItems.length === 0 ? (
          <div className="text-sm text-[#777586] text-center py-8">No knowledge base items yet. Add your first FAQ or document above.</div>
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
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.tags.map(t => (
                        <span key={t} className="text-[10px] bg-[#f3f4f5] text-[#464554] px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  )}
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
    </div>
  );
};

export default KnowledgeBaseTab;
