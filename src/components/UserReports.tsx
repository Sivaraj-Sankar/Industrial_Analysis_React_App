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
        <>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Document Name</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>PDF</th>
                  <th style={thStyle}>Preview</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td style={tdStyle}>
                      <a
                        href={report.document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {report.document.fileName}
                      </a>
                    </td>
                    <td style={tdStyle}>{report.document.fileType}</td>
                    <td style={tdStyle}>{new Date(report.createdAt).toLocaleString()}</td>
                    <td style={tdStyle}>
                      {report.status === "FAILED" ? (
                        <span style={{ color: "red" }}>Failed</span>
                      ) : (
                        report.status
                      )}
                    </td>
                    <td style={tdStyle}>
                      {report.status === "COMPLETED" && report.fileUrl ? (
                        <a
                          href={report.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td style={tdStyle}>
                      {report.status === "COMPLETED" ? (
                        <button
                          onClick={() =>
                            setPreviewId(previewId === report.id ? null : report.id)
                          }
                        >
                          {previewId === report.id ? "Hide" : "Show"}
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Markdown Preview Area */}
          {previewId && (
            <div
              style={{
                marginTop: "16px",
                border: "1px solid #aaa",
                backgroundColor: "#f9f9f9",
                padding: "12px",
                borderRadius: "4px",
              }}
            >
              <h4>Preview for: {
                reports.find(r => r.id === previewId)?.document.fileName
              }</h4>
              <ReactMarkdown>
                {reports.find((r) => r.id === previewId)?.content || ""}
              </ReactMarkdown>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f0f0f0",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  verticalAlign: "top",
};
