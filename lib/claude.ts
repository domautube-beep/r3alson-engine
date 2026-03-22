// Claude API 호출 모듈
// 보안: API 키는 함수 스코프에서만 사용, 로깅 금지, 저장 금지

var ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
var MODEL = "claude-sonnet-4-20250514";

// API 키 형식 검증 (실제 호출 전)
export function validateApiKeyFormat(key: string): boolean {
  if (!key) return false;
  return key.startsWith("sk-ant-") && key.length > 20;
}

// Claude API 호출
export async function callClaude(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens?: number
): Promise<{ success: boolean; text: string; error?: string }> {
  // 공백 제거 (복사 시 앞뒤 공백 포함 방지)
  apiKey = apiKey.trim();

  try {
    var res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens || 4096,
        system: systemPrompt,
        messages: [
          { role: "user", content: userPrompt }
        ]
      })
    });

    if (!res.ok) {
      var status = res.status;
      if (status === 401) return { success: false, text: "", error: "API 키가 올바르지 않습니다" };
      if (status === 429) return { success: false, text: "", error: "요청이 너무 많습니다. 잠시 후 다시 시도하세요" };
      if (status === 529) return { success: false, text: "", error: "Claude 서버가 일시적으로 바쁩니다" };
      return { success: false, text: "", error: "API 오류 (" + status + ")" };
    }

    var data = await res.json();
    var text = "";
    if (data.content && data.content.length > 0) {
      text = data.content[0].text || "";
    }

    return { success: true, text: text };
  } catch (err) {
    return { success: false, text: "", error: "네트워크 오류. 인터넷 연결을 확인하세요" };
  }
}

// API 키 테스트 (간단한 호출로 유효성 확인)
export async function testApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  if (!validateApiKeyFormat(apiKey)) {
    return { valid: false, error: "API 키 형식이 올바르지 않습니다 (sk-ant-로 시작해야 함)" };
  }

  var result = await callClaude(apiKey, "You are a test.", "Reply with only the word OK.", 10);

  if (result.success) {
    return { valid: true };
  } else {
    return { valid: false, error: result.error };
  }
}
