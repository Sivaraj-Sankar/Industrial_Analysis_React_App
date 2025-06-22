import React, { useState } from "react";

type UploadResponse = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
};

export default function DocumentUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setUploaded(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const base64 = await toBase64(file);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileBase64: base64,
          fileType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploaded(data);
    } catch (err: any) {
      setError(err.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove Data URL prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", maxWidth: "400px" }}>
      <h2>Upload Document</h2>

      <input type="file" onChange={handleFileChange} />

      {file && (
        <div style={{ marginTop: "8px" }}>
          <strong>Selected:</strong> {file.name} ({file.type})
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{ marginTop: "12px" }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {uploaded && (
        <div style={{ marginTop: "12px", color: "green" }}>
          <strong>Uploaded:</strong> {uploaded.fileName}
          <br />
          URL: <a href={uploaded.fileUrl} target="_blank" rel="noopener noreferrer">View Document</a>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "12px", color: "red" }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}
