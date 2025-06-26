import React from "react";
import ChatBox from "./ChatBox";

interface ChatOverlayProps {
  documentId: string;
  onClose: () => void;
}

export default function ChatOverlay({ documentId, onClose }: ChatOverlayProps) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtnStyle}>X</button>
        <ChatBox documentId={documentId} />
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px",
  width: "500px",
  maxHeight: "80vh",
  overflowY: "auto",
  position: "relative",
  borderRadius: "8px",
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "12px",
  background: "none",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};
