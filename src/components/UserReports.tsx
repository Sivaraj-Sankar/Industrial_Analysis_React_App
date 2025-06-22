import React, { useEffect, useState } from "react";
import { getUserReports } from "../client/api";
import ReactMarkdown from "react-markdown";

type Report = {
  id: string;
  status: string;
  content: string;
  fileUrl: string | null;
  createdAt: string;
  document: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
  };
};

export default function UserReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await getUserReports();
        setReports(data);
      } catch (err: any) {
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", marginTop: "24px" }}>
      <h2>Your Reports</h2>

      {loading && <p>Loading reports...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && reports.length === 0 && <p>No reports generated yet.</p>}

      {!loading && reports.length > 0 && (
        <ul>
          {reports.map((report) => (
            <li key={report.id} style={{ marginBottom: "16px" }}>
              <strong>Document:</strong> {report.document.fileName} ({report.document.fileType}) <br />
              <a href={report.document.fileUrl} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
              <br />
              <strong>Report Status:</strong> {report.status} <br />
              Created At: {new Date(report.createdAt).toLocaleString()} <br />
              {report.status === "COMPLETED" && report.fileUrl && (
                <>
                  <div style={{ marginTop: "4px" }}>
                    <a href={report.fileUrl!} target="_blank" rel="noopener noreferrer">
                      View Report PDF
                    </a>
                  </div>
                  <button
                    onClick={() =>
                      setPreviewId(previewId === report.id ? null : report.id)
                    }
                    style={{ marginTop: "8px" }}
                  >
                    {previewId === report.id ? "Hide Preview" : "Show Preview"}
                  </button>

                  {previewId === report.id && (
                    <div
                      style={{
                        border: "1px solid #999",
                        padding: "12px",
                        marginTop: "12px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <ReactMarkdown>{report.content}</ReactMarkdown>
                    </div>
                  )}
                </>
              )}
              {report.status === "FAILED" && (
                <div style={{ color: "red" }}>Report generation failed.</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}