import React, { useState } from "react";
import "./App.css";
import noticeImage from "./assets/notice.png";

function App() {
  const [mode, setMode] = useState("main");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [time, setTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [calendar, setCalendar] = useState("양력");
  const [gender, setGender] = useState("여자");
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState(["", "", ""]);
  const [replyInput, setReplyInput] = useState("");
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // === 🔮 세션 관리 ===
  const clientId = `${name || "unknown"}-${birth || "unknown"}-${unknownTime ? "unknown" : time || "unknown"}`;

  const getSessionHistory = () => {
    const sessions = JSON.parse(localStorage.getItem("sessions") || "{}");
    return sessions[clientId] || [];
  };

  const updateSessionHistory = (newEntry) => {
    const sessions = JSON.parse(localStorage.getItem("sessions") || "{}");
    const existing = sessions[clientId] || [];
    const updated = [newEntry, ...existing].slice(0, 10);
    sessions[clientId] = updated;
    localStorage.setItem("sessions", JSON.stringify(sessions));
  };

  const resetSessionIfChanged = () => {
    const lastClient = localStorage.getItem("currentClient");
    if (lastClient !== clientId) {
      localStorage.setItem("currentClient", clientId);
    }
  };
  resetSessionIfChanged();

  const tarotList = [
    "1. 바보", "2. 마법사", "3. 여사제", "4. 여황제", "5. 황제", "6. 교황",
    "7. 연인", "8. 전차", "9. 힘", "10. 은둔자", "11. 운명의 수레바퀴",
    "12. 정의", "13. 매달린 사람", "14. 죽음", "15. 절제", "16. 악마",
    "17. 탑", "18. 별", "19. 달", "20. 태양", "21. 심판", "22. 세계"
  ];

  const handleRandomCards = () => {
    const random = Array.from({ length: 3 }, () =>
      tarotList[Math.floor(Math.random() * tarotList.length)]
    );
    setCards(random);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(reading || "");
    alert("결과가 복사되었습니다!");
  };

 // === 🧹 텍스트 정리 ===
const cleanText = (text) => {
  if (!text) return "";

  let cleaned = text
    .replace(/[*#`_~^>|]/g, "")
    .replace(/[A-Za-z]{3,}/g, "")
    .replace(/[\[\](){}]/g, "")
    .replace(/조언\s*조언/g, "조언")
    .replace(/\s{2,}/g, " ")
    .replace(/([0-9]+번)\s*[가-힣\s]*카드는/g, "$1 카드는")
    // 섹션 제목들을 문단 단위로 명확히 분리
    .replace(/\s*(카드 해석)\s*/g, "\n\n🌙 카드 해석\n\n")
    .replace(/\s*(질문 해석)\s*/g, "\n\n💭 질문 해석\n\n")
    .replace(/\s*(시기\s*&?\s*흐름?)\s*/g, "\n\n⏳ 시기 & 흐름\n\n")
    .replace(/\s*(조언)\s*/g, "\n\n💡 조언\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\.{3,}/g, ".")
    .replace(/([.!?])\1+/g, "$1")
    .trim();

  // 문장 단위 정리
  const sentences = cleaned.split(/(?<=[.!?])\s+/).map(s => {
    const trimmed = s.trim();
    if (trimmed.length < 3) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  });

  // 최종 결과: 섹션 간 확실한 구분 + 문단 단위 여백
  return sentences.join(" ")
    .replace(/\s{2,}/g, " ")
    .replace(/🌙 카드 해석/g, "\n\n🌙 카드 해석\n")
    .replace(/💭 질문 해석/g, "\n\n💭 질문 해석\n")
    .replace(/⏳ 시기 & 흐름/g, "\n\n⏳ 시기 & 흐름\n")
    .replace(/💡 조언/g, "\n\n💡 조언\n")
    .trim();
};


  // === 리딩 생성 ===
  const generateReading = async () => {
    setLoading(true);
    setReading("🔮 리딩 생성 중...");

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const birthTimeForPrompt = unknownTime ? "모름" : (time || "모름");
    const previousReadings = getSessionHistory()
      .map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`)
      .join("\n\n");

    let prompt = "";

    if (mode === "main") {
      prompt = `
당신은 감정과 현실의 흐름을 섬세하게 읽는 전문 타로 리더입니다.
이 내담자는 이전에 리딩을 받은 적이 있으며, 아래는 과거 리딩 기록입니다.

[이전 리딩 기록]
${previousReadings || "없음"}

[입력 정보]
이름: ${name || "미기재"}
생년월일: ${birth || "미기재"}
시간: ${birthTimeForPrompt}
양력/음력: ${calendar}
성별: ${gender}
질문: ${question || "미기재"}
선택 카드: ${cards.filter(Boolean).join(", ") || "미선택"}

---

리딩 결과는 반드시 아래 네 가지 제목 순서로 작성하세요:

카드 해석
질문 해석
시기 & 흐름
조언

[작성 규칙]
1. 카드 해석에서는 선택된 카드 순서대로 작성하되
   “첫 번째로 뽑은 13번 카드는 ~”처럼 카드 번호만 언급하세요.
   (카드 이름은 절대 쓰지 마세요.)
   각 카드는 4~5문장 이상으로 구체적으로 설명합니다.

2. 질문 해석은 “카드에서 보이는 흐름은 이렇습니다.”로 시작하고,
   반드시 내담자의 질문에 직접적인 대답을 포함하세요.

3. 시기 & 흐름  
   각 카드의 상징이 가진 ‘속도감’을 기반으로 실제 시기를 유추해서 서술하세요.  
   - 완드 카드: 빠른 전개 (며칠~몇 주 이내)  
   - 펜타클 카드: 느린 전개 (몇 달~반년 이상)  
   - 소드 카드: 중간 속도 (1~2개월 내외)  
   - 컵 카드: 감정 변화 중심, 시점보다 ‘감정이 깊어지는 단계’를 중심으로 표현  
   - 메이저 아르카나: 장기 흐름이나 중요한 전환점으로, 시기를 명확히 짚기보단 ‘분기’ 또는 ‘계절 단위’로 표현  

   시기 예시는 ‘11월 말’, ‘겨울이 지나 봄이 오기 전’, ‘3개월 내’, ‘상반기 중순경’,  
   ‘다음 보름 내’, ‘한 계절 정도 후’ 등 카드의 리듬에 맞춰 자연스럽게 서술하세요.  
   단, 모든 리딩에서 동일한 시기 예시(12월, 1~2월 등)를 반복하지 마세요.

4. 조언은 현실적이고 따뜻한 말투로,
   최소 4문장 이상으로 구체적인 감정적 조언을 담아주세요.

존댓말 유지, 특수문자·이모지 금지.
`;
    } else {
      prompt = `
너는 따뜻한 타로 리더야.
아래 댓글을 읽고 반말로 짧게 (3~5문장), 감정선이 살아있게 리딩해.
마지막 문장은 이렇게:
"흐름 더 알고싶으면 추가카드 뽑으러 옵챗으로 와!"
이모지, 특수문자 금지.

[댓글]
${replyInput}
`;
    }

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.85,
        }),
      });
      const data = await res.json();
      const text = cleanText(data?.choices?.[0]?.message?.content?.trim());
      setReading(text || "⚠️ 결과 생성 실패");

      updateSessionHistory({
        question,
        answer: text,
        timestamp: new Date().toISOString(),
      });
    } catch {
      setReading("⚠️ 오류: API 요청 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // === 기록 보기 ===
  const renderHistoryModal = () => {
    const history = getSessionHistory();
    return (
      <div className="modal-backdrop" onClick={() => setShowHistory(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h3>{name || "내담자"} 님의 지난 리딩 기록</h3>
          {history.length === 0 ? (
            <p>저장된 리딩이 없습니다.</p>
          ) : (
            history.map((item, index) => (
              <div key={index} className="history-item">
                <p><strong>🕓 {new Date(item.timestamp).toLocaleString()}</strong></p>
                <p><strong>Q:</strong> {item.question}</p>
                {expandedIndex === index ? (
                  <>
                    <pre className="full-answer">{item.answer}</pre>
                    <button onClick={() => setExpandedIndex(null)}>닫기</button>
                  </>
                ) : (
                  <>
                    <p className="preview">{item.answer.slice(0, 120)}...</p>
                    <button onClick={() => setExpandedIndex(index)}>자세히 보기</button>
                  </>
                )}
                <hr />
              </div>
            ))
          )}
          <button onClick={() => setShowHistory(false)}>닫기</button>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>🔮 단이 타로</h1>

      {/* 공지 섹션 */}
      <div className="notice-section">
        <h3 className="notice-title">📜 드림투유 단이타로 공지</h3>
        <img src={noticeImage} alt="공지 이미지" className="notice-img" />
        <div className="notice-toggle" onClick={() => setShowNotice(!showNotice)}>
          {showNotice ? "▲ 공지 접기" : "▼ 공지 보기"}
        </div>
        {showNotice && (
          <div className="notice-warning">
            <p><strong>⚠️ 저작권 및 이용 안내</strong></p>
            <p>
              본 사이트는 <strong>Dream2U 단이</strong>가 직접 제작한 서비스로,<br />
              모든 콘텐츠와 시스템의 저작권은 제작자에게 귀속됩니다.
            </p>
            <p>
              본 사이트는 승인된 사용자만 이용할 수 있는 개인 맞춤형 서비스이며,<br />
              전달받은 본인 외 타인에게 무단 배포, 2차 가공, 복제, 캡처, 공유, 또는 유사 사이트 제작을 포함한<br />
              일체의 저작권 침해 행위를 엄격히 금지합니다.
            </p>
            <p>
              위 행위가 적발될 경우, 저작권법 및 정보통신망법에 따라 민·형사상 법적 조치가 즉시 진행되며,<br />
              정해진 절차에 따라 선처 없이 고소가 이루어집니다.
            </p>
            <p>
              사용자는 본 사이트 접속 시 위 내용을 충분히 인지하고 이에 동의한 것으로 간주됩니다.
            </p>
          </div>
        )}
      </div>

      {/* 모드 선택 */}
      <div className="mode-select">
        <button onClick={() => setMode("main")} className={mode === "main" ? "active" : ""}>
          메인 리딩
        </button>
        <button onClick={() => setMode("reply")} className={mode === "reply" ? "active" : ""}>
          대댓글 리딩
        </button>
      </div>

      {mode === "main" ? (
        <>
          <h2>🧾 기본 정보</h2>
          <div className="row">
            <input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="생년월일 (예: 19960305)" value={birth} onChange={(e) => setBirth(e.target.value)} />
            <div className="time-block">
              <input
                placeholder="태어난 시간 (예: 15:15)"
                value={unknownTime ? "" : time}
                onChange={(e) => setTime(e.target.value)}
                disabled={unknownTime}
              />
              <label className="checkbox">
                <input type="checkbox" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} /> 모름
              </label>
            </div>
          </div>

          <div className="row">
            <select value={calendar} onChange={(e) => setCalendar(e.target.value)}>
              <option>양력</option>
              <option>음력</option>
            </select>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option>여자</option>
              <option>남자</option>
              <option>모름</option>
            </select>
          </div>

          <div className="row">
            <input
              type="text"
              className="full"
              placeholder="질문 (예: 전남친이 다시 연락할까?)"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <h3>선택 카드</h3>
          <div className="row">
            {cards.map((c, i) => (
              <select
                key={i}
                value={c}
                onChange={(e) => {
                  const newCards = [...cards];
                  newCards[i] = e.target.value;
                  setCards(newCards);
                }}
              >
                <option value="">카드 선택</option>
                {tarotList.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            ))}
          </div>

          <div className="row">
            <button onClick={handleRandomCards}>🎴 랜덤 3장</button>
            <button onClick={generateReading} disabled={loading}>리포트 생성</button>
          </div>
        </>
      ) : (
        <>
          <h2>💬 대댓글 리딩</h2>
          <textarea
            placeholder="댓글 내용을 입력해주세요"
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
          />
          <div className="row">
            <button onClick={generateReading} disabled={loading}>리딩 생성</button>
          </div>
        </>
      )}

      {/* 결과 영역 */}
      <h2>결과</h2>
      <div className="result-row">
        <div className="result-box">{loading ? "🔮 생성 중..." : reading}</div>
        <div className="side-btns">
          <button onClick={copyResult}>결과 복사</button>
          <button onClick={() => setShowHistory(true)}>📜 지난 리딩 보기</button>
        </div>
      </div>

      {showHistory && renderHistoryModal()}
    </div>
  );
}

export default App;
