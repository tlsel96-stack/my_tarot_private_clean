import React from "react";

const MainReading = ({ content }) => (
  <div style={{ textAlign: "left", margin: "40px auto", maxWidth: "600px" }}>
    <h2>🔮 메인 리딩</h2>
    <pre style={{ whiteSpace: "pre-wrap" }}>{content}</pre>
  </div>
);

export default MainReading;
