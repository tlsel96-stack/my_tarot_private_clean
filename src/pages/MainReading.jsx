import React, { useState } from "react";
import { getTarotResult } from "../utils/openai";

export default function MainReading() {
  const [result, setResult] = useState("");

  async function handleReportGenerate() {
    const question = "지금 내가 생각하는 대로 일이 잘 풀릴까?";
    setResult("🔮 결과 생성 중...");
    const res = await getTarotResult(question);
    setResult(res);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🃏 메인 리딩</h2>
      <button
        onClick={handleReportGenerate}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "8px",
          backgroundColor: "#222",
          color: "white",
        }}
      >
        리포트 생성
      </button>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          maxWidth: "600px",
          margin: "30px auto",
          backgroundColor: "#f8f8f8",
          borderRadius: "10px",
          textAlign: "left",
          whiteSpace: "pre-wrap",
        }}
      >
        {result}
      </div>
    </div>
  );
}
