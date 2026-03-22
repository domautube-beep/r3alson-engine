import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  var ownerPassword = request.headers.get("x-owner-password") || "";
  var serverPassword = process.env.OWNER_PASSWORD || "";

  if (!serverPassword) {
    return NextResponse.json({ valid: false, error: "서버에 비밀번호가 설정되지 않았습니다" });
  }

  if (!ownerPassword) {
    return NextResponse.json({ valid: false, error: "비밀번호를 입력하세요" });
  }

  if (ownerPassword === serverPassword) {
    return NextResponse.json({ valid: true });
  } else {
    return NextResponse.json({ valid: false, error: "비밀번호가 틀렸습니다" });
  }
}
