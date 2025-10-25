import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ReplyReading() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [reading, setReading] = useState("");

  const topics = ["오늘 운세", "상대 속마음", "다음 기회", "미래 흐름"];

  const handleGenerate = () => {
    if (!topic) return alert("주제를 선택해주세요.");
    const readings = {
      "오늘 운세":
        "오늘은 마음의 방향이 중요한 날이에요. 조급함을 내려놓고 중심을 잡으면 좋은 일이 들어옵니다.",
      "상대 속마음":
        "상대는 당신의 존재를 신경 쓰고 있습니다. 다만 표현이 서툴 뿐이에요. 기다림 속에 감정이 무르익고 있습니다.",
      "다음 기회":
        "이번이 끝이 아닙니다. 한 번의 선택이 아니라 여러 번의 기회가 준비되어 있으니, 마음을 열어두세요.",
      "미래 흐름":
        "다가오는 한 달 안에 새로운 제안이나 소식이 들어올 가능성이 높아요. 작은 변화가 큰 방향을 바꿀 수 있습니다.",
    };
    setReading(readings[topic]);
  };

  return (
    <div className="reading-page">
      <h2>💬 대댓글 리딩</h2>
      <select value={topic} onChange={(e) => setTopic(e.target.value)}>
        <option value="">주제 선택</option>
        {topics.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <button onClick={handleGenerate}>리딩 생성</button>
      {reading && <p className="reading-box">{reading}</p>}
      <button onClick={() => navigate("/")}>처음으로</button>
    </div>
  );
}
