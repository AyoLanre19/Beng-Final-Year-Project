const documents = [
  {
    id: 1,
    icon: "📄",
    name: "bank_statement_jan_mar.pdf",
    size: "2.4 MB",
  },
  {
    id: 2,
    icon: "📄",
    name: "additional_docs.pdf",
    size: "1.1 MB",
  },
  {
    id: 3,
    icon: "📊",
    name: "transaction_export.csv",
    size: "0.8 MB",
  },
];

export default function SubmittedDocumentsCard() {
  return (
    <section className="filing-card submitted-documents-card">
      <div className="filing-card-title">
        <span className="filing-card-icon">📁</span>
        <h3>Submitted Documents</h3>
      </div>

      <div className="documents-list">
        {documents.map((doc) => (
          <div className="document-row" key={doc.id}>
            <div className="document-meta">
              <span className="document-icon">{doc.icon}</span>

              <div>
                <p className="document-name">{doc.name}</p>
                <span className="document-size">{doc.size}</span>
              </div>
            </div>

            <div className="document-actions">
              <button type="button" className="doc-action-btn secondary">
                View
              </button>
              <button type="button" className="doc-action-btn secondary">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="preview-block">
        <h4>Preview</h4>

        <div className="document-preview-card">
          <div className="preview-paper">
            <div className="preview-paper-header">
              <span className="preview-bank-name">PROVIDUSBANK</span>
              <span className="preview-title">Bank Statement</span>
            </div>

            <div className="preview-lines">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}