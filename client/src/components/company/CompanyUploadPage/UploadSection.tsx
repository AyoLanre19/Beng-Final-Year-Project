import { useRef, useState } from "react";
import { uploadFinancialData } from "../../../services/filingService";

export default function UploadSection() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState<{ rowsParsed?: number; transactionsCreated?: number }>({});

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setMessage(file ? `Selected: ${file.name}` : "");
    setError("");
    setStats({});
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please choose a file before uploading.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("Uploading file...");

    try {
      const result = await uploadFinancialData(selectedFile);
      setMessage(result.message || "File uploaded successfully.");
      setStats({
        rowsParsed: result.rowsParsed,
        transactionsCreated: result.transactionsCreated,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setMessage("");
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card glass">
      <div className="upload-header">
        <h4>Upload Financial Data</h4>
        <select defaultValue="Q1 2024">
          <option>Q1 2024</option>
          <option>Q2 2024</option>
          <option>Q3 2024</option>
          <option>Q4 2024</option>
        </select>
      </div>

      <div className="upload-drop">
        <p>Drag and drop files here or choose one from your device.</p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.webp"
          onChange={handleFileChange}
          hidden
        />

        <div className="upload-actions">
          <button type="button" onClick={handlePickFile}>
            Browse Files
          </button>
          <button type="button" className="upload-now-btn" onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload Now"}
          </button>
        </div>
      </div>

      <small>Supports: PDF, CSV, XLSX, XLS, PNG, JPG, JPEG, WEBP</small>

      {message && <p className="upload-message success">{message}</p>}
      {error && <p className="upload-message error">{error}</p>}

      {(stats.rowsParsed !== undefined || stats.transactionsCreated !== undefined) && (
        <div className="upload-stats">
          {stats.rowsParsed !== undefined && <span>Rows parsed: {stats.rowsParsed}</span>}
          {stats.transactionsCreated !== undefined && (
            <span>Transactions created: {stats.transactionsCreated}</span>
          )}
        </div>
      )}
    </div>
  );
}