import React from "react";

function MainReading({ resultText }) {
  // 불필요한 마크다운 기호 제거 (*, # 등)
  const cleanedResult = resultText.replace(/[#*]+/g, "");

  return (
    <div className="reading-result">
      <h2>결과</h2>
      {/* 정리된 결과 표시 */}
      <div
        style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}
      >
        {cleanedResult}
      </div>
    </div>
  );
}

export default MainReading;
