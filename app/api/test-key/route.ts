import { NextRequest, NextResponse } from "next/server";
import { testApiKey } from "@/lib/claude";

// 보안: API 키는 헤더에서만 추출, 로깅 절대 금지
export async function POST(request: NextRequest) {
  var apiKey = request.headers.get("x-api-key") || "";

  if (!apiKey) {
    return NextResponse.json({ valid: false, error: "API 키가 없습니다" });
  }

  var result = await testApiKey(apiKey);
  return NextResponse.json(result);
}
