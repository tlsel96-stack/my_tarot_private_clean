import React from "react";

const SubReading = ({ content }) => (
  <div style={{ textAlign: "left", margin: "40px auto", maxWidth: "600px" }}>
    <h3>💬 대댓글 리딩</h3>
    <pre style={{ whiteSpace: "pre-wrap" }}>{content}</pre>
  </div>
);

export default SubReading;
