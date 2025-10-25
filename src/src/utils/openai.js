// src/utils/openai.js
export async function getTarotResult(promptText) {
  // ✅ 여기에 본인 OpenAI API 키를 직접 입력하세요
  const apiKey = "sk-여기에_너의_API_키_붙여넣기";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "너는 타로 마스터야. 타로 해석을 자세히 설명해줘.",
          },
          {
            role: "user",
            content: promptText,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ OpenAI API 오류:", data.error);
      return "⚠️ 결과 생성 중 오류가 발생했습니다.";
    }

    // ✅ 결과 리턴
    return data.choices?.[0]?.message?.content || "결과를 가져오지 못했습니다.";
  } catch (err) {
    console.error("❌ 네트워크 오류:", err);
    return "⚠️ 네트워크 오류가 발생했습니다.";
  }
}
