import React, { useEffect, useState } from "react";
import { getUserDocuments } from "../client/api";
import GenerateReportButton from "./GenerateReportButton";
import ReportStatus from "./ReportStatus";
import ChatOverlay from "./ChatOverlay"; // New floating chat box

type Document = {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  reports: {
    id: string;
    status: string;
    createdAt: string;
  }[];
};

const BASE_URL = "http://localhost:8000";

export default function UserDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChatDocId, setActiveChatDocId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const docs = await getUserDocuments();
        setDocuments(docs);
      } catch (err: any) {
        setError(err.message || "Failed to load documents");
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", marginTop: "24px" }}>
      <h2>Your Documents</h2>

      {loading && <p>Loading documents...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && documents.length === 0 && <p>No documents uploaded yet.</p>}

      {!loading && documents.length > 0 && (
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>File Name</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Uploaded At</th>
                <th style={thStyle}>View</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Report</th>
                <th style={thStyle}>Chat</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td style={tdStyle}>{doc.fileName}</td>
                  <td style={tdStyle}>{doc.fileType}</td>
                  <td style={tdStyle}>{new Date(doc.uploadedAt).toLocaleString()}</td>
                  <td style={tdStyle}>
                    <a href={`${BASE_URL}${doc.fileUrl}`} target="_blank" rel="noopener noreferrer">View</a>
                  </td>
                  <td style={tdStyle}>
                    {doc.reports.length > 0
                      ? <ReportStatus reportId={doc.reports[0].id} />
                      : "No report yet"}
                  </td>
                  <td style={tdStyle}>
                    <GenerateReportButton documentId={doc._id} />
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => setActiveChatDocId(doc._id)}>
                      Chat with AI
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating chat box overlay */}
      {activeChatDocId && (
        <ChatOverlay
          documentId={activeChatDocId}
          onClose={() => setActiveChatDocId(null)}
        />
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f9f9f9",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  verticalAlign: "top",
};
