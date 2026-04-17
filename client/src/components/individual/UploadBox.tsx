import Papa from "papaparse";
import type { Transaction } from "./ClassificationTable";

export default function UploadBox({
  setTransactions,
}: {
  setTransactions: (transactions: Transaction[]) => void;
}) {
  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (result: { data: Array<Record<string, string>> }) => {
        const rows = result.data
          .filter((row) => row.Date || row.Description || row.Amount)
          .map((row) => ({
            date: row.Date || "",
            description: row.Description || "",
            amount: Number(row.Amount || 0),
            category: "Unknown",
          }));

        setTransactions(rows);
      },
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      parseCSV(file);
    }
  };

  return (
    <div
      style={{
        border: "2px dashed #ccc",
        padding: "40px",
        borderRadius: "10px",
        marginTop: "20px",
      }}
    >
      <h3>Upload Bank Statement</h3>

      <input type="file" onChange={handleFile} />

      <p>Supports: PDF, CSV</p>
    </div>
  );
}