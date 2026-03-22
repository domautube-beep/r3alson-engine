// 임시 디버그용 — 환경변수 존재 여부만 확인 (값 노출 안 함)
// 확인 후 반드시 삭제할 것
export async function GET() {
  return Response.json({
    hasOwnerPassword: !!process.env.OWNER_PASSWORD,
    passwordLength: (process.env.OWNER_PASSWORD || "").length,
    hasOwnerKey: !!process.env.OWNER_ANTHROPIC_KEY,
    keyLength: (process.env.OWNER_ANTHROPIC_KEY || "").length,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(function(k) { return k.indexOf("OWNER") !== -1; })
  });
}
