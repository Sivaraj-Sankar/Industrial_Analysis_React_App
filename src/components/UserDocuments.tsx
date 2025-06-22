import React, { useEffect, useState } from "react";
import { getUserDocuments } from "../client/api";
import GenerateReportButton from "./GenerateReportButton";
import ReportStatus from "./ReportStatus";

type Document = {
  id: string;
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

export default function UserDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <ul>
          {documents.map((doc) => (
            <li key={doc.id} style={{ marginBottom: "16px" }}>
              <strong>{doc.fileName}</strong> ({doc.fileType}) <br />
              Uploaded: {new Date(doc.uploadedAt).toLocaleString()} <br />
              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
              <br />
              Latest Report Status:{" "}
              {doc.reports.length > 0 ? (
    <ReportStatus reportId={doc.reports[0].id} />
  ) : (
    <p>No report generated yet.</p>
  )}

              <GenerateReportButton documentId={doc.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
