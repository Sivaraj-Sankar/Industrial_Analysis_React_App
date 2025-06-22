import React, { useState } from "react";
import { sendChatMessage } from "../client/api";

export default function ChatBox({ documentId }: { documentId?: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: string; content: string; createdAt?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await sendChatMessage({
        content: input,
        documentId,
      });

      setMessages((prev) => [
        ...prev,
        { role: "user", content: res.userMessage.content },
        { role: "assistant", content: res.aiMessage.content },
      ]);

      setInput("");
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", marginTop: "24px" }}>
      <h2>Chat with Analyst {documentId ? `(Document Context)` : ``}</h2>

      <div
        style={{
          minHeight: "150px",
          border: "1px solid #999",
          padding: "8px",
          marginBottom: "12px",
          backgroundColor: "#fafafa",
          overflowY: "auto",
          maxHeight: "300px",
        }}
      >
        {messages.length === 0 && <p>No messages yet.</p>}

        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "8px",
              color: msg.role === "user" ? "black" : "blue",
            }}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
        placeholder="Type your message..."
      />

      <button onClick={handleSend} disabled={loading || !input.trim()}>
        {loading ? "Sending..." : "Send"}
      </button>

      {error && (
        <div style={{ marginTop: "8px", color: "red" }}>Error: {error}</div>
      )}
    </div>
  );
}
