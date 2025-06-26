// const BASE_URL = "http://localhost:8000";

export async function uploadDocument(params: {
    fileName: string;
    fileBase64: string;
    fileType: string;
  }) {
    const response = await fetch("/api/documents/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  
    if (!response.ok) {
      throw new Error("Upload failed");
    }
  
    return response.json();
  }

  export async function getUserDocuments() {
    const response = await fetch("/api/documents", {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }
  
    return response.json();
  }

  export async function generateReport(params: { documentId: string }) {
    const response = await fetch("/api/reports/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  
    if (!response.ok) {
      throw new Error("Failed to generate report");
    }
  
    return response.json();
  }

  export async function getReportStatus(reportId: string) {
    const response = await fetch(`/api/reports/${reportId}/status`, {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch report status"); 
    }
  
    return response.json();
  }

  export async function getUserReports() {
    const response = await fetch("/api/reports", {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch reports");
    }
  
    return response.json();
  }


  export async function sendChatMessage(params: { content: string; documentId?: string }) {
    const response = await fetch("/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  
    if (!response.ok) {
      throw new Error("Failed to send chat message");
    }
  
    return response.json();
  }

  export async function getChatHistory(params: { documentId?: string }) {
    const query = params.documentId ? `?documentId=${params.documentId}` : "";
    const response = await fetch(`/api/chat/history${query}`, {
      method: "GET",
    });
  
    if (!response.ok) {
      throw new Error("Failed to load chat history");
    }
  
    return response.json();
  }
  
  
  