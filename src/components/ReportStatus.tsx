import React, { useEffect, useState } from "react";
import { getReportStatus } from "../client/api";

export default function ReportStatus({ reportId }: { reportId: string }) {
  const [status, setStatus] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const report = await getReportStatus(reportId);
        setStatus(report.status);
        setFileUrl(report.fileUrl);
      } catch (err: any) {
        setError(err.message || "Failed to load report status");
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();

    // Optional: auto-refresh every 5 sec if PROCESSING
    const interval = setInterval(() => {
      if (status === "PROCESSING") {
        fetchStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [reportId, status]);

  if (loading) return <p>Loading report status...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ marginTop: "8px" }}>
      <strong>Status:</strong> {status}

      {status === "COMPLETED" && fileUrl && (
        <div style={{ marginTop: "4px" }}>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            View Report PDF
          </a>
        </div>
      )}

      {status === "FAILED" && (
        <div style={{ color: "red", marginTop: "4px" }}>Report generation failed.</div>
      )}
    </div>
  );
}
