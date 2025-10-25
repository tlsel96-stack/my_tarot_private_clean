import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/* ==========================================================
🌙 [1] 메인 리딩 — 상담용 (사주 정보 포함)
========================================================== */
app.post("/api/tarot", async (req, res) => {
  const {
    name,
    partner,
    topic,
    question,
    cards,
    birth,       // 생년월일
    gender,      // 성별
    birthTime,   // 태어난 시간
    today        // 오늘 날짜
  } = req.body;

  const displayName = name && name.trim() !== "" ? name : "의뢰인";
  const birthInfo = birth ? `${birth} (${gender || "성별 미상"})` : "정보 없음";
  const birthTimeInfo = birthTime ? birthTime : "모름";
  const todayDate = today || new Date().toLocaleDateString("ko-KR");

  const tarotPrompt = `
당신은 따뜻하고 현실적인 타로 상담가이며, 사주 해석도 함께 보는 전문가입니다.  
${displayName}이(가) ${topic}에 대한 질문을 던졌고, ${cards.length}장의 카드를 뽑았습니다.  
이 상담은 ${todayDate} 기준으로 진행됩니다.  

[입력 정보]
이름: ${displayName}
생년월일: ${birthInfo}
태어난 시간: ${birthTimeInfo}
질문: ${question}
상대 이름: ${partner || "없음"}
뽑은 카드: ${cards.join(", ")}

[작성 규칙]
1. 타로카드는 “첫 번째 카드는~”, “두 번째 카드는~” 이런 식으로 자연스럽게 풀어주세요.  
2. 사주 정보는 시기, 성향, 인연 흐름에 반영해서 현실적으로 설명하세요.  
3. 답변은 다음 순서로 구성:
   (1) 카드 해석 — 각 카드가 보여주는 구체적인 상황
   (2) 질문 해석 — 질문과 카드 흐름의 연결
   (3) 시기 / 흐름 — 사주 + 카드 기준으로 시점 제시 (예: 이번 겨울, 3개월 내 등)
   (4) 조언 — 감정적 조언 + 실질적 행동 제안 포함
4. 문체는 상담받는 듯한 존댓말로, 따뜻하고 이해하기 쉽게 써주세요.  
5. “#”, “*”, “-” 등의 기호는 절대 사용하지 않습니다.  
6. 각 항목은 3~5문장 이상으로, 현실적인 설명을 포함해주세요.  
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "너는 따뜻하고 현실적으로 타로와 사주를 함께 해석하는 상담가야.",
          },
          { role: "user", content: tarotPrompt },
        ],
      }),
    });

    const data = await response.json();
    res.json({ result: data.choices?.[0]?.message?.content || "GPT 응답 없음" });
  } catch (error) {
    console.error("GPT 호출 오류:", error);
    res.json({ result: "GPT 응답 오류" });
  }
});

/* ==========================================================
💬 [2] 대댓글 리딩 — SNS용 (감정형 반말, 짧고 여운 있게)
========================================================== */
app.post("/api/comment", async (req, res) => {
  const { comment, category } = req.body;

  const commentPrompt = `
너는 SNS에서 활동하는 감성 타로 리더야. 
사람들이 남긴 댓글을 읽고, 짧지만 진한 리딩을 해줘.  
문체는 반말이고 감정이 느껴져야 해.  
글의 여운이 남아야 하며, 기계적인 표현이나 리스트는 절대 금지.  

[입력 정보]
카테고리: ${category}
댓글 내용: ${comment}

[작성 규칙]
1. 전체 길이는 3~6문장으로 짧고 여운 있게 써주세요.  
2. 첫 문장은 공감이나 감정 터치로 시작 (예: “요즘 마음이 좀 복잡하지?”).  
3. 두 번째 문장은 카드 흐름처럼 지금의 상태를 부드럽게 짚어줘요.  
4. 세 번째 문장은 핵심 메시지나 방향 제시.  
5. 마지막 문장은 반드시 아래 문장으로 끝내세요:  
   “자세한 흐름 궁금하면 추가카드 뽑으러 옵챗으로 와!”  
6. “#”, “*”, “-” 등의 기호는 절대 사용하지 않습니다.  
7. 형식은 따뜻하고, 진짜 사람처럼 감정이 느껴져야 합니다.  
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content:
              "너는 감성적인 타로 리더야. 짧은 문장 속에서 사람의 감정을 읽고, 여운 있게 리딩해. 절대 딱딱하게 말하지 마.",
          },
          { role: "user", content: commentPrompt },
        ],
      }),
    });

    const data = await response.json();
    res.json({ result: data.choices?.[0]?.message?.content || "GPT 응답 없음" });
  } catch (error) {
    console.error("GPT 호출 오류:", error);
    res.json({ result: "GPT 응답 오류" });
  }
});

/* ==========================================================
🚀 서버 실행
========================================================== */
app.listen(3001, () =>
  console.log("✅ 나만의 드림투유 타로 서버 실행 중 → http://localhost:3001")
);
