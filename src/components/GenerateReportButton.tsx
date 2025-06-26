import React, { useState } from "react";
import { generateReport } from "../client/api";

export default function GenerateReportButton({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    console.log("Generating report for documentId:", documentId);



    try {
      await generateReport({ documentId });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error generating report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "8px" }}>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Generating..." : "Generate Report"}
      </button>

      {success && <div style={{ color: "green", marginTop: "4px" }}>Report generation started!</div>}
      {error && <div style={{ color: "red", marginTop: "4px" }}>{error}</div>}
    </div>
  );
}
