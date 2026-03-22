import { NextRequest, NextResponse } from "next/server";
import { LYRICS_SYSTEM_PROMPT, filterBannedWords, validateLyrics, buildLyricsPrompt } from "@/lib/lyrics-engine";
import { generateStylePrompt, SUNO_SYSTEM_PROMPT, buildFullSunoPrompt } from "@/lib/suno-prompt-engine";
import { callClaude, validateApiKeyFormat } from "@/lib/claude";

// ===== 데모 가사 풀 =====
// R3ALSON 스타일: 짧은 라인, 구체적 사물, 보편적 감정
// "이 감정 나도 느껴봤다" 기준으로 작성
// Show-don't-tell / Object motif / Hook 2회 / () adlib

var THEMED_LYRICS = [

  // [0] Read Receipt — 답장 안 오는 불안, 폰, 읽씹
  [
    "[Verse]",
    "보냈어 오전 열 시",
    "읽었어 오전 열 시",
    "그다음엔 아무것도",
    "한 시간이 지났어",
    "폰 뒤집어놨어",
    "안 보려고",
    "다시 봤어",
    "아직 그대로",
    "",
    "[Pre-Chorus]",
    "바빠서 그럴 거야",
    "스스로한테 말해",
    "근데 손이",
    "폰으로 자꾸 가",
    "",
    "[Hook]",
    "read receipt (oh)",
    "read receipt",
    "읽었는데 안 와",
    "이게 뭔 말인지 (ah)",
    "read receipt (oh)",
    "read receipt",
    "답 안 오는 거",
    "그게 답인 건지",
    "",
    "[Verse]",
    "다시 보내려다",
    "지웠어 세 번",
    "기다리는 사람처럼",
    "보이기 싫어서",
    "근데 결국 또",
    "화면 켜봐",
    "아직 그대로야",
    "시간만 바뀌어",
    "",
    "[Bridge]",
    "먼저 연락하지 말라고",
    "친구가 그랬어",
    "근데 그게",
    "쉬우면 말하지",
    "폰 서랍에 넣었어",
    "다시 꺼냈어",
    "",
    "[Hook]",
    "read receipt (oh)",
    "read receipt",
    "답 안 오는 거",
    "그게 답인 건지",
    "",
    "[Outro]",
    "read receipt (mm)",
    "그게 답인 건지"
  ].join("\n"),

  // [1] Passenger Seat — 헤어지고 옆자리 보는 습관
  [
    "[Verse]",
    "조수석 비어 있어",
    "그래도 가방 안 놔",
    "습관이야",
    "어디 두는 줄 알아",
    "신호 걸렸을 때",
    "옆을 봤어",
    "빈 의자야",
    "당연한 거잖아",
    "",
    "[Pre-Chorus]",
    "라디오 켰어",
    "니가 좋아하던 채널",
    "바꾸려다",
    "그냥 뒀어",
    "",
    "[Hook]",
    "passenger seat (ooh)",
    "passenger seat",
    "아무도 없는데",
    "자꾸 옆을 봐 (ah)",
    "passenger seat (ooh)",
    "passenger seat",
    "습관이 제일",
    "오래 남더라",
    "",
    "[Verse]",
    "밥 두 인분 시켰어",
    "혼자인데",
    "취소하려다",
    "그냥 뒀어",
    "한 그릇 다 먹고",
    "한 그릇 식어",
    "치울 때",
    "그때 알았어",
    "",
    "[Bridge]",
    "시간 지나면 된다고",
    "다 그러더라",
    "시간이 얼마나",
    "필요한 건지",
    "오늘도 조수석",
    "비어 있어",
    "",
    "[Hook]",
    "passenger seat (ooh)",
    "passenger seat",
    "습관이 제일",
    "오래 남더라",
    "",
    "[Outro]",
    "passenger seat (mm)",
    "오래 남더라"
  ].join("\n"),

  // [2] Alarm Skip — 월요일 아침, 알람 끄기, 일어나기 싫음
  [
    "[Verse]",
    "alarm 일곱 시",
    "껐어",
    "alarm 일곱 십",
    "껐어",
    "alarm 여덟 시",
    "이불 속에서",
    "오늘도",
    "이러면 안 되는데",
    "",
    "[Pre-Chorus]",
    "일어나야 해",
    "알아",
    "근데 몸이",
    "안 움직여",
    "",
    "[Hook]",
    "alarm skip (nah)",
    "alarm skip",
    "오늘 하루",
    "그냥 없었으면 (ooh)",
    "alarm skip (nah)",
    "alarm skip",
    "이불 속이",
    "제일 솔직한 것 같아",
    "",
    "[Verse]",
    "폰 화면 빛",
    "메시지 쌓여 있어",
    "업무 카톡",
    "열 개",
    "지금 아무것도",
    "하기 싫어",
    "창문 밖 소리들",
    "이미 시작됐어",
    "",
    "[Bridge]",
    "다들 잘 살고 있잖아",
    "나만 이래",
    "근데 솔직히",
    "다 이러지 않나",
    "이불 걷어내고",
    "일어났어",
    "오늘도 이겼어",
    "간신히",
    "",
    "[Hook]",
    "alarm skip (nah)",
    "alarm skip",
    "이불 속이",
    "제일 솔직한 것 같아",
    "",
    "[Outro]",
    "alarm skip (mm)",
    "간신히"
  ].join("\n"),

  // [3] Solo Meal — 혼자 밥 먹으면서 괜찮은 척
  [
    "[Verse]",
    "창가 자리 잡고",
    "폰 세워놔",
    "혼자인 티",
    "안 나게",
    "유튜브 틀어놓고",
    "소리만 들어",
    "밥은 그냥",
    "넘어가",
    "",
    "[Pre-Chorus]",
    "옆 테이블 둘이야",
    "웃는 소리",
    "이어폰 볼륨",
    "올렸어",
    "",
    "[Hook]",
    "solo meal (oh-oh)",
    "solo meal",
    "괜찮다고 했어",
    "나한테 (ah)",
    "solo meal (oh-oh)",
    "solo meal",
    "혼자가 편하다고",
    "믿고 싶어서",
    "",
    "[Verse]",
    "계산할 때",
    "일 인분 영수증",
    "버리려다",
    "주머니 넣었어",
    "오늘 뭐 먹었냐",
    "아무도 안 물어",
    "그게 더",
    "조용해서 좋아",
    "",
    "[Bridge]",
    "친구한테 전화할까",
    "하다가 말았어",
    "바쁠 것 같아서",
    "사실 겁나서",
    "다음엔 같이 먹자",
    "내가 먼저 말할게",
    "",
    "[Hook]",
    "solo meal (oh-oh)",
    "solo meal",
    "혼자가 편하다고",
    "믿고 싶어서",
    "",
    "[Outro]",
    "solo meal (mm)",
    "믿고 싶어서"
  ].join("\n"),

  // [4] 3AM Ceiling — 새벽 잠 못 자고 천장 보기
  [
    "[Verse]",
    "새벽 세 시야",
    "눈이 안 감겨",
    "천장 금 세 개",
    "다 외워버렸어",
    "핸드폰 내려놓고",
    "다시 봐",
    "아무 이유 없이",
    "잠이 안 와",
    "",
    "[Pre-Chorus]",
    "낮엔 괜찮은데",
    "이 시간만 되면",
    "별거 아닌 것들이",
    "다 크게 느껴져",
    "",
    "[Hook]",
    "3am ceiling (ooh)",
    "3am ceiling",
    "별 생각 다 해",
    "아무 생각도 없이 (ah)",
    "3am ceiling (ooh)",
    "3am ceiling",
    "이 시간만",
    "솔직해지더라",
    "",
    "[Verse]",
    "내일 할 일들",
    "머릿속 정리해봐",
    "다 정리됐는데",
    "잠은 안 와",
    "물 한 잔 마시러",
    "일어났다가",
    "다시 누워",
    "또 천장 봐",
    "",
    "[Bridge]",
    "이러다 아침 되고",
    "알람 울리고",
    "또 하루가 시작돼",
    "그렇게 살아",
    "근데 이 새벽이",
    "나만의 시간 같아",
    "",
    "[Hook]",
    "3am ceiling (ooh)",
    "3am ceiling",
    "이 시간만",
    "솔직해지더라",
    "",
    "[Outro]",
    "3am ceiling (mm)",
    "솔직해지더라"
  ].join("\n"),

  // [5] Commute Blank — 퇴근길, 아무 생각 없이 걷기
  [
    "[Verse]",
    "퇴근 지하철",
    "문 닫히고",
    "이어폰 꽂고",
    "아무거나 틀어",
    "옆 사람 어깨",
    "닿을 것 같아",
    "한 칸 옮겼어",
    "습관이야",
    "",
    "[Pre-Chorus]",
    "오늘 뭐 했지",
    "생각이 안 나",
    "그냥 있었어",
    "하루가 지나",
    "",
    "[Hook]",
    "commute blank (yeah)",
    "commute blank",
    "어디 있는지",
    "모르게 걸어 (ooh)",
    "commute blank (yeah)",
    "commute blank",
    "집에 가고 있어",
    "그게 전부야",
    "",
    "[Verse]",
    "내려서 걸었어",
    "편의점 지나쳐",
    "들어갈까 하다",
    "그냥 걸었어",
    "앞사람 뒤를",
    "멍하니 따라가",
    "신호 바뀌어서",
    "같이 건넜어",
    "",
    "[Bridge]",
    "오늘 잘 살았나",
    "모르겠어",
    "그냥 살았어",
    "그걸로 됐겠지",
    "문 열고 들어가면",
    "또 내일이야",
    "",
    "[Hook]",
    "commute blank (yeah)",
    "commute blank",
    "집에 가고 있어",
    "그게 전부야",
    "",
    "[Outro]",
    "commute blank (mm)",
    "그게 전부야"
  ].join("\n"),

  // [6] Half Friend — 잘되는 친구 보면서 초라한 것
  [
    "[Verse]",
    "피드에 떴어",
    "네 새 소식",
    "좋아요 눌렀어",
    "진심으로",
    "근데 폰 내리고",
    "잠깐 멈췄어",
    "나는 뭐 하나",
    "잠깐 생각했어",
    "",
    "[Pre-Chorus]",
    "시기가 아니야",
    "알아",
    "그냥 잠깐",
    "초라해서",
    "",
    "[Hook]",
    "half friend (oh)",
    "half friend",
    "잘 됐으면 좋겠어",
    "진짜로 (ah)",
    "half friend (oh)",
    "half friend",
    "그러면서도",
    "나는 어디 있나",
    "",
    "[Verse]",
    "축하 메시지",
    "보냈어",
    "답장 왔어",
    "고마워 언제 봐",
    "언제 보냐고",
    "모르겠어",
    "바빠서가 아니라",
    "뭔가 어색해서",
    "",
    "[Bridge]",
    "잘 됐으면 좋겠다",
    "그 말 진짜야",
    "근데 그 말 옆에",
    "나도 잘 되고 싶다",
    "그 말도 진짜야",
    "둘 다 진짜야",
    "",
    "[Hook]",
    "half friend (oh)",
    "half friend",
    "그러면서도",
    "나는 어디 있나",
    "",
    "[Outro]",
    "half friend (mm)",
    "어디 있나"
  ].join("\n"),

  // [7] Unsent — 좋아하는데 말 못하는 것, 지운 메시지
  [
    "[Verse]",
    "좋아한다고",
    "썼어 지웠어",
    "밥 같이 먹을래",
    "썼어 지웠어",
    "오늘 뭐 해",
    "썼어 지웠어",
    "그냥 보냈어",
    "잘 자",
    "",
    "[Pre-Chorus]",
    "이모티콘 하나로",
    "답 왔어",
    "그거 보고",
    "오늘도 못 했어",
    "",
    "[Hook]",
    "unsent (oh-oh)",
    "unsent",
    "하고 싶은 말",
    "폰 안에 쌓여 (ah)",
    "unsent (oh-oh)",
    "unsent",
    "언젠가는 말할게",
    "아직은 아냐",
    "",
    "[Verse]",
    "같이 있으면",
    "말하려고 했어",
    "근데 네가 웃으면",
    "다 잊어버려",
    "집에 와서",
    "또 썼어",
    "또 지웠어",
    "저장은 했어",
    "",
    "[Bridge]",
    "말 안 해도",
    "표정으로 보일 것 같아",
    "근데 넌 모르는 것 같아",
    "다행이야",
    "아니 아쉬워",
    "모르겠어",
    "",
    "[Hook]",
    "unsent (oh-oh)",
    "unsent",
    "언젠가는 말할게",
    "아직은 아냐",
    "",
    "[Outro]",
    "unsent (mm)",
    "아직은 아냐"
  ].join("\n")
];

// ===== 랩 데모 가사 =====
// 구체적 장면 + 펀치라인 + 코드스위칭
var RAP_EXTRA_LYRICS = [

  // [0] Cold Hands — 빈 지갑, 버티기, 엄마 전화 못 받기
  [
    "[Verse]",
    "겨울 코트 무거워",
    "지갑은 가벼워",
    "엄마 전화 두 번",
    "못 받았어 어제",
    "할 말이 없어서",
    "not cuz I don't care",
    "그냥 아직 아무것도",
    "없어서 그래",
    "",
    "[Pre-Chorus]",
    "편의점 거울 봤어",
    "눈 밑에 짐 쌌어",
    "떠날 준비 된 것처럼",
    "어딜 가는지도 모르고",
    "",
    "[Hook]",
    "cold hands (uh)",
    "cold hands (yeah)",
    "제일 높은 데 닿으려고",
    "여기서 버텨 (ooh)",
    "cold hands (uh)",
    "cold hands",
    "따뜻한 맘 얘기 말고",
    "나는 플랜이 필요해",
    "",
    "[Verse]",
    "버스 정류장 의자",
    "광고 반쯤 뜯겼어",
    "아는 애 지나가는데",
    "후드 눌러써",
    "어떤 애들은 앞으로 가",
    "어떤 애들은 멀어져",
    "나는 어딘지 아직도",
    "정류장에 서 있어",
    "",
    "[Bridge]",
    "봄 오면 달라질까",
    "얼음 녹듯이",
    "아니면 그냥 여기",
    "그 사이 어딘가",
    "손 넣어봐 주머니",
    "아직 따뜻해",
    "",
    "[Hook]",
    "cold hands (uh)",
    "cold hands",
    "따뜻한 맘 얘기 말고",
    "나는 플랜이 필요해",
    "",
    "[Outro]",
    "cold hands (mm)",
    "플랜이 필요해"
  ].join("\n"),

  // [1] Block Print — 동네, 발자국, 흔적
  [
    "[Verse]",
    "stoop sitting heavy",
    "concrete keeping score",
    "every crack a story",
    "from the ones before",
    "sneaker on the wire",
    "hung it there myself",
    "this block raised me rough",
    "call it wealth",
    "",
    "[Pre-Chorus]",
    "bodega mirror shows",
    "a tired face",
    "but I recognize it now",
    "more than any stage",
    "",
    "[Hook]",
    "block print (woo)",
    "block print (uh)",
    "this street left a mark",
    "that won't wash (yeah)",
    "block print (woo)",
    "block print",
    "I could leave tomorrow",
    "but the block never drops",
    "",
    "[Verse]",
    "fire escape sunset",
    "orange through the bars",
    "homie called said move",
    "said come get the stars",
    "I looked at the curb",
    "where I used to sit",
    "every scar it left me",
    "that's the certified",
    "",
    "[Bridge]",
    "every corner I sat on",
    "left a print in me",
    "not the kind that heals",
    "just the kind you learn to be",
    "I stop running from it",
    "let it stay",
    "",
    "[Hook]",
    "block print (woo)",
    "block print",
    "I could leave tomorrow",
    "but the block never drops",
    "",
    "[Outro]",
    "block print (mm)",
    "never drops"
  ].join("\n")
];

// ===== 단곡 무드 기반 가사 =====

// 멜랑꼴리/다크 — 헤어진 뒤 남겨진 것들, 치우지 못함
var LYRIC_MELANCHOLIC = [
  "[Verse]",
  "신발 현관에",
  "며칠째 안 움직여",
  "커피 식어가",
  "창틀 위에서",
  "목소리 들려",
  "파이프 소리야",
  "움직이면",
  "사라질까봐 가만있어",
  "",
  "[Pre-Chorus]",
  "라디에이터",
  "세 번 울려 멈춰",
  "네가 들어오던",
  "노크 소리랑 같아",
  "",
  "[Hook]",
  "hollow rooms (oh-oh)",
  "hollow rooms",
  "네가 남긴 것들로",
  "집 만들었어 (ah)",
  "hollow rooms (oh-oh)",
  "hollow rooms",
  "이 정적이",
  "아직도 너처럼 들려",
  "",
  "[Verse]",
  "네 책 엎어져",
  "42페이지에",
  "한 번도 안 건드려",
  "그게 네 자리니까",
  "선반 먼지 위에",
  "선 그어봐",
  "네 이름 쓰고",
  "지워버려",
  "",
  "[Pre-Chorus]",
  "커튼이 움직여",
  "잡아당기는 것처럼",
  "그냥 틈새 바람이",
  "벽 타고 들어온 거야",
  "",
  "[Hook]",
  "hollow rooms (oh-oh)",
  "hollow rooms",
  "네가 남긴 것들로",
  "집 만들었어 (ah)",
  "hollow rooms (oh-oh)",
  "hollow rooms",
  "이 정적이",
  "아직도 너처럼 들려",
  "",
  "[Bridge]",
  "벽 색 바꿀 수 있어",
  "네가 좋아한 의자 옮기고",
  "선반 채워서",
  "네 생각 안 나게",
  "근데 그냥 앉아",
  "네 자리에",
  "이 고요가 날",
  "안아주는 것처럼",
  "",
  "[Outro]",
  "hollow rooms (mm)",
  "(oh-oh)",
  "아직도 너처럼 들려"
].join("\n");

// 칠/피스풀 — 아무것도 안 해도 되는 아침
var LYRIC_CHILL = [
  "[Verse]",
  "맨발로 타일",
  "아침이 왔어",
  "두 손으로 컵 잡고",
  "김 올라와",
  "커튼 빛 들어와",
  "바닥에 깔려",
  "알람 없는 하루",
  "새 소리만",
  "",
  "[Pre-Chorus]",
  "주전자 한숨 쉬어",
  "한 잔 더 따라",
  "햇살 닿는 자리",
  "그냥 앉아있어",
  "",
  "[Hook]",
  "easy morning (ooh)",
  "easy morning",
  "서두를 것 없어",
  "빛만 들어와 (ah)",
  "easy morning (ooh)",
  "easy morning",
  "세상이 기다려줘",
  "내가 숨 쉬는 동안",
  "",
  "[Verse]",
  "책 펼쳐놨어",
  "두 번 읽은 페이지",
  "내용 말고",
  "무게가 좋아서",
  "고양이 창틀 위",
  "뭔가 보고 있어",
  "우린 얘기 안 해",
  "그냥 같이 있어",
  "",
  "[Pre-Chorus]",
  "시계 소리 작아",
  "시간 세는 거 멈춰",
  "분이 녹아내려",
  "설탕처럼",
  "",
  "[Hook]",
  "easy morning (ooh)",
  "easy morning",
  "서두를 것 없어",
  "빛만 들어와 (ah)",
  "easy morning (ooh)",
  "easy morning",
  "세상이 기다려줘",
  "내가 숨 쉬는 동안",
  "",
  "[Bridge]",
  "나중에 나가서",
  "풀 밟아볼게",
  "눈 감고",
  "잠깐만",
  "근데 지금 이 의자",
  "이 따뜻함",
  "이게 다야",
  "지금 이 순간에",
  "",
  "[Outro]",
  "easy morning (mm)",
  "(ooh)",
  "숨 쉬는 동안"
].join("\n");

// 에너지/밝은 무드 — 간신히 일어나서 앞으로 가기
var LYRIC_ENERGETIC = [
  "[Verse]",
  "끈 조여매고",
  "새벽 다섯 시",
  "이어폰 꽂고",
  "도시 아직 자",
  "내 그림자가 앞서",
  "길 아는 것처럼",
  "심장 소리가",
  "하루 소리 묻어",
  "",
  "[Pre-Chorus]",
  "신호등 깜빡여",
  "보폭 안 줄여",
  "빨강이든 초록이든",
  "선 넘고 있어",
  "",
  "[Hook]",
  "on my wave (yeah)",
  "on my wave (woo)",
  "말들 들려",
  "나는 이미 멀리 (ooh)",
  "on my wave (yeah)",
  "on my wave",
  "잡아봐",
  "근데 나는 안 느려져",
  "",
  "[Verse]",
  "이마에 땀",
  "해 뜨기 시작해",
  "앉아서 허비하던",
  "공원 벤치 지나쳐",
  "지금은 안 멈춰",
  "발이 달라",
  "뒤에 남긴 블록들",
  "넘어온 블록들",
  "",
  "[Pre-Chorus]",
  "가게 유리에",
  "반사된 내가 흐려",
  "과거의 나",
  "못 알아보겠어",
  "",
  "[Hook]",
  "on my wave (yeah)",
  "on my wave (woo)",
  "말들 들려",
  "나는 이미 멀리 (ooh)",
  "on my wave (yeah)",
  "on my wave",
  "잡아봐",
  "근데 나는 안 느려져",
  "",
  "[Bridge]",
  "멈춰서 벤치 앉을 수도",
  "예전처럼",
  "세상 구경하며",
  "흘려보낼 수도",
  "근데 다리가 가",
  "가슴이 타",
  "매 걸음이",
  "배움이야",
  "",
  "[Outro]",
  "on my wave (mm)",
  "(yeah)",
  "이미 멀리"
].join("\n");

// 기본 랩 — 혼자 남겨진 공간, 못 버리는 것들, 코드스위칭
var RAP_DEFAULT = [
  "[Verse]",
  "문 열고 나오면",
  "새벽 공기 달라",
  "손목 시계 봐",
  "시간이 달려",
  "폰 진동 낮게",
  "같은 이름이야",
  "바꾼다 했는데",
  "그게 소설이야",
  "",
  "[Pre-Chorus]",
  "싱크대 옆에",
  "열쇠 두고 갔어",
  "물은 계속 틀어",
  "그냥 서 있어",
  "",
  "[Hook]",
  "I don't chase (nah)",
  "I don't chase (uh-huh)",
  "빈 공간에",
  "네 잔상 채워져 (yeah)",
  "I don't chase (nah)",
  "I don't chase",
  "근데 문은 열려 있어",
  "혹시 몰라서",
  "",
  "[Verse]",
  "테이블 위 컵 두 개",
  "하나는 몇 주째",
  "네 재킷 의자에",
  "아직 거기 있어",
  "버릴 수도 있어",
  "근데 걸어놨어",
  "돌아올 것처럼",
  "내 옆에 자리",
  "",
  "[Pre-Chorus]",
  "수도꼭지 방울",
  "시간 세고 있어",
  "한 방울 한 마디",
  "못 한 말들이",
  "",
  "[Hook]",
  "I don't chase (nah)",
  "I don't chase (uh-huh)",
  "빈 공간에",
  "네 잔상 채워져 (yeah)",
  "I don't chase (nah)",
  "I don't chase",
  "근데 문은 열려 있어",
  "혹시 몰라서",
  "",
  "[Bridge]",
  "돌아서서 걸어나갈 수도",
  "컵도 치우고",
  "물도 잠그고",
  "그게 맞겠지",
  "근데 손이",
  "문틀에 걸려",
  "조용한 문도",
  "기다리더라",
  "",
  "[Hook]",
  "I don't chase (ooh)",
  "I don't chase",
  "근데 문은 열려 있어",
  "혹시 몰라서 (yeah)",
  "",
  "[Outro]",
  "(mm, mm)",
  "혹시 몰라서"
].join("\n");

// ===== 데모 가사 선택 함수 =====
function generateDemoLyrics(genre: string, moods: string[], theme: string, variationIndex?: number): string {
  var idx = variationIndex || 0;
  var moodLower = moods.length > 0 ? moods[0].toLowerCase() : "melancholic";
  var isRap = genre.toLowerCase().indexOf("hip") !== -1
    || genre.toLowerCase().indexOf("rap") !== -1
    || genre.toLowerCase().indexOf("trap") !== -1
    || genre.toLowerCase().indexOf("drill") !== -1;

  // ===== 플레이리스트 트랙 (idx > 0): 테마별 고유 가사 =====
  if (idx > 0) {
    if (isRap) {
      var rapIdx = (idx - 1) % (RAP_EXTRA_LYRICS.length + 1);
      if (rapIdx < RAP_EXTRA_LYRICS.length) {
        return RAP_EXTRA_LYRICS[rapIdx];
      }
    } else {
      return THEMED_LYRICS[(idx - 1) % THEMED_LYRICS.length];
    }
  }

  // ===== 단곡 모드: 무드 기반 선택 =====
  if (isRap) {
    return RAP_DEFAULT;
  }

  if (moodLower === "melancholic" || moodLower === "dark" || moodLower === "eerie" || moodLower === "haunting" || moodLower === "somber") {
    return LYRIC_MELANCHOLIC;
  }

  if (moodLower === "chill" || moodLower === "peaceful" || moodLower === "dreamy" || moodLower === "calm" || moodLower === "serene") {
    return LYRIC_CHILL;
  }

  return LYRIC_ENERGETIC;
}

// ===== 제목 생성 =====
function generateTitle(genre: string, moods: string[]): string {
  var titles: Record<string, string[]> = {
    "melancholic": ["Read Receipt", "Passenger Seat", "Hollow Rooms", "Phone Down"],
    "dark": ["Cold Frame", "Wet Rail", "Worn Thread", "Last Lock"],
    "eerie": ["Shadow Tap", "Void Hum", "Thin Wall", "Dead Signal"],
    "chill": ["Easy Morning", "Slow Pour", "Alarm Skip", "Tile Morning"],
    "peaceful": ["Still Garden", "Soft Landing", "Open Window", "Cloud Rest"],
    "dreamy": ["3AM Ceiling", "Half Awake", "Solo Meal", "Soft Rewind"],
    "nostalgic": ["Counter Receipt", "Tape Residue", "Unsent", "Rewind Once"],
    "cinematic": ["Commute Blank", "Last Take", "Wide Angle", "Score Rising"],
    "energetic": ["Full Stride", "Block Print", "Red Light Go", "Overtake"],
    "epic": ["Iron Summit", "Final Charge", "Thunder March", "Crown Heavy"],
    "romantic": ["Unsent", "Half Friend", "Stay Longer", "Same Spot"],
    "happy": ["Wide Grin", "Golden Hour", "Free Wheel", "Full Bloom"],
    "aggressive": ["Break Point", "Cold Steel", "Jaw Set", "No Warning"]
  };

  var moodKey = moods.length > 0 ? moods[0].toLowerCase() : "melancholic";
  var options = titles[moodKey] || titles["melancholic"];
  return options[Math.floor(Math.random() * options.length)];
}

// ===== POST 핸들러 =====
export async function POST(request: NextRequest) {
  // 보안: API 키 우선순위
  // 1. 사용자가 직접 입력한 키 (헤더)
  // 2. 오너 비밀번호 인증 시 -> 서버 환경변수의 오너 키 사용
  var apiKey = request.headers.get("x-api-key") || "";
  var ownerPassword = request.headers.get("x-owner-password") || "";

  if (!apiKey && ownerPassword && ownerPassword === process.env.OWNER_PASSWORD) {
    apiKey = process.env.OWNER_ANTHROPIC_KEY || "";
  }

  var body = await request.json();
  var { genre, moods, bpm, vocal, instruments, lyricsMode, lyricsTheme, language, sectionLength, variationIndex } = body;

  if (!moods || moods.length === 0) moods = ["atmospheric"];
  if (!genre) genre = "ambient";
  if (!language) language = "en";
  if (!sectionLength) sectionLength = "normal";

  var prompt = generateStylePrompt({
    genre: genre,
    moods: moods,
    bpm: bpm || 80,
    vocal: vocal || "",
    instruments: instruments || []
  });

  var lyrics = "";
  var title = "";
  var tags = "";
  var isAI = false;

  // ===== Claude API 모드 (키가 있을 때) =====
  if (apiKey && validateApiKeyFormat(apiKey)) {
    var langInstruction = language === "ko" ? "Write all lyrics in Korean."
      : language === "both" ? "Write lyrics mixing English and Korean naturally."
      : "Write all lyrics in English.";

    var lengthInstruction = sectionLength === "long"
      ? "Write extended sections. Each verse should be 8-12 lines. Each chorus 6-8 lines. Include Pre-Chorus, Bridge, and Outro. Total minimum 40 lines."
      : sectionLength === "short"
      ? "Write concise sections. Each verse 4-6 lines. Each chorus 4 lines. Total minimum 20 lines."
      : "Write standard sections. Each verse 6-8 lines. Each chorus 4-6 lines. Include Pre-Chorus and Bridge. Total minimum 28 lines.";

    if (lyricsMode === "ai" || lyricsMode === "hybrid") {
      var lyricsUserPrompt = buildLyricsPrompt({
        genre: genre,
        moods: moods,
        theme: lyricsTheme || "freestyle - choose a compelling topic",
        vocal: vocal || "",
        language: language
      }) + "\n\n" + langInstruction + "\n" + lengthInstruction;

      var lyricsResult = await callClaude(apiKey, LYRICS_SYSTEM_PROMPT, lyricsUserPrompt);

      if (lyricsResult.success) {
        lyrics = lyricsResult.text;
        lyrics = filterBannedWords(lyrics);
        isAI = true;
      } else {
        lyrics = generateDemoLyrics(genre, moods, lyricsTheme, variationIndex);
        lyrics = filterBannedWords(lyrics);
      }
    }

    var metaPrompt = "Generate a song title and tags for:\nGenre: " + genre + "\nMood: " + moods.join(", ") + "\nTheme: " + (lyricsTheme || "freestyle") + "\n\nRespond in exactly this format (nothing else):\nTITLE: [one creative title, 2-4 words]\nTAGS: [8-10 hashtags separated by spaces]";
    var metaResult = await callClaude(apiKey, "You are a music metadata specialist. Respond only in the exact format requested.", metaPrompt, 200);

    if (metaResult.success) {
      var metaText = metaResult.text;
      var titleMatch = metaText.match(/TITLE:\s*(.+)/i);
      var tagsMatch = metaText.match(/TAGS:\s*(.+)/i);
      title = titleMatch ? filterBannedWords(titleMatch[1].trim()) : filterBannedWords(generateTitle(genre, moods));
      tags = tagsMatch ? tagsMatch[1].trim() : "";
      isAI = true;
    } else {
      title = filterBannedWords(generateTitle(genre, moods));
    }
  } else {
    // ===== 데모 모드 (키 없을 때) =====
    if (lyricsMode === "ai" || lyricsMode === "hybrid") {
      lyrics = generateDemoLyrics(genre, moods, lyricsTheme, variationIndex);
      lyrics = filterBannedWords(lyrics);
    }
    title = filterBannedWords(generateTitle(genre, moods));
  }

  if (!tags) {
    var genreTag = genre.toLowerCase().replace(/ /g, "").replace(/\//g, "");
    var moodTags = moods.map(function (m: string) { return "#" + m.toLowerCase(); }).join(" ");
    tags = "#" + genreTag + " " + moodTags + " #newmusic #spotify #aimusic #hitcraft";
  }

  return NextResponse.json({
    prompt: prompt,
    lyrics: lyrics,
    title: title,
    tags: tags,
    isAI: isAI
  });
}
