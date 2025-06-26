import React from "react";
import DocumentUploader from "./components/DocumentUploader";
import UserDocuments from "./components/UserDocuments";
import UserReports from "./components/UserReports";
import ChatBox from "./components/ChatBox";

export default function App() {
   // return (
   // <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
   //   <h1>Industrial Analysis Platform</h1>
    //  <DocumentUploader />
    //  <UserDocuments />
    //  <UserReports />
    //  <ChatBox />
   // </div>
  //);
  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1>Industrial Analysis Platform</h1>
      <DocumentUploader />

      {/* Scrollable Document Table */}
      <div style={{ marginTop: "20px" }}>
        <UserDocuments />
      </div>

      {/* Scrollable Reports Table */}
      <div style={{ marginTop: "20px" }}>
        <UserReports />
      </div>
    </div>
  );
}
