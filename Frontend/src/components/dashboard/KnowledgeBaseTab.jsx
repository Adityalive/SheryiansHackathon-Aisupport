import { useEffect } from "react";
import { CheckCircle, Trash2, Plus, Upload } from "lucide-react";
import { useDashboardStore } from "../../store/useDashboardStore";

const KnowledgeBaseTab = ({ tenantId }) => {
  const {
    kbItems,
    kbLoading,
    kbTab,
    faqForm,
    pdfForm,
    formStatus,
    fetchKbItems,
    addFaq,
    addDocument,
    deleteKbItem,
    setFaqForm,
    setPdfForm,
    setKbTab,
  } = useDashboardStore();

  useEffect(() => {
    if (tenantId) {
      fetchKbItems(tenantId);
    }
  }, [tenantId, fetchKbItems]);

  const updateFaqField = (field, value) => {
    setFaqForm({ ...faqForm, [field]: value });
  };

  const updateDocField = (field, value) => {
    setPdfForm({ ...pdfForm, [field]: value });
  };

  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    if (!tenantId) return;
    await addFaq(tenantId);
  };

  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!tenantId) return;
    await addDocument(tenantId);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      const text = await file.text();
      setPdfForm({
        ...pdfForm,
        title: pdfForm.title || file.name.replace(/\.[^.]+$/, ""),
        content: text,
      });
    } catch (error) {
      console.error("Failed to read document", error);
      alert("Could not read that file. Please paste the document text manually.");
    }
  };

  const kbList = kbItems || [];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="bg-white border border-[#e1e3e4] rounded-lg p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#191c1d]">
              Knowledge Base
            </h2>
            <p className="text-sm text-[#777586] mt-1">
              Add FAQs or upload document content for the AI to learn from.
            </p>
          </div>
          {formStatus.success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
              <CheckCircle size={15} />
              {formStatus.success}
            </div>
          )}
        </div>

        <div className="inline-flex rounded-md border border-[#e1e3e4] bg-[#f8f9fa] p-1 mb-6">
          <button
            type="button"
            onClick={() => setKbTab("faq")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              kbTab === "faq"
                ? "bg-white text-[#4338ca] shadow-sm"
                : "text-[#464554] hover:text-[#191c1d]"
            }`}
          >
            FAQ
          </button>
          <button
            type="button"
            onClick={() => setKbTab("document")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              kbTab === "document"
                ? "bg-white text-[#4338ca] shadow-sm"
                : "text-[#464554] hover:text-[#191c1d]"
            }`}
          >
            Document Upload
          </button>
        </div>

        {kbTab === "faq" ? (
          <form onSubmit={handleFaqSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#464554] mb-1.5">
                  FAQ Title
                </label>
                <input
                  type="text"
                  value={faqForm.title}
                  onChange={(e) => updateFaqField("title", e.target.value)}
                  placeholder="e.g., Refund Policy"
                  className="w-full px-3 py-2.5 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#464554] mb-1.5">
                  Tags
                </label>
                <input
                  type="text"
                  value={faqForm.tags}
                  onChange={(e) => updateFaqField("tags", e.target.value)}
                  placeholder="e.g., refund, shipping, payment"
                  className="w-full px-3 py-2.5 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#464554] mb-1.5">
                Question
              </label>
              <input
                type="text"
                value={faqForm.question}
                onChange={(e) => updateFaqField("question", e.target.value)}
                placeholder="e.g., How long does a refund take?"
                className="w-full px-3 py-2.5 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#464554] mb-1.5">
                Answer
              </label>
              <textarea
                value={faqForm.answer}
                onChange={(e) => updateFaqField("answer", e.target.value)}
                placeholder="Write the answer customers should see."
                rows={4}
                className="w-full px-3 py-2.5 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] resize-y"
              />
            </div>

            {formStatus.error && (
              <div className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-md">
                {formStatus.error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={formStatus.loading || !tenantId}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60"
              >
                <Plus size={15} />
                {formStatus.loading ? "Saving..." : "Add FAQ"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleDocSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#464554] mb-1.5">
                  Document Title
                </label>
                <input
                  type="text"
                  value={pdfForm.title}
                  onChange={(e) => updateDocField("title", e.target.value)}
                  placeholder="e.g., Return Policy Document"
                  className="w-full px-3 py-2.5 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#464554] mb-1.5">
                  Tags
                </label>
                <input
                  type="text"
                  value={pdfForm.tags}
                  onChange={(e) => updateDocField("tags", e.target.value)}
                  placeholder="e.g., policies, shipping, faq"
                  className="w-full px-3 py-2.5 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#464554] mb-1.5">
                Upload Document
              </label>
              <label className="flex items-center gap-2 px-4 py-3 bg-[#f3f4f5] border border-dashed border-[#cfd3d7] rounded-md text-sm text-[#464554] cursor-pointer hover:border-[#4338ca]">
                <Upload size={15} />
                <span>Choose a text file to import</span>
                <input
                  type="file"
                  accept=".txt,.md,.json,.html,.htm,.csv,.xml"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                />
              </label>
              <p className="text-xs text-[#777586] mt-2">
                For now, the upload pulls in plain text from the file. You can
                also paste content below.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#464554] mb-1.5">
                Document Content
              </label>
              <textarea
                value={pdfForm.content}
                onChange={(e) => updateDocField("content", e.target.value)}
                placeholder="Paste the document text here if you are not uploading a file."
                rows={8}
                className="w-full px-3 py-2.5 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] resize-y"
              />
            </div>

            {formStatus.error && (
              <div className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-md">
                {formStatus.error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={formStatus.loading || !tenantId}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#4338ca] hover:bg-[#3730a3] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60"
              >
                <Plus size={15} />
                {formStatus.loading ? "Saving..." : "Add Document"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white border border-[#e1e3e4] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#191c1d]">
              Existing Items
            </h3>
            <p className="text-sm text-[#777586]">
              Manage FAQs and uploaded documents.
            </p>
          </div>
          <span className="text-xs text-[#464554] bg-[#f3f4f5] px-2 py-1 rounded-full">
            {kbList.length} items
          </span>
        </div>

        {kbLoading ? (
          <div className="text-sm text-[#777586]">Loading knowledge base...</div>
        ) : kbList.length === 0 ? (
          <div className="text-sm text-[#777586] text-center py-10 border border-dashed border-[#e1e3e4] rounded-md">
            No knowledge base items yet. Add your first FAQ or document above.
          </div>
        ) : (
          <div className="space-y-3">
            {kbList.map((item) => (
              <div
                key={item._id}
                className="flex items-start justify-between gap-4 p-4 border border-[#e1e3e4] rounded-md"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-[#191c1d]">
                      {item.title || "Untitled"}
                    </span>
                    <span className="text-[10px] font-medium bg-[#eef2ff] text-[#4338ca] px-1.5 py-0.5 rounded uppercase">
                      {item.type}
                    </span>
                    {item.tags?.length ? (
                      <span className="text-[10px] font-medium bg-[#f3f4f5] text-[#464554] px-1.5 py-0.5 rounded uppercase">
                        {item.tags[0]}
                      </span>
                    ) : null}
                  </div>
                  {item.question && (
                    <p className="text-sm text-[#464554]">
                      <span className="font-medium">Q:</span> {item.question}
                    </p>
                  )}
                  <p className="text-sm text-[#777586] mt-1">
                    {item.answer || item.content}
                  </p>
                </div>

                <button
                  onClick={() => deleteKbItem(tenantId, item._id)}
                  className="p-2 text-[#777586] hover:text-[#ba1a1a] hover:bg-[#ffdad6] rounded transition-colors flex-shrink-0"
                  title="Delete item"
                >
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
